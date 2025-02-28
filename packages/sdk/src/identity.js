const {getAndVerifyClaim} = require("./utils")

async function getIdentity(identityTaibom) {
  const identity = await getAndVerifyClaim(identityTaibom)
  if(!identity.credentialSchema.id === "https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/5-identity.v1.0.0.schema.yaml")
    throw new Error("TAIBOM claim is not an identity claim")
}

function getPublicKeyPath(identityJson) {
  return identityJson.credentialSubject.pub;
}

module.exports = {getIdentity, getPublicKeyPath}