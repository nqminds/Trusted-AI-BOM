# SDK for Creating & Verifying TAIBOMs

### Download the TAIBOM SDK

  <a href="/nqminds-taibom-sdk-0.0.2.tgz">
    Download the SDK here!
  </a>

### Prerequisites

[Docker](https://www.docker.com/) is required to generate SBOMS & Vulnerability reports

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

Install the SDK as a global CLI:
```bash
npm install -g path/to/your/sdk
```

---

## CLI Usage
Below are the available commands and their respective options:

### General Information
```bash
taibom --help
```
Display the help menu with all commands and options.

### Version Information
```bash
taibom --version
```
Show the SDK version.

---

## Commands

### 1. Generate Identity
Generate an identity with a keypair.
```bash
taibom generate-identity <name> <email> <role>
```
#### Arguments:
- `<name>`: The name of the person.
- `<email>`: Email address (validated for proper format).
- `<role>`: The role or designation of the person.

---

### 2. Generate Data TAIBOM
Generate a TAIBOM for a specific dataset.
```bash
taibom data-taibom <identity_email> <data_directory> [--weights]
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
taibom generate-sbom <identity_email> <code_directory> [--cpp]
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
taibom code-taibom <identity_email> <code_directory> <version> [--sbomTaibom <path>] [--name <code_name>]
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
taibom system-taibom <identity_email> <code_taibom> <data_taibom> [--name <system_name>] [--inferencing]
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
taibom datapack-taibom <identity_email> <name> <data_taiboms...>
```
#### Arguments:
- `<identity_email>`: Email address of the identity signing the TAIBOM.
- `<name>`: Name of the dataset pack.
- `<data_taiboms...>`: Space-separated paths to data TAIBOM claims.

---

### 7. Generate Config TAIBOM
Create a TAIBOM for the configuration of an AI system.
```bash
taibom config-taibom <identity_email> <ai_system_taibom> <data_taibom> [--name <config_name>]
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
taibom validate-data <data_taibom>
```
#### Arguments:
- `<data_taibom>`: Path to the TAIBOM data claim.

---

### 9. Validate Code TAIBOM
Validate the integrity of a code TAIBOM.
```bash
taibom validate-code <code_taibom>
```
#### Arguments:
- `<code_taibom>`: Path to the TAIBOM code claim.

---

## Examples

### Generate Identity
```bash
taibom generate-identity "Alice" "alice@example.com" "Data Scientist"
```

### Create Data TAIBOM
```bash
taibom data-taibom alice@example.com ./data/dataset --weights
```

### Validate Code TAIBOM
```bash
taibom validate-code ./claims/code-taibom.json
```

---

