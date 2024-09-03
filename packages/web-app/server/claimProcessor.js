import {
  VerifiableCredential,
  VerifiablePresentation,
  gen_keys,
} from "vc_signing";
import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import axios from "axios";
import YAML from "yaml";

export async function fetchSchema(schemaPath) {
  try {
    let schemaContent;
    if (schemaPath.startsWith("http")) {
      const response = await axios.get(schemaPath);
      schemaContent = response.data;
    } else {
      schemaContent = await fs.readFile(schemaPath, "utf8");
    }
    return YAML.parse(schemaContent);
  } catch (error) {
    console.error("Error fetching schema:", error.message);
    throw error;
  }
}

export async function processClaimData(schema, claimData) {
  // Validate claimData against schema
  // Generate VC and VP as in your CLI tool
  let keys = gen_keys();

  const vc = new VerifiableCredential(
    {
      "@context": ["https://www.w3.org/ns/credentials/v2"],
      id: `urn:uuid:${uuidv4()}`,
      type: ["VerifiableCredential"],
      credentialSubject: claimData,
      credentialSchema: {
        id: schema.$id,
        type: "JsonSchema",
      },
      issuer: `urn:uuid:${uuidv4()}`,
    },
    ""
  ).sign(keys.private_key());

  const vp = new VerifiablePresentation({
    "@context": ["https://www.w3.org/ns/credentials/v2"],
    id: `urn:uuid:${uuidv4()}`,
    type: ["VerifiablePresentation", "UserCredential"],
    verifiableCredential: [vc.to_object()],
    holder: `urn:uuid:${uuidv4()}`,
  })
    .sign(keys.private_key())
    .to_object();

  return vp;
}
