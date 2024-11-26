const {keypairDir, directoryExists, getIdentityJson, runBashCommand, ensureFilesExist} = require ("./utils");
const {createVC, generateAndSignVC} = require("./vc-tools")

module.exports ={
  keypairDir, directoryExists, getIdentityJson, runBashCommand, ensureFilesExist, 
  createVC, generateAndSignVC
}