#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const pathModule = require('path'); // Renamed to avoid conflict with 'path'
const fs = require('fs');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const { keypairDir, createVC } = require('../src');

// Function to run a bash command
function runBashCommand(bashCommand) {
  exec(bashCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
  });
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
    if (!fs.existsSync(keypairDir)) {
      fs.mkdirSync(keypairDir);
    }
    
    // Use pathModule to resolve paths
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

    // Call createVC to generate a Verifiable Credential
    const {filePath, vcId} = createVC(identity, uuid, "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/5-identity.v1.0.0.schema.yaml");

    // TODO: remove hard-code 
    runBashCommand(`vc_tools_cli sign-vc ${filePath} /home/tony/Projects/Trusted-AI-BOM/packages/sdk/schemas/identity.json ${privateKeyPath} /home/tony/Projects/Trusted-AI-BOM/packages/sdk/schemas/tony-pub /home/tony/Projects/Trusted-AI-BOM/packages/sdk/verifiable-credentials/${vcId}.json json`)
    
  });

program.parse(process.argv);
