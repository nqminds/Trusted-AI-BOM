#!/usr/bin/env node

import { Command } from "commander";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import {
  generateAndSignVC,
  processVulnerabilityReport,
  generateVulnerabilityReport,
  generateKeyPair,
} from "../src/index.mjs";

import {
  writeKeysToFile,
  keypairDir,
  directoryExists,
  loadKey,
  vcToFile,
  getIdentityJson,
  getAndVerifyClaim,
  getHash,
  getMetadataHash,
  getStatsAsJson,
  runBashCommand
} from "./file-utils.mjs";

async function retrieveIdentity(identityEmail) {
  const privateKeyPath = path.join(keypairDir, identityEmail, "private.key");
  const publicKeyPath = path.join(keypairDir, identityEmail, "public.key");
  const identity = await getIdentityJson(identityEmail);

  if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    console.error(
      `Error: Keypair for identity email '${identityEmail}' does not exist.`
    );
    process.exit(1);
  }

  console.log(`Identity keys for '${identityEmail}' found.`);
  return { identity, privateKeyPath, publicKeyPath };
}

const program = new Command();

program
  .name("SDK for creating & verifying TAIBOMS")
  .description("CLI to create / document / sign & verify TAIBOM VC's")
  .version("0.0.3");

program
  .command("generate-identity")
  .description("Generate an identity with a keypair based on user input")
  .argument("<name>", "The name of the person")
  .argument("<email>", "The email of the person")
  .argument("<role>", "The role of the person")
  .option("--uuid <uuid>", "UUID")
  .option("--out <output_dir>", "Output directory")
  .action((name, email, role, options) => {
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();

    // Validate email format (basic check)
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      console.log("Invalid email format.");
      return;
    }

    const keypairPath = path.join(keypairDir, email);

    // Ensure the directory exists (create it if it doesn\'t)
    if (!directoryExists(keypairDir)) {
      fs.mkdirSync(keypairDir, { recursive: true });
    }
    console.log(`Generating keypair for email: ${email}...`);

    const { pub, priv } = generateKeyPair(keypairPath);
    const { privateKeyPath, publicKeyPath } = writeKeysToFile(
      keypairPath,
      priv,
      pub
    );

    const uuid = options.uuid ?? `urn:uuid:${uuidv4()}`;

    // Define identity object
    const identity = {
      name,
      email,
      uuid,
      pub,
      role,
    };

    const vc = generateAndSignVC(
      identity,
      email,
      "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/5-identity.v1.0.0.schema.yaml",
      loadKey(privateKeyPath, "uint8"),
      loadKey(publicKeyPath)
    );
    vcToFile(vc, `${keypairPath}-identity.json`, "identity.json", false);
    vcToFile(vc, outputDir, "identity.json");
  });

program
  .command("data-taibom")
  .description("Generate a Data TAIBOM")
  .argument("<identity_email>", "The email of the identity to sign this TAIBOM")
  .argument("<data_directory>", "The directory of the data")
  .option("--weights", "This data is AI weights", false)
  .option("--out <output_dir>", "Output directory")
  .action(async (identityEmail, dataDir, options) => {
    const { identity, privateKeyPath, publicKeyPath } = await retrieveIdentity(
      identityEmail
    );
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();

    // Verify the data directory exists
    if (!directoryExists(dataDir)) {
      console.error(`Error: Data directory '${dataDir}' does not exist.`);
      process.exit(1);
    }

    console.log(`Data directory '${dataDir}' verified.`);

    // Generate the hash of the directory contents
    const fileHashBashCommand = getHash(dataDir);

    try {
      const fileHash = await runBashCommand(fileHashBashCommand);
      const metadataHash = await runBashCommand(getMetadataHash(dataDir));

      const now = new Date();
      const lastAccessed = now.toISOString();

      const credentialSubject = {
        hash: fileHash,
        label: options.weights ? "Weights" : "Training",
        lastAccessed,
        location: {
          path: `file://${dataDir}`,
          type: "local",
        },
        name: path.parse(dataDir).name,
        metadata: {
          hash: metadataHash,
          rootMetadata: getStatsAsJson(dataDir),
        },
      };

      const vc = generateAndSignVC(
        credentialSubject,
        identity.credentialSubject.email,
        "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/10-data.v1.0.1.schema.yaml",
        loadKey(privateKeyPath, "uint8"),
        loadKey(publicKeyPath)
      );
      vcToFile(vc, outputDir, "data.json");
    } catch (err) {
      console.log(err);
    }
  });

program
  .command("generate-sbom")
  .description("Generate and sign an SBOM of code")
  .argument("<identity_email>", "The email of the identity to sign this TAIBOM")
  .argument("<code_directory>", "The directory of the code")
  .option("--out <output_dir>", "Output directory")
  .action(async (identityEmail, codeDirectory, options) => {
    const { identity, privateKeyPath, publicKeyPath } = await retrieveIdentity(
      identityEmail
    );
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();

    // Verify the code directory exists
    if (!directoryExists(codeDirectory)) {
      console.error(`Error: Code directory '${codeDirectory}' does not exist.`);
      process.exit(1);
    }
    console.log(`Code directory '${codeDirectory}' verified.`);

    // Generate SBOM and vulnerability report using Syft and Grype
    try {
      const { sbom, vulnerabilityReport } = await generateVulnerabilityReport(
        codeDirectory
      );

      const sbomTaibom = generateAndSignVC(
        sbom,
        identity.credentialSubject.email,
        "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/30-sbom.v1.0.0.schema.yaml",
        loadKey(privateKeyPath, "uint8"),
        loadKey(publicKeyPath)
      );
      vcToFile(sbomTaibom, outputDir, "sbom.json");
      // Process the vulnerabilities and create attestations
      const vulnerabilities = processVulnerabilityReport(vulnerabilityReport);
      vulnerabilities.map((jsonVulnerability) =>
        createAttestation(
          { type: "vulnerability", vulnerability: jsonVulnerability },
          { id: sbomTaibom.id, hash: sbomTaibom.proof.proofValue },
          { identity, privateKeyPath, publicKeyPath },
          "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/63-vulnerability-attestation.v1.0.0.schema.yaml",
          outputDir
        )
      );
    } catch (error) {
      console.error("Error generating SBOM or vulnerability report:", error);
      process.exit(1);
    }
  });

program
  .command("code-taibom")
  .description("Generate and sign a TAIBOM of code")
  .argument("<identity_email>", "The email of the identity to sign this TAIBOM")
  .argument("<code_directory>", "The directory of the code / package")
  .argument("<version>", "Code version number")
  .option("--sbomTaibom <path>", "[OPTIONAL] SBOM TAIBOM claim", false)
  .option("--name <code_name>", "[OPTIONAL] Name of code or package", false)
  .option("--out <output_dir>", "Output directory")
  .action(async (identityEmail, codeDirectory, version, options) => {
    const { identity, privateKeyPath, publicKeyPath } = await retrieveIdentity(
      identityEmail
    );
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();

    const codeName = path.basename(codeDirectory);
    // Verify the code directory exists
    if (!directoryExists(codeDirectory)) {
      console.error(`Error: Code directory '${codeDirectory}' does not exist.`);
      process.exit(1);
    }

    const bashCommand = getHash(codeDirectory);

    let sbom = null;

    if (options.sbomTaibom) {
      const sbomVc = await getAndVerifyClaim(options.sbomTaibom, "sbom");
      sbom = { id: sbomVc.id, hash: sbomVc.proof.proofValue };
    }
    try {
      const fileHash = await runBashCommand(bashCommand);
      const metadataHash = await runBashCommand(getMetadataHash(codeDirectory));
      const rootMetadata  = getStatsAsJson(codeDirectory);

      const metadata = {
        hash: metadataHash,
        rootMetadata
      }
      const credentialSubject = !!sbom
        ? {
            hash: { value: fileHash },
            location: {
              path: `file://${codeDirectory}`,
              type: "local",
            },
            name: options.name ? options.name : codeName,
            version,
            sbom: sbom,
            metadata
          }
        : {
            hash: { value: fileHash },
            location: {
              path: `file://${codeDirectory}`,
              type: "local",
            },
            name: options.name ? options.name : codeName,
            version,
            metadata
          };
      const vc = generateAndSignVC(
        credentialSubject,
        identity.credentialSubject.email,
        "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/40-code.v1.0.1.schema.yaml",
        loadKey(privateKeyPath, "uint8"),
        loadKey(publicKeyPath)
      );
      vcToFile(vc, outputDir, "code.json");
    } catch (error) {
      console.error(`Error generating hash: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command("system-taibom")
  .description("Generate and sign a TAIBOM of a AI system")
  .argument("<identity_email>", "The email of the identity to sign this TAIBOM")
  .argument("<code_taibom>", "Path to code TAIBOM claim")
  .argument("<data_taibom>", "Path to code TAIBOM claim")
  .option("--name <code_name>", "[OPTIONAL] Name of system or package", false)
  .option("--inferencing", "Label this AI system as inferencing")
  .option("--out <output_dir>", "Output directory")
  .action(async (identityEmail, codeTaibomPath, dataTaibomPath, options) => {
    const { identity, privateKeyPath, publicKeyPath } = await retrieveIdentity(
      identityEmail
    );
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();

    const codeTaibom = await getAndVerifyClaim(codeTaibomPath, "code");
    const dataTaibom = await getAndVerifyClaim(dataTaibomPath, [
      "data",
      "data-pack",
    ]);

    const label = options.inferencing ? "Inferencing" : "Training";

    const credentialSubject = {
      code: { id: codeTaibom.id, hash: codeTaibom.proof.proofValue },
      data: { id: dataTaibom.id, hash: dataTaibom.proof.proofValue },
      label,
      name: options.name || codeTaibom.credentialSubject.name,
    };
    const vc = generateAndSignVC(
      credentialSubject,
      identity.credentialSubject.email,
      "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml",
      loadKey(privateKeyPath, "uint8"),
      loadKey(publicKeyPath)
    );
    vcToFile(vc, outputDir, "ai-system.json");
  });

program
  .command("datapack-taibom")
  .description("Generate and sign a TAIBOM of a datapack")
  .argument("<identity_email>", "The email of the identity to sign this TAIBOM")
  .argument("<name>", "The dataset name")
  .argument(
    "<data_taiboms...>",
    "List of file or directory paths (space-separated)"
  )
  .option("--out <output_dir>", "Output directory")
  .action(async (identityEmail, name, dataTaibomPaths, options) => {
    const { identity, privateKeyPath, publicKeyPath } = await retrieveIdentity(
      identityEmail
    );
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();

    const datasets = await Promise.all(
      dataTaibomPaths.map(async (p) => {
        const dataTaibom = await getAndVerifyClaim(p, "data");
        return { id: dataTaibom.id, hash: dataTaibom.proof.proofValue };
      })
    );

    const credentialSubject = {
      name,
      datasets,
    };

    const vc = generateAndSignVC(
      credentialSubject,
      identity.credentialSubject.email,
      "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/20-data-pack.v1.0.0.schema.yaml",
      loadKey(privateKeyPath, "uint8"),
      loadKey(publicKeyPath)
    );
    vcToFile(vc, outputDir, "datapack.json");
  });

program
  .command("config-taibom")
  .description("Generate and sign a TAIBOM of an AI systems config")
  .argument("<identity_email>", "The email of the identity to sign this TAIBOM")
  .argument("<ai_system_taibom>", "AI system TAIOBOM path")
  .argument("<data_taibom>", "Path to data configs")
  .option("--name <config_name>", "[OPTIONAL] Name of configs", false)
  .option("--out <output_dir>", "Output directory")
  .action(
    async (identityEmail, aiSystemTaibomPath, dataTaibomPath, options) => {
      const { identity, privateKeyPath, publicKeyPath } =
        await retrieveIdentity(identityEmail);
      let outputDir = options.out ? path.resolve(options.out) : process.cwd();

      const aiSystem = await getAndVerifyClaim(aiSystemTaibomPath, "ai-system");
      const data = await getAndVerifyClaim(dataTaibomPath, [
        "data",
        "data-pack",
      ]);

      const credentialSubject = {
        aiSystem: { id: aiSystem.id, hash: aiSystem.proof.proofValue },
        data: { id: data.id, hash: data.proof.proofValue },
        name: options.name || data.credentialSubject.name,
      };

      const vc = generateAndSignVC(
        credentialSubject,
        identity.credentialSubject.email,
        "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/25-config.v1.0.0.schema.yaml",
        loadKey(privateKeyPath, "uint8"),
        loadKey(publicKeyPath)
      );
      vcToFile(vc, outputDir, "config.json");
    }
  );

async function validateLocationHash(claim) {
  const file_location = claim.credentialSubject.location.path;
  const bashCommand = getHash(`${file_location}`);

  console.log("Rehashing file location & Verifying");
  try {
    const hash = await runBashCommand(bashCommand);

    if (
      (!!claim.credentialSubject.hash.value &&
        claim.credentialSubject.hash.value !== hash) ||
      (!claim.credentialSubject.hash.value &&
        claim.credentialSubject.hash !== hash)
    )
      throw new Error(
        `File hash is not validated, ${claim.credentialSubject.hash} does not equal ${hash}! have you changed anything?`
      );
    else console.log("TAIBOM claim", claim.id, "hash VALIDATED");
  } catch (error) {
    console.error(`Error generating hash: ${error.message}`);
    process.exit(1);
  }
}

async function validateMetadataHash(claim) {
  const file_location = claim.credentialSubject.location.path;
  const bashCommand = getMetadataHash(`${file_location}`);

  console.log("Rehashing file location & Verifying");
  try {
    const hash = await runBashCommand(bashCommand);

    if (
      !!claim.credentialSubject.metadata.hash &&
      claim.credentialSubject.metadata.hash !== hash
    )
      console.warn(
        `metadata is not validated, ${claim.credentialSubject.metadata.hash} does not equal ${hash}!`
      );
    else console.log("TAIBOM claim", claim.id, "metadata VALIDATED");
  } catch (error) {
    console.error(`Error generating hash: ${error.message}`);
    process.exit(1);
  }
}

program
  .command("validate")
  .description(
    "Validate a TAIBOM claim has been signed by the issuer and has not been tampered with"
  )
  .argument("<taibom>", "Path to TAIBOM claim")
  .action(async (taibom) => {
    const dataClaim = await getAndVerifyClaim(taibom);
    if (dataClaim) {
      console.log("Claim successfully verified");
    } else {
      console.log("Claim cannot be verified");
    }
  });

// Validation functions
program
  .command("validate-data")
  .description("Validate a TAIBOM data claim, and its hash")
  .argument("<data_taibom>", "Path to TAIBOM data claim")
  .option("--out <output_dir>", "Output directory")
  .action(async (taibom, options) => {
    try {
      const dataClaim = await getAndVerifyClaim(taibom, "data");

      // Verify it is a data vc
      if (
        !dataClaim.credentialSchema.id.includes(
          "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/10-data"
        )
      ) {
        throw new Error("This is not a TAIBOM data claim");
      }

      await validateLocationHash(dataClaim);
      await validateMetadataHash(dataClaim);
    } catch (err) {
      console.log(err);
      throw new Error(`Validation failed for claim at ${taibom}`);
    }
  });

program
  .command("validate-code")
  .description("Validate a TAIBOM code claim, and its hash")
  .argument("<code_taibom>", "Path to TAIBOM code claim")
  .option("--out <output_dir>", "Output directory")
  .action(async (taibom, options) => {
    try {
      const codeClaim = await getAndVerifyClaim(taibom, "code");
      if (!codeClaim) {
        throw new Error("Claim cannot be retrieved or verified");
      }

      if (
        !codeClaim.credentialSchema.id.includes(
          "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/40-code"
        )
      )
        throw new Error("This is not a TAIBOM code claim");

      await validateLocationHash(codeClaim);
      await validateMetadataHash(codeClaim);
    } catch (err) {
      console.log(err);
      throw new Error(`Validation failed for claim at ${taibom}`);
    }
  });

function createAttestation(
  attestation,
  taibom,
  identity,
  schemaName = "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/60-attestation.v1.0.0.schema.yaml",
  outputDir
) {
  const { identity: identityJson, privateKeyPath, publicKeyPath } = identity;
  const credentialSubject = {
    attestation,
    component: taibom,
  };

  const vc = generateAndSignVC(
    credentialSubject,
    identityJson.credentialSubject.email,
    schemaName,
    loadKey(privateKeyPath, "uint8"),
    loadKey(publicKeyPath)
  );
  vcToFile(vc, outputDir, "attestation.json");
}

program
  .command("attest")
  .description(
    "Function by which an attestation can be made about a TAIBOM component"
  )
  .argument("<identity_email>", "The email of the identity to sign this TAIBOM")
  .argument(
    "<taibom_component_path>",
    "The path to the TAIBOM component VC to make an attestation about"
  )
  .argument("<attestation_json_path>", "Path to attestation to be made")
  .option("--out <output_dir>", "Output directory")
  .option(
    "--type <attestation_type>",
    "Type of attestation",
    (val) => {
      const allowedValues = ["sbom", "licence", "vulnerability"];
      if (!allowedValues.includes(val)) {
        throw new Error(
          `Invalid type. Allowed values are: ${allowedValues.join(", ")}`
        );
      }
      return type;
    },
    null
  )
  .action(async (identityEmail, taibomVc, attestationPath, options) => {
    const identity = await retrieveIdentity(identityEmail);
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();

    const taibom = await getAndVerifyClaim(taibomVc);
    const jsonFile = fs.readFileSync(attestationPath, "utf8");
    const attestation = JSON.parse(jsonFile);

    if (options.type) {
      let val =
        "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/63-vulnerability-attestation.v1.0.0.schema.yaml";

      if (options.type === "sbom") {
        val =
          "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/62-sbom-attestation.v1.0.0.schema.yaml";
      } else if (options.type === "licence") {
        val =
          "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/61-license-attestation.v1.0.0.schema.yaml";
      }

      createAttestation(
        { type: options.type, ...attestation },
        { id: taibom.id, hash: taibom.proof.proofValue },
        identity,
        val,
        outputDir
      );
    } else {
      createAttestation(
        attestation,
        { id: taibom.id, hash: taibom.proof.proofValue },
        identity,
        "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/60-attestation.v1.0.0.schema.yaml",
        outputDir
      );
    }
  });

program.parse(process.argv);
