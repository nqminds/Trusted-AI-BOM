#!/usr/bin/env node

import { Command } from "commander";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import got from 'got';
import {voltUtils} from '@tdxvolt/volt-client-web/js';
import readline from 'readline';
import { cookieJar, URI, BASE_PATH, ENDPOINTS, saveCookies } from "../src/api-tools.mjs";

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
} from "./file-utils.mjs";

// Create API client with cookie support
const apiClient = got.extend({
  prefixUrl: URI.replace(/\/$/, '')+BASE_PATH, // Remove trailing slash if present
  cookieJar: cookieJar,
  responseType: 'json',
  hooks: {
    afterResponse: [
      (response) => {
        saveCookies(); // Save cookies after each request
        return response;
      }
    ]
  }
});

function runBashCommand(bashCommand, callback) {
  exec(bashCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Command failed: ${error.message}`);
      return callback ? callback(error) : process.exit(1);
    }
    if (stderr) {
      console.error(`Command error: ${stderr}`);
      return callback ? callback(new Error(stderr)) : process.exit(1);
    }
    if (callback) callback(null, stdout.trim());
  });
}

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

async function getChallenge() {
  try {
    const response = await apiClient.get(ENDPOINTS.CHALLENGE, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.body; // Return just the parsed JSON body
  } catch (error) {
    console.error('Error getting challenge:', error.message);
    throw error;
  }
}


async function verifyWithChallenge(idVC,priv) {//keys is from useKeys
  const nonce = getChallenge();
  const hashedNonce = await hashNonce(nonce);
  const { signature, data } = await signNonce(hashedNonce, priv);
  const response = await authenticate(signature, idVC, data);

  return response;
}




async function authenticate(signature, idVC, signedData) {
  //TODO: implement cookie functionality into this 

  try {
    const response = await apiClient.post(ENDPOINTS.AUTHENTICATE, {
      json: { signature, idVC, signedData },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response; // got automatically parses JSON responses
  } catch (error) {
    console.error('Authentication error:', error.message);
    if (error.response) {
      // Handle response error (e.g., 401, 403)
      console.error('Status code:', error.response.statusCode);
      console.error('Response body:', error.response.body);
    }
    throw error;
  }
}

export async function hashNonce(nonce) {
  const encoder = new TextEncoder();
  const data = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hashBuffer);
}


/**
 * Converts a base64 ED25519 key directly to PEM format without using node-forge's ASN.1 encoder
 * @param {string} base64Key - The base64-encoded key
 * @param {string} keyType - The type of key ("PRIVATE KEY" or "PUBLIC KEY") 
 * @returns {string} - PEM formatted key
 */
function getPemFromKey(base64Key, keyType = "PRIVATE KEY") {
  // Pre-encoded ASN.1 DER structures for ED25519 keys
  // These templates follow the RFC 8032 format
  
  // Templates contain placeholder for the actual key bytes
  const PRIV_KEY_PREFIX = Buffer.from([
    // SEQUENCE
    0x30, 0x2e, 
      // INTEGER (version)
      0x02, 0x01, 0x00,
      // SEQUENCE (algorithm)
      0x30, 0x05,
        // OID (Ed25519)
        0x06, 0x03, 0x2B, 0x65, 0x70,
      // OCTET STRING (contains the key)
      0x04, 0x22, 
        // OCTET STRING (key bytes)
        0x04, 0x20
  ]);
  
  const PUB_KEY_PREFIX = Buffer.from([
    // SEQUENCE
    0x30, 0x2a,
      // SEQUENCE (algorithm)
      0x30, 0x05,
        // OID (Ed25519)
        0x06, 0x03, 0x2B, 0x65, 0x70,
      // BIT STRING (contains the key)
      0x03, 0x21, 0x00
  ]);
  
  // Get the raw key bytes
  const keyBytes = Buffer.from(base64Key, 'base64');
  
  // Choose the correct prefix based on key type
  const prefix = keyType === "PRIVATE KEY" ? PRIV_KEY_PREFIX : PUB_KEY_PREFIX;
  
  // Combine prefix and key bytes
  const derBytes = Buffer.concat([prefix, keyBytes]);
  
  // Convert to base64
  const base64Der = derBytes.toString('base64');
  
  // Format as PEM
  return formatAsPem(base64Der, keyType);
}

/**
 * Format base64-encoded DER data as a PEM string
 */
function formatAsPem(base64Der, keyType) {
  const pemHeader = `-----BEGIN ${keyType}-----`;
  const pemFooter = `-----END ${keyType}-----`;
  
  // Split base64 into lines of 64 characters
  const formattedKey = base64Der.match(/.{1,64}/g).join('\n');
  
  return `${pemHeader}\n${formattedKey}\n${pemFooter}`;
}

async function signNonce(nonce, priv) {
  // get the key from memory and convert it to a usable format
  const clientKey = getPemFromKey(priv, "PRIVATE KEY");
  // Convert nonce to ArrayBuffer for signing
  const encoder = new TextEncoder();
  const data = encoder.encode(nonce);
  const {signBase64,ed25519} = voltUtils;
  const signature1 = signBase64(clientKey, data,ed25519,"raw");
  const signatureArray = Buffer.from(signature1,'base64');
  const sigArray2 = new Uint8Array(signatureArray);
  console.log("Signature:", signature1);
  console.log("Signature Array:", sigArray2);
  return { "signature": sigArray2, "data": data };
}  

function convertNonce(nonceObj) {
  // Get all keys and sort them numerically
  const keys = Object.keys(nonceObj).sort((a, b) => parseInt(a) - parseInt(b));
  
  // Create a new Uint8Array of the correct length
  const bytes = new Uint8Array(keys.length);
  
  // Fill the array with values from the nonce object
  keys.forEach((key, index) => {
    bytes[index] = nonceObj[key];
  });
  
  return bytes;
}

/**
 * Function to get user input (equivalent to Python's input())
 * @param {string} prompt - The message to display to the user
 * @returns {Promise<string>} - The user's input
 */
function getUserInput(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function verify_email(email, pub, priv) {
  const {
    signBase64, signingPublicKeyFromPem, stripPemHeaders, toBase64Url, randomBytes

  } = voltUtils;
  console.log("public ley", pub);
  const pub_pem = getPemFromKey(pub, "PUBLIC KEY");
  const priv_pem = getPemFromKey(priv, "PRIVATE KEY");
  const nonce = toBase64Url(randomBytes(16));
  const signature = signBase64(priv_pem, email + nonce);
  const send_key = stripPemHeaders(pub_pem);

  const postData = {
    "email": email,
    "key": send_key,
    "signature": signature,
    "nonce": nonce,
    "returnUrl": "https://taibom.org/"
  };
  
  console.log("Post data:", postData);
  const authUrlCheckResponse = await apiClient.post("generateBinding", {
    json: postData,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log("Auth URL Check Response:", authUrlCheckResponse.body);
  const authStatusUrl = authUrlCheckResponse.body.authStatusUrl;
  console.log("Auth Status URL:", authStatusUrl);
  var idVC;
  let text_input = await getUserInput("Press enter when verified, type back to abort verification");
  while (text_input !== "back") {
    // check the idVC is verified
    // get request to authStatusUrl, if pending then next loop else return the json body, this is an absolute new url not part of the api so shouldnt use apiclient

    const authStatusResponse = await fetch(authStatusUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!authStatusResponse.ok) {
      console.error('Error fetching auth status:', authStatusResponse.statusText);
      break;
    }
    const authStatusData = await authStatusResponse.json();
    console.log("Auth Status Data:", authStatusData);
    if (authStatusData.status === "pending") {
      console.log("Auth Status: pending");
      text_input = await getUserInput("Press enter when verified, type back to abort verification");
    } else{
      console.log("Auth Status: verified");
      idVC = authStatusData;
      console.log("ID VC:", idVC);
      break;
    }
    
  }
  if (text_input === "back") {
    console.log("Verification aborted");
    return;
  }
  const localToken = await verifyWithChallenge(idVC,priv)
  console.log("Local Token:", localToken);
  // return the idVC or an error if escaped using endpoint /identity + ?email=<email>
  const idVCresponse = await fetch(`${URI}${BASE_PATH}/${ENDPOINTS.IDENTITY}?email=${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  // Parse the JSON response
  const idVCBody = await idVCresponse.json();
  console.log("ID VC response:",idVCBody);
  return idVCBody;


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
    // TODO: 
    const key_email_binding = verify_email(email, pub, priv);

    
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
    const bashCommand = getHash(dataDir);

    runBashCommand(bashCommand, (error, hash) => {
      if (error) {
        console.error(`Error generating hash: ${error.message}`);
        process.exit(1);
      }

      const now = new Date();
      const lastAccessed = now.toISOString();

      const credentialSubject = {
        hash,
        label: options.weights ? "Weights" : "Training",
        lastAccessed,
        location: {
          path: `file://${dataDir}`,
          type: "local",
        },
        name: path.parse(dataDir).name,
      };

      const vc = generateAndSignVC(
        credentialSubject,
        identity.credentialSubject.email,
        "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/10-data.v1.0.0.schema.yaml",
        loadKey(privateKeyPath, "uint8"),
        loadKey(publicKeyPath)
      );
      vcToFile(vc, outputDir, "data.json");
    });
  });

program
  .command("generate-sbom")
  .description("Generate and sign an SBOM of code")
  .argument("<identity_email>", "The email of the identity to sign this TAIBOM")
  .argument("<code_directory>", "The directory of the code")
  .option("--cpp", "[OPTIONAL] Generate a SBOM for C/C++ code", false)
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
  .argument("<code_directory>", "The directory of the data")
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
    console.log(`Code directory '${codeDirectory}' verified.`);

    const bashCommand = getHash(codeDirectory);

    let sbom = null;

    if (options.sbomTaibom) {
      const sbomVc = await getAndVerifyClaim(options.sbomTaibom);
      sbom = { id: sbomVc.id, hash: sbomVc.proof.proofValue };
    }

    runBashCommand(bashCommand, (error, hash) => {
      if (error) {
        console.error(`Error generating hash: ${error.message}`);
        process.exit(1);
      }

      const credentialSubject = !!sbom
        ? {
            hash: { value: hash },
            location: {
              path: `file://${codeDirectory}`,
              type: "local",
            },
            name: options.name ? options.name : codeName,
            version,
            sbom: sbom,
          }
        : {
            hash: { value: hash },
            location: {
              path: `file://${codeDirectory}`,
              type: "local",
            },
            name: options.name ? options.name : codeName,
            version,
          };
      const vc = generateAndSignVC(
        credentialSubject,
        identity.credentialSubject.email,
        "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/40-code.v1.0.0.schema.yaml",
        loadKey(privateKeyPath, "uint8"),
        loadKey(publicKeyPath)
      );
      vcToFile(vc, outputDir, "code.json");
    });
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

    const codeTaibom = await getAndVerifyClaim(codeTaibomPath);
    const dataTaibom = await getAndVerifyClaim(dataTaibomPath);

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
        const dataTaibom = await getAndVerifyClaim(p);
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
  .argument("<ai_system_taibom>", "AI system TAIBOM path")
  .argument("<data_taibom>", "Path to data configs")
  .option("--name <config_name>", "[OPTIONAL] Name of configs", false)
  .option("--out <output_dir>", "Output directory")
  .action(
    async (identityEmail, aiSystemTaibomPath, dataTaibomPath, options) => {
      const { identity, privateKeyPath, publicKeyPath } =
        await retrieveIdentity(identityEmail);
      let outputDir = options.out ? path.resolve(options.out) : process.cwd();

      const aiSystem = await getAndVerifyClaim(aiSystemTaibomPath);
      const data = await getAndVerifyClaim(dataTaibomPath);

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

function validateLocationHash(claim) {
  const file_location = claim.credentialSubject.location.path;
  const bashCommand = getHash(`${file_location}`);

  console.log("Rehashing file location & Verifying");
  runBashCommand(bashCommand, (error, hash) => {
    if (error) {
      console.error(`Error generating hash: ${error.message}`);
      process.exit(1);
    }
    if (
      (!!claim.credentialSubject.hash.value &&
        claim.credentialSubject.hash.value !== hash) ||
      (!claim.credentialSubject.hash.value &&
        claim.credentialSubject.hash !== hash)
    )
      throw new Error(
        `Hash is not validated, ${claim.credentialSubject.hash} does not equal ${hash}! have you changed anything?`
      );
    else console.log("TAIBOM claim", claim.id, "VALIDATED");
  });
}

program
  .command("validate")
  .description("Validate a TAIBOM claim")
  .argument("<taibom>", "Path to TAIBOM data claim")
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
  .description("Validate a TAIBOM data claim")
  .argument("<data_taibom>", "Path to TAIBOM data claim")
  .option("--out <output_dir>", "Output directory")
  .action(async (taibom, options) => {
    try {
      const dataClaim = await getAndVerifyClaim(taibom);

      // Verify it is a data vc
      if (
        dataClaim.credentialSchema.id !==
        "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/10-data.v1.0.0.schema.yaml"
      )
        throw new Error("This is not a TAIBOM data claim");

      validateLocationHash(dataClaim);
    } catch (err) {
      console.log(err);
      throw new Error(`Validation failed for claim at ${taibom}`);
    }
  });

program
  .command("validate-code")
  .description("Validate a TAIBOM code claim")
  .argument("<code_taibom>", "Path to TAIBOM code claim")
  .option("--out <output_dir>", "Output directory")
  .action(async (taibom, options) => {
    try {
      const codeClaim = await getAndVerifyClaim(taibom);
      if (!codeClaim) {
        throw new Error("Claim cannot be retrieved or verified");
      }

      // Verify it is a data vc
      if (
        codeClaim.credentialSchema.id !==
        "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/40-code.v1.0.0.schema.yaml"
      )
        throw new Error("This is not a TAIBOM code claim");

      validateLocationHash(codeClaim);
    } catch (err) {
      console.log(err);
      throw new Error(`Validation failed for claim at ${taibom}`);
    }
  });

// program
//   .command("generate-vc")
//   .description("Generate and sign a TAIBOM VC")
//   .argument("<json_data_file>", "Path to Json data to be signed")
//   .argument("<schema_name>", "Name of the TAIBOM schema (include .json extension)")
//   .argument("<signing_key_path>", "Signing Key")
//   .option("--uuid <issuer_uuid>", "Issuer UUID", null)
//   .option("--out <output_dir>", "Output directory")
//   .action((dataFile, schemaName, signingKeyPath, options) => {
//     const credentialSubject = getAndVerifyClaim(dataFile, false);
//     let uuid = options.uuid ?? `urn:uuid:${uuidv4()}`;
//     let outputDir = options.out ? path.resolve(options.out) : process.cwd();
//     generateAndSignVC(credentialSubject, uuid, schemaName, signingKeyPath, outputDir)
//   })

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
    const attestation = await getAndVerifyClaim(attestationPath, false);

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
