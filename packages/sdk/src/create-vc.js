const { v4: uuidv4 } = require('uuid'); // Importing UUID generator for the credential ID
const fs = require('fs');
const path = require('path');
const os = require('os');

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

function createVC(credentialSubject, issuer, schema = "", variables = {}, includeSchema = false) {
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

  console.log(`VC saved to: ${filePath}`);

  return {filePath, vcId}; // Return the path for reference
}

module.exports = createVC;
