const { v4: uuidv4 } = require('uuid'); // Importing UUID generator for the credential ID
const fs = require('fs');
const path = require('path');
const os = require('os');

const {runBashCommand} = require("./utils")
const getSchemaDetails = require("./schemas")

// Static VC template with placeholder values
const staticVC = {
  "@context": [
    "https://www.w3.org/ns/credentials/v2"
  ],
  "id": null, // To be generated dynamically
  "type": "VerifiableCredential",
  "name": null,
  "description": null,
  "validFrom": null,
  "validUntil": null,
  "credentialStatus": null,
  "credentialSchema": {
    "type": "JsonSchema",
    "schema": "https://json-schema.org/draft/2020-12/schema"
  },
  "credentialSubject": {}
};

function createVC(credentialSubject, issuer, schema = "", variables = {}) {
  // Create a unique id for the VC
  const vcId = `urn:uuid:${uuidv4()}`;

  // Build the VC dynamically from the provided data
  const vc = {
    ...staticVC,
    id: vcId,
    issuer,
    credentialSubject: {
      ...credentialSubject,
    },
    credentialSchema: schema? {type: "JsonSchema", id: schema}: staticVC.credentialSchema,
    ...variables
  };

  // Get the temporary directory path
  const tempDir = os.tmpdir();
  
  // Define the path where the VC will be saved
  const filePath = path.join(tempDir, `${vcId}.json`);

  // Write the VC to the file
  fs.writeFileSync(filePath, JSON.stringify(vc, null, 2));
  return {filePath, vcId}; // Return the path for reference
}

function generateAndSignVC(credentialSubject, issuer, schemaName, privateKeyPath, outputPath, appendVcId = true) {
  const schemaKeyPath = "/home/tony/Projects/Trusted-AI-BOM/packages/sdk/schemas/tony-pub"
  const {schema, schemaPath} = getSchemaDetails(schemaName);

  const {filePath, vcId} = createVC(credentialSubject, issuer, schema.credentialSubject.$id);
  const guid = vcId.split(":")[2]
  const output = appendVcId ? path.join(outputPath, `TAIBOM-${schemaName.split(".")[0]}-${guid}.json`) : outputPath;

  const signCommand = `vc_tools_cli sign-vc ${filePath} ${schemaPath} ${privateKeyPath} ${schemaKeyPath} ${output} json`;
  runBashCommand(signCommand, (error) => {
    if (error) {
      console.error(`Error signing VC: ${error.message}`);
      process.exit(1);
    }
    console.log(`VC signed and saved to ${output}`);
  });
  return vcId;
}


module.exports = {createVC, generateAndSignVC};
