# Software Development Kit

Download the SDK from [here](http://example.com)

## Installation instructions

TODO


## Overview
The `taibom` CLI tool is designed to manage and create various metadata objects such as identities, data taiboms, datapacks, code taiboms, AI system taiboms, and configuration taiboms. It simplifies the process of defining and maintaining metadata for complex systems.

---

## Core Functionalities

### 1. Identity Creation
- **Inputs**:
  - Name
  - Email
  - Role
- **Description**: Generates and stores identity metadata in a `identity.json` file. Optionally saves the identity for reuse in a global configuration.

---

### 2. Data Taibom Creation
- **Inputs**:
  - Path to a file or folder
- **Description**: Analyses a file or folder and generates metadata such as name, hash, path. Stores metadata in `data_<name>_taibom.json`.

---

### 3. Datapack Taibom Creation
- **Inputs**:
  - Paths to multiple `data_<name>_taibom.json` files
  - Datapack name
- **Description**: Aggregates metadata from multiple data taiboms into a single `datapack_<name>_taibom.json` file.

---

### 4. Code Taibom Creation
- **Inputs**:
  - Path to a file or folder containing code
  - Version
- **Description**: Analyses code or executables and generates metadata (e.g., SBOM, hash). Stores metadata in `code_<id>_taibom.json` and `sbom_<id>_taibom.json`.

---

### 5. AI System Taibom Creation
- **Inputs**:
  - Code Taibom
  - Datapack Taibom or Config Taibom
  - Label: `Training` or `Inferencing`
  - Name
- **Description**: Combines metadata from a code taibom and a datapack/config taibom into an `ai_system_<name>_taibom.json` file.

---

### 6. Config Taibom Creation
- **Inputs**:
  - AI System Taibom
  - Data Taibom
  - Name
- **Description**: Defines configurations for an AI system using its taiboms. Stores metadata in a `config_<name>_taibom.json` file.

---

## CLI Commands

### Global Option
- `--config`: Specifies a path to a global configuration file.

### Commands
1. **Identity**
   - `taibom generate-identity <name> <email> <role>`

2. **Data Taibom**
   - `taibom data create --path <file_or_folder>`

3. **Datapack Taibom**
   - `taibom datapack create --data <data_taibom1> <data_taibom2> ...`

4. **Code Taibom**
   - `taibom code create --path <file_or_folder> --version <version_number>`

5. **AI System Taibom**
   - `taibom ai-system create --code <code_taibom> --data <datapack_taibom_or_config_taibom> --label <Training/Inferencing> --name <name>`

6. **Config Taibom**
   - `taibom config create --ai-system <ai_system_taibom> --data <data_taibom> --name <name>`

