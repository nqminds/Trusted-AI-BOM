# SDK for Creating & Verifying TAIBOMs

### Downloads & Prerequisites

- [SBOM-GAP tool](https://sbom-gap.nqminds.com/cli/) - Not essential unless you are wanting to create SBOMS: `taibom-cli generate-sbom`
- Verifiable-Credential-Tools: [see docs](./2-vc-tool.md)


### Download the TAIBOM SDK

  <a href="/nqminds-taibom-sdk-0.0.1.tgz">
    Download
  </a>

---

## Overview
This SDK provides a command-line interface (CLI) for creating, documenting, signing, and verifying Trusted-AI BOM (TAIBOM) Verifiable Credentials (VCs). It enables the generation of identities, data claims, software bills of materials (SBOMs), and various TAIBOM types for AI systems.

### Features:
- Identity creation with keypair generation.
- Generation and signing of data, code, system, datapack, and configuration TAIBOMs.
- SBOM generation and signing for code repositories.
- Validation of TAIBOM claims against their associated hashes.

---

## Installation
To use this SDK, ensure the following dependencies are installed:

1. **Node.js**: Version 14 or higher.
2. **VC Tools CLI**: Required for generating keypairs.
3. **NQMVUL CLI**: For SBOM generation.
4. **Other tools**: `bash`, `uuid`.

Install the SDK as a global CLI:
```bash
npm install -g path/to/your/sdk
```

---

## CLI Usage
Below are the available commands and their respective options:

### General Information
```bash
taibom-cli --help
```
Display the help menu with all commands and options.

### Version Information
```bash
taibom-cli --version
```
Show the SDK version.

---

## Commands

### 1. Generate Identity
Generate an identity with a keypair.
```bash
taibom-cli generate-identity <name> <email> <role>
```
#### Arguments:
- `<name>`: The name of the person.
- `<email>`: Email address (validated for proper format).
- `<role>`: The role or designation of the person.

---

### 2. Generate Data TAIBOM
Generate a TAIBOM for a specific dataset.
```bash
taibom-cli data-taibom <identity_email> <data_directory> [--weights]
```
#### Arguments:
- `<identity_email>`: Email address of the identity signing the TAIBOM.
- `<data_directory>`: Directory containing the data.

#### Options:
- `--weights`: Specify if the data directory contains AI weights.

---

### 3. Generate SBOM
Generate and sign a Software Bill of Materials (SBOM) for a code repository.
```bash
taibom-cli generate-sbom <identity_email> <code_directory> [--cpp]
```
#### Arguments:
- `<identity_email>`: Email address of the identity signing the SBOM.
- `<code_directory>`: Directory containing the code.

#### Options:
- `--cpp`: Generate an SBOM for C/C++ code (optional).

---

### 4. Generate Code TAIBOM
Create a TAIBOM for a specific version of code.
```bash
taibom-cli code-taibom <identity_email> <code_directory> <version> [--sbomTaibom <path>] [--name <code_name>]
```
#### Arguments:
- `<identity_email>`: Email address of the identity signing the TAIBOM.
- `<code_directory>`: Directory containing the code.
- `<version>`: Version number of the code.

#### Options:
- `--sbomTaibom <path>`: Reference to an SBOM TAIBOM (optional).
- `--name <code_name>`: Name of the code or package (optional).

---

### 5. Generate AI System TAIBOM
Generate a TAIBOM for an AI system.
```bash
taibom-cli system-taibom <identity_email> <code_taibom> <data_taibom> [--name <system_name>] [--inferencing]
```
#### Arguments:
- `<identity_email>`: Email address of the identity signing the TAIBOM.
- `<code_taibom>`: Path to the code TAIBOM claim.
- `<data_taibom>`: Path to the data TAIBOM claim.

#### Options:
- `--name <system_name>`: Name of the system (optional).
- `--inferencing`: Label the system as "Inferencing" instead of "Training".

---

### 6. Generate Datapack TAIBOM
Create a TAIBOM for a dataset pack consisting of multiple datasets.
```bash
taibom-cli datapack-taibom <identity_email> <name> <data_taiboms...>
```
#### Arguments:
- `<identity_email>`: Email address of the identity signing the TAIBOM.
- `<name>`: Name of the dataset pack.
- `<data_taiboms...>`: Space-separated paths to data TAIBOM claims.

---

### 7. Generate Config TAIBOM
Create a TAIBOM for the configuration of an AI system.
```bash
taibom-cli config-taibom <identity_email> <ai_system_taibom> <data_taibom> [--name <config_name>]
```
#### Arguments:
- `<identity_email>`: Email address of the identity signing the TAIBOM.
- `<ai_system_taibom>`: Path to the AI system TAIBOM.
- `<data_taibom>`: Path to the data TAIBOM for the configuration.

#### Options:
- `--name <config_name>`: Name of the configuration (optional).

---

### 8. Validate Data TAIBOM
Validate the integrity of a data TAIBOM.
```bash
taibom-cli validate-data <data_taibom>
```
#### Arguments:
- `<data_taibom>`: Path to the TAIBOM data claim.

---

### 9. Validate Code TAIBOM
Validate the integrity of a code TAIBOM.
```bash
taibom-cli validate-code <code_taibom>
```
#### Arguments:
- `<code_taibom>`: Path to the TAIBOM code claim.

---

## Examples

### Generate Identity
```bash
taibom-cli generate-identity "Alice" "alice@example.com" "Data Scientist"
```

### Create Data TAIBOM
```bash
taibom-cli data-taibom alice@example.com ./data/dataset --weights
```

### Validate Code TAIBOM
```bash
taibom-cli validate-code ./claims/code-taibom.json
```

---

