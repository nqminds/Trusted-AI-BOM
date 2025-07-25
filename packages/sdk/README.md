# 🛰️ TAIBOM API Server

This is an Express-based API server that provides access to **Verifiable Credentials (VCs)** stored in a local SQLite database. It supports retrieval of VCs and file-based integrity verification using content and metadata hashes.

---

## 📦 Features

- 🔍 **Query Verifiable Credentials** using `guid` or `vc_hash`.
- 🧾 **Retrieve VC JSON** stored on disk or fallback to DB copy.
- 🔐 **Get SHA-256 Hashes** of dataset contents and file metadata.
- 🧠 **Supports Composite VCs** (like `data-pack` types) by resolving and hashing referenced datasets recursively.
- 🗃️ Uses a local **SQLite database** (`~/.taibom/guid_hash.db`) to store VC metadata and paths.

---

## 🚀 Endpoints

### `GET /get-vc`

Retrieve a VC (Verifiable Credential) JSON document.

#### Query Parameters:
- `guid` – UUID of the VC.
- `vc_hash` – Content hash of the VC.

#### Example:
```bash
curl "http://localhost:3000/get-vc?guid=123e4567-e89b-12d3-a456-426614174000"
```

---

### `GET /get-hash`

Returns a content and metadata hash of the dataset referenced in the VC.

#### Query Parameters:
- `guid` – UUID of the VC.
- `vc_hash` – Content hash of the VC.

#### Returns:
```json
{
  "vcId": "urn:uuid:...",
  "fileHash": "<sha256-of-file-contents>",
  "metadataHash": "<sha256-of-metadata>",
  "rootMetadata": {
    "path": "...",
    "size": 1234,
    "type": "directory",
    "permissions": "775",
    ...
  },
  "message": "Optional warnings or notes"
}
```

For `data-pack` VCs, this returns an array of hashes for each referenced dataset.

---

## 🧠 How It Works

1. **Verifiable Credential Retrieval**:
   - Looks up `vc_filepath` in the local SQLite database.
   - If file exists, loads JSON from disk.
   - If missing, falls back to `vc` JSON stored directly in the DB.

2. **Hashing Logic**:
   - Uses `getHash()` to hash **file contents** recursively.
   - Uses `getMetadataHash()` to hash **file metadata** (size, permissions, mtime, etc).
   - Metadata for the root dataset directory is returned using `getStatsAsJson()`.

---

## 📁 File Structure

- `server.mjs`: Main API server file (you’re here)
- `bin/file-utils.mjs`: Helper functions for hashing, metadata, etc.
- `src/vc-tools.mjs`: Tools for inspecting and parsing VC schemas.

---

## ⚙️ Requirements

- Node.js (v16+)
- `better-sqlite3` for SQLite integration
- A valid VC SQLite DB at: `~/.taibom/guid_hash.db`

---

## 🛠️ Example Development Run

```bash
node server.mjs
```

Then open your browser or use `curl`:

```bash
curl "http://localhost:3000/get-hash?guid=<your-guid>"
```

---

## 🧪 Example VC Structure (Simplified)

```json
{
  "id": "urn:uuid:...",
  "type": ["VerifiableCredential", "data"],
  "credentialSubject": {
    "location": {
      "type": "local",
      "path": "file://relative/path/to/data"
    }
  }
}
```

---

## 🧯 Error Handling

- Returns 404 if VC or data files are missing.
- Detailed error messages and fallback logic included for robust behavior.

---
