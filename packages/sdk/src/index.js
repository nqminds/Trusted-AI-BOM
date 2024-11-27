const {keypairDir, directoryExists, getIdentityJson, runBashCommand, ensureFilesExist, getAndVerifyClaim, getHash} = require ("./utils");
const {createVC, generateAndSignVC} = require("./vc-tools")
const {getIdentity, getPublicKeyPath} = require("./identity")

module.exports ={
  keypairDir, directoryExists, getIdentityJson, runBashCommand, ensureFilesExist, getAndVerifyClaim, getHash,
  createVC, generateAndSignVC, getIdentity, getPublicKeyPath
}