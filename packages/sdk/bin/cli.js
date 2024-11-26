#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const pathModule = require('path'); // Renamed to avoid conflict with 'path'
const fs = require('fs');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const VC_OUPUT_PATH = "/home/tony/Projects/Trusted-AI-BOM/packages/sdk/verifiable-credentials"

const { keypairDir, directoryExists, createVC, getIdentityJson, runBashCommand, generateAndSignVC } = require('../src');

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
        const keypairPath = pathModule.join(keypairDir, email);

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
    // Step 1: Check if identity keys exist
    const privateKeyPath = pathModule.join(keypairDir, `${identityEmail}-priv`);
    const publicKeyPath = pathModule.join(keypairDir, `${identityEmail}-pub`);
    const identity = getIdentityJson(identityEmail)

    if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
      console.error(`Error: Keypair for identity email '${identityEmail}' does not exist.`);
      process.exit(1);
    }

    console.log(`Identity keys for '${identityEmail}' found.`);

    // Step 2: Verify the data directory exists
    if (!directoryExists(dataDir)) {
      console.error(`Error: Data directory '${dataDir}' does not exist.`);
      process.exit(1);
    }

    console.log(`Data directory '${dataDir}' verified.`);

    // Step 3: Generate the hash of the directory contents
    // Wrap the directory in double quotes to handle spaces
    const escapedDataDir = `"${dataDir}"`;
    const bashCommand = `find ${escapedDataDir} -type f -exec sha256sum {} + | sort | sha256sum | awk '{print $1}'`;

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
        name: pathModule.parse(dataDir).name,
      }
      
      generateAndSignVC(credentialSubject, identity.credentialSubject.uuid, "data.json", privateKeyPath, VC_OUPUT_PATH);
    });
  });


program.parse(process.argv);
