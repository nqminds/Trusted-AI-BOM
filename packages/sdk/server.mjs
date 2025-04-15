import express from "express";
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { getHash } from "./bin/file-utils.mjs";
import { extractSchemaName } from "./src/vc-tools.mjs";
import { getMetadataHash, getStatsAsJson, runBashCommand } from "./bin/file-utils.mjs";

const app = express();
app.use(express.json()); // ✅ Enable JSON body parsing

const PORT = 3000;
const dbPath = path.join(process.env.HOME, ".taibom/guid_hash.db");
const db = new Database(dbPath);

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
app.get("/get-hash", async (req, res) => {
  const { guid, vc_hash } = req.query;

  const { vc: vcJson, dbEntry, message } = getVCJson({ guid, vc_hash });
  if (!vcJson) {
    return res.status(404).json({ error: "VC not found" });
  }

  const taibomType = extractSchemaName(vcJson);
  if (!["code", "data", "data-pack"].find((d) => d === taibomType)) {
    return res.status(404).json({
      error:
        "VC is not of type `code`, `data`, or `data-pack`, and does not include a file location hash",
    });
  }
  if (taibomType === "data-pack") {
    const datasets = vcJson.credentialSubject.datasets;

    const result = await Promise.all(
      datasets.map(({ id }) => {
        const {
          vc: data,
          dbEntry: dataDbEntry,
          message: dataMessage,
        } = getVCJson({ guid: id.replace("urn:uuid:", "") });
        if (!vcJson) {
          return {vcId: id, error: "VC not found" };
        }

        return getFileHashJSON(
          data,
          dataDbEntry,
          [message, dataMessage].filter(Boolean).join("\n")
        );
      })
    );
    if (result.error) {
      return res.status(404).json(result);
    }
    return res.json(result);
  } else {
    const result = await getFileHashJSON(vcJson, dbEntry, message);
    if (result.error) {
      return res.status(404).json(result);
    }
    return res.json(result);
  }
});

async function getFileHashJSON(vcJson, dbEntry, message = "") {
  const dataDir = vcJson.credentialSubject.location;

  if (dataDir.type !== "local") {
    return {
      error: "Only local file paths are supported for hashing.",
      message: "VC does not use a local file reference.",
    };
  }

  const cleanedRelativePath = dataDir.path.replace("file://", "");
  const resolvedPath = path.resolve(
    path.dirname(dbEntry.vc_filepath),
    cleanedRelativePath
  );

  const bashCommand = getHash(resolvedPath);

  try {
    const fileHash = await runBashCommand(bashCommand); // assumed to return a SHA-256 hash
    const metadataHash = await runBashCommand(getMetadataHash(resolvedPath))
    return { fileHash, metadataHash, message , vcId: vcJson.id, rootMetadata: getStatsAsJson(resolvedPath)};
  } catch (err) {
    return {
      vcId: vcJson.id,
      error: err.message,
      message:
        "The file may have been deleted, moved, or is not accessible. Could not generate hash.",
    };
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`✅ TAIBOM API Server running at http://localhost:${PORT}`);
});
