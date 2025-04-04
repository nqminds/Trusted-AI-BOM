import os from "os";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { extractSchemaName, verifyClaim } from "../src/vc-tools.mjs";
import {
  initializeGuidHashDatabase,
  insertGuidHash,
} from "./guidHashDatabase.mjs";

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the user's home directory
const homeDir = os.homedir();
const keypairDir = path.join(homeDir, ".taibom");

function directoryExists(dirPath) {
  return (
    (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) ||
    (fs.existsSync(dirPath) && fs.statSync(dirPath).isFile())
  );
}

function writeKeysToFile(keypairPath, privateKeyBase64, publicKeyBase64) {
  if (!directoryExists(keypairPath)) {
    fs.mkdirSync(keypairPath, { recursive: true });
  }

  const privateKeyPath = path.join(keypairPath, "private.key");
  const publicKeyPath = path.join(keypairPath, "public.key");

  fs.writeFileSync(privateKeyPath, privateKeyBase64);
  fs.writeFileSync(publicKeyPath, publicKeyBase64);
  return { publicKeyPath, privateKeyPath };
}

function loadKey(keyPath, format = "base64") {
  if (!fs.existsSync(keyPath)) {
    throw new Error(`Key not found: ${keyPath}`);
  }

  const keyBase64 = fs.readFileSync(keyPath, "utf8");

  console.log(keyPath);
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

async function retrieveIdentity(identityEmail) {
  const privateKeyPath = path.join(keypairDir, identityEmail, "private.key");
  const publicKeyPath = path.join(keypairDir, identityEmail, "public.key");
  const identity = await getIdentityJson(identityEmail);

  if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    console.error(
      `Error: Keypair for identity email '${identityEmail}' does not exist.`
    );
    process.exit(1);
  }

  console.log(`Identity keys for '${identityEmail}' found.`);
  return { identity, privateKeyPath, publicKeyPath };
}

function vcToFile(jsonContent, outputPath, schemaName, appendVcId = true) {
  if (!jsonContent?.id) {
    throw new Error("Invalid VC JSON: Missing 'id' field.");
  }

  // Extract GUID from VC ID
  const guid = jsonContent.id.split(":")[2];

  // Define output file path
  const output = appendVcId
    ? path.join(outputPath, `TAIBOM-${schemaName.split(".")[0]}-${guid}.json`)
    : outputPath;

  // Write VC JSON to file
  fs.writeFileSync(output, JSON.stringify(jsonContent, null, 2));
  console.log(`✅ VC Signed data has been written to ${output}`);

  const vcHash = jsonContent.proof.proofValue;

  // Initialize database and insert entry
  const db = initializeGuidHashDatabase();
  insertGuidHash(db, {
    taibom_guid: guid,
    vc_hash: vcHash,
    vc: JSON.stringify(jsonContent),
    vc_filepath: output,
    resolvable: 1,
  });

  console.log(`✅ VC metadata stored in GUID-Hash database.`);
  return output;
}

async function getIdentityJson(email) {
  const identityPath = path.join(homeDir, ".taibom", `${email}-identity.json`);
  return getAndVerifyClaim(identityPath);
}

async function getAndVerifyClaim(filePath, schemaType = "") {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Claim file not found at path: ${filePath}`);
    }

    const jsonFile = fs.readFileSync(filePath, "utf8");
    const jsonVc = JSON.parse(jsonFile);
    const verified = await verifyClaim(jsonVc);
    if (!verified) {
      throw new Error(`Claim not verified at: ${filePath}`);
    }
    if (schemaType) {
      const vcType = extractSchemaName(jsonVc);
      if (!schemaType.includes(vcType)) {
        console.error(
          `Claim not verified, expected VC of type ${schemaType} but got ${vcType} instead`
        );
        process.exit(1); // Kill the process
      }
    }

    return jsonVc;
  } catch (error) {
    console.error(`Error retrieving claim JSON: ${error.message}`);
    return null;
  }
}

function ensureFilesExist(files) {
  for (const file of files) {
    if (!fs.existsSync(file)) {
      throw new Error(`Required file not found: ${file}`);
    }
  }
}

function getHash(dataDir) {
  if (dataDir.startsWith("file://")) {
    dataDir = dataDir.replace("file://", "");
  }
  // Convert relative path to absolute
  if (!path.isAbsolute(dataDir)) {
    dataDir = path.resolve(process.cwd(), dataDir);
  }

  return `find "${dataDir}" -type f -exec sha256sum {} + | sort | sha256sum | awk '{print $1}'`;
}

// Export functions for use in other ES modules
export {
  writeKeysToFile,
  retrieveIdentity,
  keypairDir,
  directoryExists,
  loadKey,
  vcToFile,
  getIdentityJson,
  getAndVerifyClaim,
  getHash,
  ensureFilesExist,
};
