const {keypairDir, directoryExists, getIdentityJson, runBashCommand, ensureFilesExist, getAndVerifyClaim, getHash} = require ("./utils");
const {createVC, generateAndSignVC} = require("./vc-tools")

module.exports ={
  keypairDir, directoryExists, getIdentityJson, runBashCommand, ensureFilesExist, getAndVerifyClaim, getHash,
  createVC, generateAndSignVC
}