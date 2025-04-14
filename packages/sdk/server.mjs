import express from "express";
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { getHash } from "./bin/file-utils.mjs";
import { exec } from "child_process";
import { extractSchemaName } from "./src/vc-tools.mjs";

const app = express();
app.use(express.json()); // ✅ Enable JSON body parsing

const PORT = 3000;
const dbPath = path.join(process.env.HOME, ".taibom/guid_hash.db");
const db = new Database(dbPath);

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
    console.error(
      `❌ VC File not found on disk: ${vcFilePath}, reverting to stored VC in guid_hash_table`
    );
    return {
      vc: JSON.parse(result.vc),
      dbEntry: result,
      message: `TAIBOM File not found on disk: ${vcFilePath}, reverting to stored TAIBOM in guid_hash_table`,
    };
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

  const { vc: vcJson, dbEntry } = getVCJson({ guid, vc_hash });
  if (!vcJson) {
    return res.status(404).json({ error: "VC not found" });
  }

  res.json(vcJson);
});

// ✅ API Endpoint: Get the data hash
app.get("/get-hash", (req, res) => {
  const { guid, vc_hash } = req.query;

  const { vc: vcJson, dbEntry, message } = getVCJson({ guid, vc_hash });
  if (!vcJson) {
    return res.status(404).json({ error: "VC not found" });
  }

  const taibomType = extractSchemaName(vcJson);
  if (!["code", "data", "data-pack"].find((d) => d === taibomType)) {
    return res
      .status(404)
      .json({
        error:
          "VC is not of type `code`, `data`, or `data-pack`, and does not include a file location hash",
      });
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
        res.status(404).json({ error: error.message , message: "The file may have been deleted / removed, unable to provide a hash for this TABIOM"});
      } else {
        res.json({ file_hash: hash, message });
      }
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ TAIBOM API Server running at http://localhost:${PORT}`);
});
