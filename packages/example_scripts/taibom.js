const {VerifiableCredential, VerifiablePresentation, gen_keys} = require("./Verifiable-Credential-Tools/vc_signing/node");
const {argv} = require('node:process');

let keys = gen_keys();

const vc1 = new VerifiableCredential({
    "@context": ["https://www.w3.org/ns/credentials/v2"],
    id: "urn:uuid:0aaf7f8e-d7f3-4a4e-ac15-119feda8e0ac",
    type: ["VerifiableCredential"],
    credentialSubject: {
        systemId: "SYSTEM_ID_1",
        systemName: "System 1",
        systemVersion: "1.0.0",
        systemCheck: "Data poisioning",
        dateTime: "2023-12-15T08:30:00.000Z"
    },
    "credentialSchema": {
        "id": "urn:uuid:69d4035a-4d2e-4f3c-870d-e0e187bae29f",
        "type": "JsonSchema"
    },
    "issuer": "urn:uuid:3934b1ea-7c16-4a23-ab97-e8d9a4097f8c"
}, "").sign(keys.private_key());

const vc2 = new VerifiableCredential({
    "@context": ["https://www.w3.org/ns/credentials/v2"],
    "id": "urn:uuid:ede46094-5be9-4e95-a0be-b7f44a24b512",
    "type": ["VerifiableCredential"],
    "credentialSubject": {
        weights: argv[2],
        data: "urn:uuid:6fc5b741-28c7-4606-b0e0-ec841fef17f5",
        name: "weights"
    },
    "credentialSchema": {
        "id": "urn:uuid:58677c77-3d45-414e-b45c-86e8f516ef0e",
        "type": "JsonSchema"
    },
    "issuer": "urn:uuid:3934b1ea-7c16-4a23-ab97-e8d9a4097f8c"
}, "").sign(keys.private_key());

const vp = new VerifiablePresentation({
    "@context": ["https://www.w3.org/ns/credentials/v2"],
    id: "urn:uuid:047dbd07-1320-4d54-a969-4d5b494b9ac7",
    type: ["VerifiablePresentation", "UserCredential"],
    verifiableCredential: [vc1.to_object(), vc2.to_object()],
    holder: "urn:uuid:3934b1ea-7c16-4a23-ab97-e8d9a4097f8c"
}).sign(keys.private_key()).to_object();

console.log(JSON.stringify(vp));
