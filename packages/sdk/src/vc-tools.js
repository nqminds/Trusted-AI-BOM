const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const { loadKey, convertToUnit8 } = require("./keys");

const fetch = require("node-fetch");

const getSchemaDetails = require("./schemas");
const { sign, verify } = require("../pkg/verifiable_credential_toolkit");

const staticVC = {
  "@context": ["https://www.w3.org/ns/credentials/v2"],
  id: null, // To be generated dynamically
  type: "VerifiableCredential",
  //"name": null,
  //"description": null,
  "validFrom": new Date().toISOString(),
  //"validUntil": null,
  //"credentialStatus": null,
  credentialSchema: {
    type: "JsonSchema",
    schema: "https://json-schema.org/draft/2020-12/schema",
  },
  credentialSubject: {},
};

/**
 * Verifies the claim in a Verifiable Credential (VC).
 * @param {Object} vc - The Verifiable Credential object.
 * @param {string} didRegistryUrl - The URL of the DID registry (e.g., did:example registry endpoint).
 * @returns {boolean} - Whether the VC was successfully verified.
 */
async function verifyClaim(vc) {
  try {
    let didDocument;
    const didUrl = vc.issuer;

    try {
      const response = await fetch(didUrl);
      if (!response.ok) {
        throw new Error(`DID registry lookup failed for ${didUrl}`);
      }
      didDocument = await response.json();
    } catch (error) {
      console.warn(
        `Warning: Unable to fetch DID document from registry. Falling back to proof.verificationMethod. Error: ${error.message}`
      );
    }


    let publicKey;
    if (vc.proof && vc.proof.verificationMethod) {
      // Use the public key from `proof.verificationMethod`
      publicKey = vc.proof.verificationMethod;
    } else {
      console.error("No verification method found in the VC or DID document.");
      return false;
    }

    const decodedPublicKey = convertToUnit8(publicKey);

    const isVerified = verify(vc, decodedPublicKey);
    return isVerified;
  } catch (error) {
    console.error("Error during claim verification:", error);
    throw new error();
  }
}

function deepMapToObject(input) {
  if (input instanceof Map) {
    const obj = {};
    input.forEach((value, key) => {
      obj[key] = deepMapToObject(value); // Recursively convert value
    });
    return obj;
  }
  if (Array.isArray(input)) {
    return input.map(deepMapToObject); // Recursively handle arrays
  }
  return input; // If it's not a Map or Array, return the value as is
}

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
    credentialSchema: schema
      ? { type: "JsonSchema", id: schema }
      : staticVC.credentialSchema,
    ...variables,
  };

  return vc;
}

function generateAndSignVC(
  credentialSubject,
  issuer,
  schemaName,
  privateKeyPath,
  publicKeyPath
) {
  const { schema } = getSchemaDetails(schemaName);

  const vc = createVC(
    credentialSubject,
    { id: `https://example.com/issuers/`, email: issuer },
    schema.credentialSubject.$id
  );

  // Use the private key to sign the VC (assuming the key is in PEM format)
  const vcSigned = sign(vc, loadKey(privateKeyPath, "uint8"));

  const jsonContent = deepMapToObject(vcSigned);
  jsonContent.proof.verificationMethod = loadKey(publicKeyPath);

  return jsonContent;
}

function vcToFile(jsonContent, outputPath, schemaName, appendVcId = true) {
  const guid = jsonContent.id.split(":")[2];
  const output = appendVcId
    ? path.join(outputPath, `TAIBOM-${schemaName.split(".")[0]}-${guid}.json`)
    : outputPath;

  // Write the JSON string to a file
  fs.writeFileSync(output, JSON.stringify(jsonContent));

  console.log(`VC Signed data has been written to ${output}`);
  return output;
}

module.exports = { createVC, generateAndSignVC, vcToFile, verifyClaim };
