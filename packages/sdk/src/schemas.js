const path = require("path");
const os = require("os");
const fs = require("fs");

// Get the user's home directory
const homeDir = os.homedir();
const ROOT_SCHEMA_DIR = path.join(homeDir, ".taibom/schemas");

function getSchemaDetails(schemaName) {
  const schemaPath = path.join(ROOT_SCHEMA_DIR, schemaName);
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Claim file not found at path: ${path}`);
  }

  // Read and parse the JSON file
  const jsonFile = fs.readFileSync(schemaPath, "utf8");
  const schema = JSON.parse(jsonFile);
  return { schemaPath, schema };
}

module.exports = getSchemaDetails;
