const fs = require("fs");
const path = require("path");
const nacl = require("tweetnacl");

/**
 * Generates an Ed25519 key pair and saves it in the specified directory.
 * Ensures the private key is stored as a 32-byte seed.
 * @param {string} keypairPath - Directory to save the keys.
 * @returns {{ pub: string, privateKeyPath: string }}
 */
function generateKeyPair(keypairPath) {
  if (!fs.existsSync(keypairPath)) {
    fs.mkdirSync(keypairPath, { recursive: true });
  }

  // Generate key pair
  const keyPair = nacl.sign.keyPair();
  const seed = keyPair.secretKey.slice(0, 32); // Extract first 32 bytes as private key
  const publicKey = keyPair.publicKey; // Already 32 bytes

  // Convert to Base64 for storage
  const privateKeyBase64 = Buffer.from(seed).toString("base64");
  const publicKeyBase64 = Buffer.from(publicKey).toString("base64");

  // Define paths
  const privateKeyPath = path.join(keypairPath, "private.key");
  const publicKeyPath = path.join(keypairPath, "public.key");

  // Write to files
  fs.writeFileSync(privateKeyPath, privateKeyBase64);
  fs.writeFileSync(publicKeyPath, publicKeyBase64);

  console.log("Keys generated and saved in:", keypairPath);
  return { pub: publicKeyBase64, privateKeyPath, publicKeyPath };
}

/**
 * Loads a key from a file and returns it in the desired format.
 * @param {string} keyPath - Path to the key file.
 * @param {"base64" | "uint8"} format - Format of the key.
 * @returns {string | Uint8Array} - The key in the requested format.
 */
function loadKey(keyPath, format = "base64") {
  if (!fs.existsSync(keyPath)) {
    throw new Error(`Key not found: ${keyPath}`);
  }

  const keyBase64 = fs.readFileSync(keyPath, "utf8");

  if (format === "base64") {
    return keyBase64;
  } else if (format === "uint8") {
    const keyUint8 = new Uint8Array(Buffer.from(keyBase64, "base64"));
    if (keyUint8.length !== 32) {
      throw new Error("Invalid key length. Expected 32 bytes.");
    }
    return keyUint8;
  } else {
    throw new Error("Invalid format. Use 'base64' or 'uint8'.");
  }
}

function convertToUnit8(key) {
  const keyUint8 = new Uint8Array(Buffer.from(key, "base64"));
  if (keyUint8.length !== 32) {
    throw new Error("Invalid key length. Expected 32 bytes.");
  }
  return keyUint8;
}

module.exports = { generateKeyPair, loadKey, convertToUnit8 };
