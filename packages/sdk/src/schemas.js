// TODO: this is hard coded
const path = require("path");
const os = require('os');

// Get the user's home directory
const homeDir = os.homedir();
const ROOT_SCHEMA_DIR = path.join(homeDir, '.taibom/schemas');

const {getAndVerifyClaim} = require("./utils")

function getSchemaDetails(schemaName) {
  const schemaPath = path.join(ROOT_SCHEMA_DIR, schemaName);
  const schema =  getAndVerifyClaim(schemaPath, true, true)
  return {schemaPath, schema}
}

module.exports = getSchemaDetails;