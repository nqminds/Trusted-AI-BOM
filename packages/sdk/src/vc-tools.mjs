import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";
import { sign, verify } from "./pkg/verifiable_credential_toolkit.js";
import { convertToUint8 } from "./keys.mjs"
import { cookieJar, URI, BASE_PATH, ENDPOINTS, saveCookies} from "../src/api-tools.mjs";
import got from "got";

const apiClient = got.extend({
  prefixUrl: URI.replace(/\/$/, '') + BASE_PATH, // Use the same base URL
  cookieJar, // Use the shared cookie jar
  responseType: 'json',
  hooks: {
    afterResponse: [
      (response) => {
        saveCookies();
        return response;
      },
    ],
  }
});


const checkExpiration = true;

const staticVC = {
  "@context": ["https://www.w3.org/ns/credentials/v2"],
  id: null, // To be generated dynamically
  type: "VerifiableCredential",
  //"name": null,
  //"description": null,
  validFrom: new Date().toISOString(),
  //"validUntil": null,
  //"credentialStatus": null,
  credentialSchema: {
    type: "JsonSchema",
    schema: "https://json-schema.org/draft/2020-12/schema",
  },
  credentialSubject: {},
};

/**
 * Fetches the keys from the server, requires an authenticated session.
 * @returns {Promise<Object>} A promise that resolves to the keys object.
 */
async function getKeys() {
  //const response = await fetch(URI + BASE_PATH + ENDPOINTS.GET_KEYS, { "credentials": "include" });// TODO: make this a got request to leverage the cookies, is this possible accross files?
  const response = await apiClient.get(ENDPOINTS.GET_KEYS, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.statusCode !== 200) {
    throw new Error(response.statusMessage);
  }
  const keys = await response.body;
  return keys;
}

async function verifyVerifiableCredential(vc, key) {
  await init();
  const valid = verify(vc, key);
  return valid;
}


async function verifyHasValidExpiration(vc) {
  if (!vc.validUntil) {
    // log that there is no expiration date
    //TODO: make the inlcusion of expiration a configurable option
    return false;
  }
  const expirationDate = new Date(vc.validUntil);
  const currentDate = new Date();
  if (expirationDate < currentDate) {
    console.error("VC has expired");
    return false;
  }
  return true;
}




/**
 * 
 * @param {Object} VC
 * @param {string} email
 * @returns 
 */
async function verifyAgainstEmail(vc, email) {
  const keys = (await getKeys(email)).keys;
  const keysArray = keys.map(key => key.key);

  if (keys.length === 0) {
    return false;
  }
  const convertedKeys = await Promise.all(keysArray.map(async (key) => {
    return processEd25519PublicKey(key);
  }));


  for (let keyIndex = 0; keyIndex < convertedKeys.length; keyIndex++) {
    const key = keys[keyIndex];
    valid = await verifyVerifiableCredential(vc, key);
    if (valid && checkExpiration && await verifyHasValidExpiration(vc)) {
      validVCs.push(vc);
      break;
    } else if (valid && !checkExpiration) {
      validVCs.push(vc);
      break;
    }
  }

}

/**
 * Verifies the claim in a Verifiable Credential (VC).
 * @param {Object} vc - The Verifiable Credential object.
 * @param {string} didRegistryUrl - The URL of the DID registry (e.g., did:example registry endpoint).
 * @returns {boolean} - Whether the VC was successfully verified.
 */
export async function verifyClaim(vc) {
  try {
    let didDocument;
    const didUrl = vc.issuer;

    try {
      // new stuff goes here TODO: Verify that the signing key of the incoming vc is the same one associated with the issuer
      verifyAgainstEmail(vc, vc.issuer);
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

    const decodedPublicKey = convertToUint8(publicKey);

    const isVerified = verify(vc, decodedPublicKey);
    return isVerified;
  } catch (error) {
    console.error("Error during claim verification:", error);
    throw new Error(error);
  }
}

/**
 * Recursively maps a Map or Array to a plain object or array, respectively.
 * @param {Map|Array} input - The input Map or Array to be transformed.
 * @returns {Object|Array} The transformed object or array.
 */
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

/**
 * Creates a Verifiable Credential (VC) with the provided data.
 * @param {Object} credentialSubject - The credential subject data.
 * @param {string} issuer - The issuer of the VC.
 * @param {string} schema - The schema for the VC.
 * @param {Object} variables - Any additional variables to include in the VC.
 * @returns {Object} The created Verifiable Credential (VC).
 */
export function createVC(
  credentialSubject,
  issuer,
  schema = "",
  variables = {}
) {
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

/**
 * Generates and signs a Verifiable Credential (VC).
 * @param {Object} credentialSubject - The credential subject data.
 * @param {string} issuer - The issuer of the VC.
 * @param {string} schema - The schema for the VC.
 * @param {string} priv - The private key to sign the VC.
 * @param {string} pub - The public key to verify the VC.
 * @returns {Object} The signed Verifiable Credential (VC).
 */
export function generateAndSignVC(
  credentialSubject,
  issuer,
  schema,
  priv,
  pub
) {
  const vc = createVC(
    credentialSubject,
    `http://localhost:3001/api/auth/identity?email=${issuer}`,
    schema
  );

  // Use the private key to sign the VC (assuming the key is in PEM format)
  const vcSigned = sign(vc, priv);

  const jsonContent = deepMapToObject(vcSigned);
  jsonContent.proof.verificationMethod = pub;

  return jsonContent;
}

