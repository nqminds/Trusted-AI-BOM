#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const path = require('path'); // Renamed to avoid conflict with 'path'
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const os = require('os');

const { keypairDir, directoryExists, getIdentityJson, runBashCommand, generateAndSignVC, getAndVerifyClaim, getHash} = require('../src');
const { processVulnerabilityReport } = require('../src/utils');

function retrieveIdentity(identityEmail) {
  const privateKeyPath = path.join(keypairDir, `${identityEmail}-priv`);
  const publicKeyPath = path.join(keypairDir, `${identityEmail}-pub`);
  const identity = getIdentityJson(identityEmail)

  if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    console.error(`Error: Keypair for identity email '${identityEmail}' does not exist.`);
    process.exit(1);
  }

  console.log(`Identity keys for '${identityEmail}' found.`);
  return {identity, privateKeyPath, publicKeyPath}
}


program
  .name("SDK for creating & verifying TAIBOMS")
  .description("CLI to create / document / sign & verify TAIBOM VC's")
  .version('0.0.1');

program
  .command('generate-identity')
  .description('Generate an identity with a keypair based on user input')
  .argument('<name>', 'The name of the person')
  .argument('<email>', 'The email of the person')
  .argument('<role>', 'The role of the person')
  .option("--uuid <uuid>", "UUID")
  .option("--out <output_dir>", "Output directory")
  .action((name, email, role, options) => {
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();

    // Validate email format (basic check)
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      console.log('Invalid email format.');
      return;
    }

    // Ensure the directory exists (create it if it doesn't)
    if (!directoryExists(keypairDir)) {
      fs.mkdirSync(keypairDir);
    }
    const keypairPath = path.join(keypairDir, email);

    console.log(`Generating keypair for email: ${email}...`);
  
    // Paths for the private and public keys
    const privateKeyPath = `${keypairPath}-priv`;
    const publicKeyPath = `${keypairPath}-pub`;
  
    // Build the Bash command to generate the keypair
    const bashCommand = `vc_tools_cli gen-keys ${privateKeyPath} ${publicKeyPath}`;
    // Generate keys for the user
    runBashCommand(bashCommand);

    const uuid = options.uuid?? `urn:uuid:${uuidv4()}`;

    // Define identity object
    const identity = {
      name,
      email,
      uuid,
      pub: publicKeyPath,
      role
    };

    generateAndSignVC(identity, uuid, "identity.json", privateKeyPath, `${keypairPath}-identity.json`, false);
    generateAndSignVC(identity, uuid, "identity.json", privateKeyPath, outputDir);

  });

program
  .command("data-taibom")
  .description("Generate a Data TAIBOM")
  .argument('<identity_email>', 'The email of the identity to sign this TAIBOM')
  .argument('<data_directory>', 'The directory of the data')
  .option("--weights", "This data is AI weights", false)
  .option("--out <output_dir>", "Output directory")
  .action((identityEmail, dataDir, options) => {
    const {identity, privateKeyPath, publicKeyPath} = retrieveIdentity(identityEmail)
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
          type: "local"
        },
        name: path.parse(dataDir).name,
      }
      
      generateAndSignVC(credentialSubject, identity.credentialSubject.uuid, "data.json", privateKeyPath, outputDir);
    });
  });
  
program
  .command("generate-sbom")
  .description("Generate and sign an SBOM of code")
  .argument('<identity_email>', 'The email of the identity to sign this TAIBOM')
  .argument('<code_directory>', 'The directory of the data')
  .option("--cpp", "[OPTIONAL] Generate a SBOM for C/C++ code", false)
  .option("--out <output_dir>", "Output directory")
  .action((identityEmail, codeDirectory, options) => {
    const {identity, privateKeyPath, publicKeyPath} = retrieveIdentity(identityEmail);
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();

    const tempDir = os.tmpdir();
    const codeName = path.basename(codeDirectory)
    // Verify the code directory exists
    if (!directoryExists(codeDirectory)) {
      console.error(`Error: Code directory '${codeDirectory}' does not exist.`);
      process.exit(1);
    }
    const escapedDir = `"${codeDirectory}"`;
    console.log(`Code directory '${codeDirectory}' verified.`);

    let cliCommand = ""
    if(options.cpp) {
      cliCommand += "generateCCPPReport";
    } else {
      cliCommand += "generateSbom"; 
    }

    const bashCommand = `nqmvul -${cliCommand} ${escapedDir} "${codeName}" --out ${tempDir}`
    console.log("Creating the SBOM")

    runBashCommand(bashCommand, () => {
      const sbomDir = path.join(tempDir, `${codeName}.json`);
      if(!directoryExists(sbomDir)) {
        console.error(`Error: SBOM directory '${sbomDir}' does not exist.`);
        process.exit(1);
      }
      const credentialSubject = getAndVerifyClaim(sbomDir, false);
  

      generateAndSignVC(credentialSubject, identity.credentialSubject.uuid, "sbom.json", privateKeyPath, outputDir, (sbomTaibompath) => {
        const sbomTaibom = getAndVerifyClaim(sbomTaibompath)
        const vulnerabilities = processVulnerabilityReport(path.join(tempDir, `vulnerability_report_${codeName}`))
    
        vulnerabilities.map((jsonVulnerability) => createAttestation(
          {type: "vulnerability", vulnerability: jsonVulnerability},
          {id: sbomTaibom.id, hash: sbomTaibom.proof.proofValue},
          {identity, privateKeyPath, publicKeyPath},
          "vulnerability-attestation.json",
          outputDir
        ))
      }, true, true);

     

    });
  })

program
  .command("code-taibom")
  .description("Generate and sign a TAIBOM of code")
  .argument('<identity_email>', 'The email of the identity to sign this TAIBOM')
  .argument('<code_directory>', 'The directory of the data')
  .argument("<version>", "Code version number")
  .option("--sbomTaibom <path>", "[OPTIONAL] SBOM TAIBOM claim", false)
  .option("--name <code_name>", "[OPTIONAL] Name of code or package", false)
  .option("--out <output_dir>", "Output directory")
  .action((identityEmail, codeDirectory, version, options) => {
    const {identity, privateKeyPath, publicKeyPath} = retrieveIdentity(identityEmail);
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();

    const codeName = path.basename(codeDirectory);
    // Verify the code directory exists
    if (!directoryExists(codeDirectory)) {
      console.error(`Error: Code directory '${codeDirectory}' does not exist.`);
      process.exit(1);
    }
    console.log(`Code directory '${codeDirectory}' verified.`);

    const bashCommand = getHash(codeDirectory);

    let sbom = undefined;

    if(options.sbomTaibom){
      const sbomVc = getAndVerifyClaim(options.sbomTaibom);
      sbom = {id: sbomVc.id, hash: sbomVc.proof.proofValue}
    }


    runBashCommand(bashCommand, (error, hash) => {
      if (error) {
        console.error(`Error generating hash: ${error.message}`);
        process.exit(1);
      }


      const credentialSubject = {
        hash: {value: hash},
        location: {
          path: `file://${codeDirectory}`,
          type: "local",
        },
        name: options.name? options.name : codeName,
        version,
        sbom
      }
      generateAndSignVC(credentialSubject, identity.credentialSubject.uuid, "code.json", privateKeyPath, outputDir);

    })
  });

program
  .command("system-taibom")
  .description("Generate and sign a TAIBOM of a AI system")
  .argument('<identity_email>', 'The email of the identity to sign this TAIBOM')
  .argument("<code_taibom>", "Path to code TAIBOM claim")
  .argument("<data_taibom>", "Path to code TAIBOM claim")
  .option("--name <code_name>", "[OPTIONAL] Name of system or package", false)
  .option("--inferencing", "Label this AI system as inferencing")
  .option("--out <output_dir>", "Output directory")
  .action((identityEmail, codeTaibomPath, dataTaibomPath, options) => {
    const {identity, privateKeyPath, publicKeyPath} = retrieveIdentity(identityEmail);
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();

    const codeTaibom = getAndVerifyClaim(codeTaibomPath);
    const dataTaibom = getAndVerifyClaim(dataTaibomPath);

    const label = options.inferencing ? "Inferencing" : "Training"

    const credentialSubject = {
      code: {id: codeTaibom.id, hash: codeTaibom.proof.proofValue},
      data: {id: dataTaibom.id, hash: dataTaibom.proof.proofValue},
      label,
      name: options.name || codeTaibom.credentialSubject.name
    }
    generateAndSignVC(credentialSubject, identity.credentialSubject.uuid, "ai-system.json", privateKeyPath, outputDir);

  })

program
  .command("datapack-taibom")
  .description("Generate and sign a TAIBOM of a datapack")
  .argument('<identity_email>', 'The email of the identity to sign this TAIBOM')
  .argument('<name>', 'The dataset name')
  .argument('<data_taiboms...>', 'List of file or directory paths (space-separated)')
  .option("--out <output_dir>", "Output directory")
  .action((identityEmail, name, dataTaibomPaths, options) => {
    const {identity, privateKeyPath, publicKeyPath} = retrieveIdentity(identityEmail);
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();

    const datasets = dataTaibomPaths.map(path => {
      dataTaibom = getAndVerifyClaim(path)
      return {id: dataTaibom.id, hash: dataTaibom.proof.proofValue}
    });

    const credentialSubject = {
      name, datasets
    }

    generateAndSignVC(credentialSubject, identity.credentialSubject.uuid, "datapack.json", privateKeyPath, outputDir);

  });

program
  .command("config-taibom")
  .description("Generate and sign a TAIBOM of an AI systems config")
  .argument('<identity_email>', 'The email of the identity to sign this TAIBOM')
  .argument('<ai_system_taibom>', 'AI system TAIOBOM path')
  .argument('<data_taibom>', 'Path to data configs') 
  .option("--name <config_name>", "[OPTIONAL] Name of configs", false)
  .option("--out <output_dir>", "Output directory")
  .action((identityEmail, aiSystemTaibomPath, dataTaibomPath, options) => {
    const {identity, privateKeyPath, publicKeyPath} = retrieveIdentity(identityEmail);
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();

    const aiSystem = getAndVerifyClaim(aiSystemTaibomPath);
    const data = getAndVerifyClaim(dataTaibomPath);

    const credentialSubject = {
      aiSystem: {id: aiSystem.id, hash: aiSystem.proof.proofValue}, data: {id: data.id, hash: data.proof.proofValue}, name: options.name || data.credentialSubject.name
    }

    generateAndSignVC(credentialSubject, identity.credentialSubject.uuid, "config.json", privateKeyPath, outputDir);

  });


  function validateLocationHash(claim) {
    const file_location = claim.credentialSubject.location.path;
    const bashCommand = getHash(`${file_location}`);

    console.log("Rehashing file location & Verifying")
    runBashCommand(bashCommand, (error, hash) => {
      if (error) {
        console.error(`Error generating hash: ${error.message}`);
        process.exit(1);
      }
      if (claim.credentialSubject.hash !== hash)
        throw new Error ("Hash is not validated")
    })


    console.log("TAIBOM claim", claim.id, "VALIDATED")
  }

  // Validation functions
program
  .command("validate-data")
  .description("Validate a TAIBOM data claim")
  .argument("<data_taibom>", "Path to TAIBOM data claim")
  .option("--out <output_dir>", "Output directory")
  .action((taibom, options) => {
    try {
      const dataClaim = getAndVerifyClaim(taibom);
      let outputDir = options.out ? path.resolve(options.out) : process.cwd();

      // Verify it is a data vc
      if(dataClaim.credentialSchema.id !== "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/10-data.v1.0.0.schema.yaml")
        throw new Error("This is not a TAIBOM data claim")
      
      validateLocationHash(dataClaim);

    } catch (err) {
      console.log(err)
      throw new Error(`Validation failed for claim at ${taibom}`)
    }
  });

program
  .command("validate-code")
  .description("Validate a TAIBOM code claim")
  .argument("<data_taibom>", "Path to TAIBOM data claim")
  .option("--out <output_dir>", "Output directory")
  .action((taibom, options) => {
    try {
      const codeClaim = getAndVerifyClaim(taibom);
      let outputDir = options.out ? path.resolve(options.out) : process.cwd();

      // Verify it is a data vc
      if(codeClaim.credentialSchema.id !== "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/40-code.v1.0.0.schema.yaml")
        throw new Error("This is not a TAIBOM code claim")
      
      validateLocationHash(codeClaim);

    } catch (err) {
      console.log(err)
      throw new Error(`Validation failed for claim at ${taibom}`)
    }
  });

program
  .command("generate-vc")
  .description("Generate and sign a TAIBOM VC")
  .argument("<json_data_file>", "Path to Json data to be signed")
  .argument("<schema_name>", "Name of the TAIBOM schema (include .json extension)")
  .argument("<signing_key_path>", "Signing Key")
  .option("--uuid <issuer_uuid>", "Issuer UUID", null)
  .option("--out <output_dir>", "Output directory")
  .action((dataFile, schemaName, signingKeyPath, options) => {
    const credentialSubject = getAndVerifyClaim(dataFile, false);
    let uuid = options.uuid ?? `urn:uuid:${uuidv4()}`;
    let outputDir = options.out ? path.resolve(options.out) : process.cwd();
    generateAndSignVC(credentialSubject, uuid, schemaName, signingKeyPath, outputDir)
  })


  function createAttestation(attestation, taibom, identity, schemaName = "attestation.json", outputDir) {
    const {identity: identityJson, privateKeyPath} = identity;
    const credentialSubject = {
      attestation,
      component: taibom
    }

    generateAndSignVC(credentialSubject, identityJson.credentialSubject.uuid, schemaName, privateKeyPath, outputDir)
  }


  program
    .command("attest")
    .description("Function by which an attestation can be made about a TAIBOM component")
    .argument('<identity_email>', 'The email of the identity to sign this TAIBOM')
    .argument("<taibom_component_path>", "The path to the TAIBOM component VC to make an attestation about")
    .argument("<attestation_json_path>", "Path to attestation to be made")
    .option("--out <output_dir>", "Output directory")
    .option(
      "--type <attestation_type>", 
      "Type of attestation", 
      (val) => {
        const allowedValues = ['sbom', 'licence', "vulnerability"];
        if (!allowedValues.includes(val)) {
          throw new Error(`Invalid type. Allowed values are: ${allowedValues.join(', ')}`);
        }
        return val;
      },
      null, 
    )
    .action((identityEmail, taibomVc, attestationPath, options) => {
      const identity = retrieveIdentity(identityEmail);
      let outputDir = options.out ? path.resolve(options.out) : process.cwd();

      const taibom = getAndVerifyClaim(taibomVc);
      const attestation = getAndVerifyClaim(attestationPath, false);

      if(options.type) {
        createAttestation({type: options.type, ...attestation}, {id: taibom.id, hash: taibom.proof.proofValue}, identity, schemaName = `${options.type}-attestation.json`, outputDir);
      } else {
        createAttestation(attestation, {id: taibom.id, hash: taibom.proof.proofValue}, identity, schemaName = "attestation.json", outputDir);

      }
    });
  
  program.parse(process.argv);
  