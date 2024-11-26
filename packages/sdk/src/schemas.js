// TODO: this is hard coded
const path = require("path");
const ROOT_SCHEMA_DIR = "/home/tony/Projects/Trusted-AI-BOM/packages/sdk/schemas"

const {getAndVerifyClaim} = require("./utils")

function getSchemaDetails(schemaName) {
  const schemaPath = path.join(ROOT_SCHEMA_DIR, schemaName);
  const schema =  getAndVerifyClaim(schemaPath)
  return {schemaPath, schema}
}

module.exports = getSchemaDetails;