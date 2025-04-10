import express from "express";
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import crypto from "crypto";
import { getHash } from "./bin/file-utils.mjs";
import { exec } from "child_process";
import { extractSchemaName } from "./src/vc-tools.mjs";

const app = express();
app.use(express.json());  // ✅ Enable JSON body parsing

const PORT = 3000;
const dbPath = path.join(process.env.HOME, ".taibom/guid_hash.db");
const db = new Database(dbPath);
const activeChallenges = new Map(); // Store nonces temporarily

function runBashCommand(bashCommand, callback) {
  exec(bashCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Command failed: ${error.message}`);
      return callback ? callback(error) : process.exit(1);
    }
    if (stderr) {
      console.error(`Command error: ${stderr}`);
      return callback ? callback(new Error(stderr)) : process.exit(1);
    }
    if (callback) callback(null, stdout.trim());
  });
}

// Helper function: Retrieve the Verifiable Credential (VC) JSON
function getVCJson({ guid, vc_hash }) {
  let query;
  let param;

  if (guid) {
    query = `SELECT * FROM guid_hash_table WHERE taibom_guid = ? ORDER BY vc_hash`;
    param = guid;
  } else if (vc_hash) {
    query = `SELECT * FROM guid_hash_table WHERE vc_hash = ? ORDER BY taibom_guid`;
    param = vc_hash;
  } else {
    return null;
  }

  const result = db.prepare(query).get(param);

  if (!result || !result.vc_filepath) {
    console.error(
      `❌ No matching VC found for GUID: ${guid} or Hash: ${vc_hash}`
    );
    return null;
  }

  const vcFilePath = result.vc_filepath.trim();

  if (!fs.existsSync(vcFilePath)) {
    console.error(`❌ VC File not found on disk: ${vcFilePath}, reverting to stored VC in guid_hash_table`);
    return { vc: JSON.parse(result.vc), dbEntry: result };
  }

  try {
    return {
      vc: JSON.parse(fs.readFileSync(vcFilePath, "utf-8")),
      dbEntry: result,
    };
  } catch (error) {
    console.error(`❌ Error reading VC file: ${error.message}`);
    return null;
  }
}

// ✅ API Endpoint: Get the VC file (returns JSON)
app.get("/get-vc", (req, res) => {
  const { guid, vc_hash } = req.query;

  const vcJson = getVCJson({ guid, vc_hash });
  if (!vcJson) {
    return res.status(404).json({ error: "VC not found" });
  }

  res.json(vcJson);
});

// ✅ API Endpoint: Get the data hash
app.get("/get-hash", (req, res) => {
  const { guid, vc_hash } = req.query;

  const { vc: vcJson, dbEntry } = getVCJson({ guid, vc_hash });
  if (!vcJson) {
    return res.status(404).json({ error: "VC not found" });
  }

  const taibomType = extractSchemaName(vcJson);
  if(!taibomType.includes(["code", "data", "data-pack"])) {
    return res.status(404).json({ error: "VC not found" });
  }

  const dataDir = vcJson.credentialSubject.location;

  if (dataDir.type === "local") {
    const cleanedRelativePath = dataDir.path.replace("file://", "");
    const resolvedPath = path.resolve(
      path.dirname(dbEntry.vc_filepath),
      cleanedRelativePath
    );
    const bashCommand = getHash(resolvedPath);

    runBashCommand(bashCommand, (error, hash) => {
      if (error) {
        console.error(`Error generating hash: ${error.message}`);
        process.exit(1);
      }
      res.json({ data_hash: hash });
    });
  }
});

// app.post("/handshake", (req, res) => {
//   console.log(req.body)
//   const { email, nonce } = req.body;

//   if (!email || !nonce) {
//     return res.status(400).json({ error: "Missing 'email' or 'nonce'" });
//   }

//   const privateKeyPath = path.join(process.env.HOME, ".taibom", email, "private.key");

//   if (!fs.existsSync(privateKeyPath)) {
//     return res.status(404).json({ error: "Private key not found for this identity" });
//   }

//   const privateKey = fs.readFileSync(privateKeyPath, "utf-8").trim();

//   // Sign the nonce using the server’s private key
//   const signer = crypto.createSign("SHA256");
//   signer.update(nonce);
//   signer.end();
//   const signedNonce = signer.sign(privateKey, "base64");

//   res.json({ signedNonce });
// });
// Start the server
app.listen(PORT, () => {
  console.log(`✅ TAIBOM API Server running at http://localhost:${PORT}`);
});
