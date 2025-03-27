import { createVC, generateAndSignVC } from "./vc-tools.mjs";
import { generateKeyPair, convertToUint8 } from "./keys.mjs";
import {
  processVulnerabilityReport,
  generateVulnerabilityReport,
} from "./sbom.mjs";

export {
  createVC,
  generateAndSignVC,
  processVulnerabilityReport,
  generateVulnerabilityReport,
  generateKeyPair,
  convertToUint8,
};
