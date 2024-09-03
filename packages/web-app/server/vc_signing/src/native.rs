use crate::{Proof, VerifiableCredential, VerifiablePresentation};
use base64::{prelude::BASE64_STANDARD, Engine};
use chrono::Utc;
use ring::signature::{Ed25519KeyPair, KeyPair, UnparsedPublicKey, ED25519};
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_json::{from_value, to_string, Value};

pub trait ProofTrait {
    fn get_proof(&mut self) -> Result<Proof, String>;
    fn set_proof(&mut self, proof: Proof) -> Result<(), String>;
}

impl ProofTrait for VerifiablePresentation {
    fn get_proof(&mut self) -> Result<Proof, String> {
        self.proof.take().ok_or("VP is unsigned".to_string())
    }
    fn set_proof(&mut self, proof: Proof) -> Result<(), String> {
        self.proof = Some(proof);
        Ok(())
    }
}

impl ProofTrait for VerifiableCredential {
    fn get_proof(&mut self) -> Result<Proof, String> {
        self.proof.take().ok_or("VC is unsigned".to_string())
    }
    fn set_proof(&mut self, proof: Proof) -> Result<(), String> {
        self.proof = Some(proof);
        Ok(())
    }
}

pub trait CryptoTrait: ProofTrait {
    fn new(input: Value, _schema: &str) -> Result<Self, serde_json::error::Error>
    where
        Self: DeserializeOwned,
    {
        from_value::<Self>(input)
    }
    fn sign(mut self, private_key: &[u8]) -> Result<Self, String>
    where
        Self: Serialize + Sized,
    {
        let private_key = Ed25519KeyPair::from_pkcs8(private_key).map_err(|e| e.to_string())?;
        let jws = private_key.sign(to_string(&self).map_err(|e| e.to_string())?.as_bytes());
        let proof = Proof {
            proof_type: "JsonWebSignature2020".to_string(),
            jws: BASE64_STANDARD.encode(jws.as_ref()),
            proof_purpose: "assertionMethod".to_string(),
            created: Utc::now(),
        };
        self.set_proof(proof)?;
        Ok(self)
    }
    fn verify(&self, public_key: &[u8]) -> Result<(), String>
    where
        Self: Serialize + Clone,
    {
        let mut clone = self.clone();
        let public_key = UnparsedPublicKey::new(&ED25519, public_key);
        let jws = clone.get_proof()?.jws;
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
}

impl CryptoTrait for VerifiablePresentation {}
impl CryptoTrait for VerifiableCredential {}

pub fn gen_keys() -> Result<(Vec<u8>, Vec<u8>), String> {
    let private_key = Ed25519KeyPair::generate_pkcs8(&ring::rand::SystemRandom::new())
        .map_err(|e| e.to_string())?;
    Ok((
        private_key.as_ref().to_vec(),
        Ed25519KeyPair::from_pkcs8(private_key.as_ref())
            .map_err(|e| e.to_string())?
            .public_key()
            .as_ref()
            .to_vec(),
    ))
}
