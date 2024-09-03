use crate::{Proof, VerifiableCredential, VerifiablePresentation};
use base64::{prelude::BASE64_STANDARD, Engine};
use chrono::Utc;
use ring::signature::{Ed25519KeyPair, KeyPair, UnparsedPublicKey, ED25519};
use serde::Serializer;
use serde_json::to_string;
use wasm_bindgen::prelude::wasm_bindgen;
use wasm_bindgen::JsValue;

#[wasm_bindgen]
impl VerifiablePresentation {
    #[wasm_bindgen(constructor)]
    pub fn new(verifiable_presentation: JsValue) -> Result<VerifiablePresentation, String> {
        serde_wasm_bindgen::from_value::<VerifiablePresentation>(verifiable_presentation)
            .map_err(|e| e.to_string())
    }
    pub fn sign(mut self, private_key: &[u8]) -> Result<VerifiablePresentation, String> {
        let private_key = Ed25519KeyPair::from_pkcs8(private_key).map_err(|e| e.to_string())?;
        let jws = private_key.sign(to_string(&self).map_err(|e| e.to_string())?.as_bytes());
        self.proof = Some(Proof {
            proof_type: "JsonWebSignature2020".to_string(),
            jws: BASE64_STANDARD.encode(jws.as_ref()),
            proof_purpose: "assertionMethod".to_string(),
            created: Utc::now(),
        });
        Ok(self)
    }
    pub fn verify(&self, public_key: &[u8]) -> Result<(), String> {
        let mut clone = self.clone();
        let public_key = UnparsedPublicKey::new(&ED25519, public_key);
        let jws = clone.proof.take().ok_or("VC is unsigned")?.jws;
        public_key
            .verify(
                to_string(&clone).map_err(|e| e.to_string())?.as_bytes(),
                BASE64_STANDARD
                    .decode(jws)
                    .map_err(|e| e.to_string())?
                    .as_slice(),
            )
            .map_err(|e| e.to_string())
    }
    pub fn to_object(&self) -> Result<JsValue, String> {
        serde_wasm_bindgen::Serializer::json_compatible()
            .serialize_newtype_struct("", self)
            .map_err(|e| e.to_string())
    }
}

#[wasm_bindgen]
impl VerifiableCredential {
    #[wasm_bindgen(constructor)]
    pub fn new(
        verifiable_credential: JsValue,
        _schema: &str,
    ) -> Result<VerifiableCredential, String> {
        serde_wasm_bindgen::from_value::<VerifiableCredential>(verifiable_credential)
            .map_err(|e| e.to_string())
    }
    pub fn sign(mut self, private_key: &[u8]) -> Result<VerifiableCredential, String> {
        let private_key = Ed25519KeyPair::from_pkcs8(private_key).map_err(|e| e.to_string())?;
        let jws = private_key.sign(to_string(&self).map_err(|e| e.to_string())?.as_bytes());
        self.proof = Some(Proof {
            proof_type: "JsonWebSignature2020".to_string(),
            jws: BASE64_STANDARD.encode(jws.as_ref()),
            proof_purpose: "assertionMethod".to_string(),
            created: Utc::now(),
        });
        Ok(self)
    }
    pub fn verify(&self, public_key: &[u8]) -> Result<(), String> {
        let mut clone = self.clone();
        let public_key = UnparsedPublicKey::new(&ED25519, public_key);
        let jws = clone.proof.take().ok_or("VC is unsigned")?.jws;
        public_key
            .verify(
                to_string(&clone).map_err(|e| e.to_string())?.as_bytes(),
                BASE64_STANDARD
                    .decode(jws)
                    .map_err(|e| e.to_string())?
                    .as_slice(),
            )
            .map_err(|e| e.to_string())
    }
    pub fn to_object(&self) -> Result<JsValue, String> {
        serde_wasm_bindgen::Serializer::json_compatible()
            .serialize_newtype_struct("", self)
            .map_err(|e| e.to_string())
    }
}

#[wasm_bindgen]
pub struct KeyPairStruct {
    private_key: Vec<u8>,
    public_key: Vec<u8>,
}

#[wasm_bindgen]
impl KeyPairStruct {
    pub fn private_key(&self) -> Vec<u8> {
        self.private_key.clone()
    }
    pub fn public_key(&self) -> Vec<u8> {
        self.public_key.clone()
    }
}

#[wasm_bindgen]
pub fn gen_keys() -> Result<KeyPairStruct, String> {
    let private_key = Ed25519KeyPair::generate_pkcs8(&ring::rand::SystemRandom::new())
        .map_err(|e| e.to_string())?
        .as_ref()
        .to_vec();
    let public_key = Ed25519KeyPair::from_pkcs8(&private_key)
        .map_err(|e| e.to_string())?
        .public_key()
        .as_ref()
        .to_vec();
    Ok(KeyPairStruct {
        private_key,
        public_key,
    })
}
