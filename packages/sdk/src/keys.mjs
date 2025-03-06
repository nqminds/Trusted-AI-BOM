import nacl from "tweetnacl";
import { Buffer } from "buffer";

/**
 * Generates an Ed25519 key pair and returns them as Base64-encoded strings.
 * @returns {{ pub: string, priv: string }}
 */
export function generateKeyPair() {
  const keyPair = nacl.sign.keyPair();
  const seed = keyPair.secretKey.slice(0, 32); // Extract first 32 bytes as private key
  const publicKey = keyPair.publicKey; // Already 32 bytes

  return {
    pub: Buffer.from(publicKey).toString("base64"),
    priv: Buffer.from(seed).toString("base64"),
  };
}

/**
 * Converts a Base64 key to a Uint8Array.
 * @param {string} key - Base64 encoded key.
 * @returns {Uint8Array}
 */
export function convertToUint8(key) {
  const keyUint8 = new Uint8Array(Buffer.from(key, "base64"));
  if (keyUint8.length !== 32) {
    throw new Error("Invalid key length. Expected 32 bytes.");
  }
  return keyUint8;
}

/**
 * Converts a Base64-encoded Ed25519 key to PEM format.
 * @param {string} key - Base64 encoded key (public or private).
 * @param {string} keyType - Type of key: "public" or "private".
 * @returns {string} - PEM formatted key.
 */
export function convertToPem(key, keyType) {
  // Validate the key type
  if (keyType !== "public" && keyType !== "private") {
    throw new Error("Invalid key type. It must be 'public' or 'private'.");
  }

  // Convert the Base64 key to a Uint8Array
  const keyUint8 = convertToUint8(key);

  // Base64 encode the key data
  const keyBase64 = Buffer.from(keyUint8).toString("base64");

  // Create the PEM header and footer based on key type
  let pemHeader = "";
  let pemFooter = "";
  if (keyType === "public") {
    pemHeader = "-----BEGIN PUBLIC KEY-----\n";
    pemFooter = "\n-----END PUBLIC KEY-----";
  } else if (keyType === "private") {
    pemHeader = "-----BEGIN PRIVATE KEY-----\n";
    pemFooter = "\n-----END PRIVATE KEY-----";
  }

  // Split the base64-encoded key into chunks of 64 characters for PEM format
  const formattedKey = keyBase64.match(/.{1,64}/g).join("\n");

  // Return the PEM formatted key
  return pemHeader + formattedKey + pemFooter;
}
