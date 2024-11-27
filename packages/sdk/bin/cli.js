#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const path = require('path'); // Renamed to avoid conflict with 'path'
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const VC_OUPUT_PATH = "/home/tony/Projects/Trusted-AI-BOM/packages/sdk/verifiable-credentials"
const SBOM_OUTPUT_PATH = "/home/tony/Projects/taibom-projects/SBOM-GAP/vulnerability-reports/sboms"

const { keypairDir, directoryExists, getIdentityJson, runBashCommand, generateAndSignVC, getAndVerifyClaim, getHash} = require('../src');

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
  .action((name, email, role) => {
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

    const uuid = `urn:uuid:${uuidv4()}`;

    // Define identity object
    const identity = {
      name,
      email,
      uuid,
      pub: publicKeyPath,
      role
    };

    generateAndSignVC(identity, uuid, "identity.json", privateKeyPath, `${keypairPath}-identity.json`, false);
    generateAndSignVC(identity, uuid, "identity.json", privateKeyPath, VC_OUPUT_PATH);

  });

program
  .command("data-taibom")
  .description("Generate a Data TAIBOM")
  .argument('<identity_email>', 'The email of the identity to sign this TAIBOM')
  .argument('<data_directory>', 'The directory of the data')
  .option("--weights", "This data is AI weights", false)
  .action((identityEmail, dataDir, options) => {
    const {identity, privateKeyPath, publicKeyPath} = retrieveIdentity(identityEmail)

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
      
      generateAndSignVC(credentialSubject, identity.credentialSubject.uuid, "data.json", privateKeyPath, VC_OUPUT_PATH);
    });
  });
  
program
  .command("generate-sbom")
  .description("Generate and sign an SBOM of code")
  .argument('<identity_email>', 'The email of the identity to sign this TAIBOM')
  .argument('<code_directory>', 'The directory of the data')
  .option("--cpp", "[OPTIONAL] Generate a SBOM for C/C++ code", false)
  .action((identityEmail, codeDirectory, options) => {
    const {identity, privateKeyPath, publicKeyPath} = retrieveIdentity(identityEmail);

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

    const bashCommand = `nqmvul -${cliCommand} ${escapedDir} "${codeName}"`
    console.log("Creating the SBOM")

    runBashCommand(bashCommand); // This will produce an error we are not interested in

    const sbomDir = path.join(SBOM_OUTPUT_PATH, `${codeName}.json`);
    if(!directoryExists(sbomDir)) {
      console.error(`Error: SBOM directory '${sbomDir}' does not exist.`);
      process.exit(1);
    }
    const credentialSubject = getAndVerifyClaim(sbomDir, false);

    generateAndSignVC(credentialSubject, identity.credentialSubject.uuid, "sbom.json", privateKeyPath, VC_OUPUT_PATH);
  })

program
  .command("code-taibom")
  .description("Generate and sign a TAIBOM of code")
  .argument('<identity_email>', 'The email of the identity to sign this TAIBOM')
  .argument('<code_directory>', 'The directory of the data')
  .argument("<version>", "Code version number")
  .option("--sbomTaibom <path>", "[OPTIONAL] SBOM TAIBOM claim", false)
  .option("--name <code_name>", "[OPTIONAL] Name of code or package", false)
  .action((identityEmail, codeDirectory, version, options) => {
    const {identity, privateKeyPath, publicKeyPath} = retrieveIdentity(identityEmail);

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
      sbom = sbomVc.id
    }


    runBashCommand(bashCommand, (error, hash) => {
      if (error) {
        console.error(`Error generating hash: ${error.message}`);
        process.exit(1);
      }


      const credentialSubject = {
        hash,
        location: {
          path: `file://${codeDirectory}`,
          type: "local",
        },
        name: options.name? options.name : codeName,
        version,
        sbom
      }
      generateAndSignVC(credentialSubject, identity.credentialSubject.uuid, "code.json", privateKeyPath, VC_OUPUT_PATH);

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
  .action((identityEmail, codeTaibomPath, dataTaibomPath, options) => {
    const {identity, privateKeyPath, publicKeyPath} = retrieveIdentity(identityEmail);

    // TODO: verify both code and data claims
    const codeTaibom = getAndVerifyClaim(codeTaibomPath);
    const dataTaibom = getAndVerifyClaim(dataTaibomPath);

    const label = options.infererencing ? "Inferencing" : "Training"

    const credentialSubject = {
      code: codeTaibom.id,
      data: dataTaibom.id,
      label,
      name: options.name || codeTaibom.credentialSubject.name
    }
    generateAndSignVC(credentialSubject, identity.credentialSubject.uuid, "ai-system.json", privateKeyPath, VC_OUPUT_PATH);

  })

program
  .command("datapack-taibom")
  .description("Generate and sign a TAIBOM of a datapack")
  .argument('<identity_email>', 'The email of the identity to sign this TAIBOM')
  .argument('<name>', 'The dataset name')
  .argument('<data_taiboms...>', 'List of file or directory paths (space-separated)')
  .action((identityEmail, name, dataTaibomPaths) => {
    const {identity, privateKeyPath, publicKeyPath} = retrieveIdentity(identityEmail);

    const datasets = dataTaibomPaths.map(path => {
      dataTaibom = getAndVerifyClaim(path)
      return dataTaibom.id;
    });

    const credentialSubject = {
      name, datasets
    }

    generateAndSignVC(credentialSubject, identity.credentialSubject.uuid, "datapack.json", privateKeyPath, VC_OUPUT_PATH);

  });

program
  .command("config-taibom")
  .description("Generate and sign a TAIBOM of an AI systems config")
  .argument('<identity_email>', 'The email of the identity to sign this TAIBOM')
  .argument('<ai_system_taibom>', 'AI system TAIOBOM path')
  .argument('<data_taibom>', 'Path to data configs') 
  .option("--name <config_name>", "[OPTIONAL] Name of configs", false)
  .action((identityEmail, aiSystemTaibomPath, dataTaibomPath, options) => {
    const {identity, privateKeyPath, publicKeyPath} = retrieveIdentity(identityEmail);

    const aiSystem = getAndVerifyClaim(aiSystemTaibomPath)?.id;
    const data = getAndVerifyClaim(dataTaibomPath);

    const credentialSubject = {
      aiSystem, data: data.id, name: options.name || data.credentialSubject.name
    }

    generateAndSignVC(credentialSubject, identity.credentialSubject.uuid, "config.json", privateKeyPath, VC_OUPUT_PATH);

  });


  function validateLocationHash(claim) {
    const file_location = claim.credentialSubject.location.path;
    const bashCommand = getHash(`${file_location}`);

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
  .action((taibom) => {
    try {
      const dataClaim = getAndVerifyClaim(taibom);

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
  .action((taibom) => {
    try {
      const codeClaim = getAndVerifyClaim(taibom);

    // Verify it is a data vc
    if(codeClaim.credentialSchema.id !== "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/40-code.v1.0.0.schema.yaml")
      throw new Error("This is not a TAIBOM code claim")
    
    validateLocationHash(codeClaim);

    } catch (err) {
      console.log(err)
      throw new Error(`Validation failed for claim at ${taibom}`)
    }
  });

program.parse(process.argv);
