const {VerifiableCredential, gen_keys} = require("./vc_signing");

const keys = gen_keys();
const vc = new VerifiableCredential({
    "@context": ["https://www.w3.org/ns/credentials/v2"],
    "id": "urn:uuid:ac4ec86f-f601-400c-846d-097f41d09022",
    "type": ["VerifiableCredential"],
    "credentialSubject": {
        "device": "www.client.com",
        "deviceType": "Raspberry Pi",
        "validFrom": "2022-02-05T10:30:00.1Z"
    },
    "credentialSchema": {
        "id": "https://github.com/nqminds/nist-brski/blob/main/packages/schemas/src/device_type_binding.yaml",
        "type": "JsonSchema"
    },
    "issuer": "urn:uuid:2d58c8e9-a027-40ec-80c3-f053a3782335",
    "validFrom": "2024-05-23T12:22:33.723Z"
}, "").sign(keys.private_key());

const object = vc.to_object(); // convert to object to send to other users etc
console.log(object);

// instantiate VC received from peer and verify
const received = new VerifiableCredential(object, "");
try {
    received.verify(keys.public_key());
    console.log("Verified");
} catch (e) {
    console.error(e);
}