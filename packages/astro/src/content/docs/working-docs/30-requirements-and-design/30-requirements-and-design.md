---
title: Requirements & Design
---

## Class Diagram

```mermaid

classDiagram
    direction LR

    class DataPack {
        name
        datasets
    }

    class TrainingData {
    }

    class Data {
      name
      label
      location.type
      location.path
      hashLocation
      lastAccessed
    }

    class Licence {
    }

    class CVE {
    }

    class SBOM {
    }

    class TrainedSystem {
    }

    class InferenceSystem {
    }

    class Weights {
    }

    class TrainingCode {
    }

    class InferencingCode {
    }

    class Code {
      name
      location.type
      location.path
      hash
      hashLocation
      sbom
    }

    class AISystem {
        name
        label
        code
        data
    }

    class Config {
      name
      aiSystem
      data
    }

    %% Relationships
    %% DataPack and related entities
    TrainingData "*" --o "1" DataPack : Aggregation
    DataPack --* TrainedSystem : Compose
    Config --* InferenceSystem : Compose
    TrainedSystem --> Weights : Creates

    %% SBOM and related entities
    CVE "*" o-- "1" SBOM : Aggregation
    SBOM <-- TrainingCode : Creates
    TrainingCode --* TrainedSystem : Compose
    SBOM --* Code : Compose

    SBOM <-- InferencingCode : Creates
    InferencingCode --* InferenceSystem : Compose

    %% Config and related entities
    Weights --* Config : Compose
    TrainedSystem --* Config : Compose

    %% Inheritance
    Data <|-- Weights : Inherits
    Data <|-- TrainingData : Inherits

    Code <|-- TrainingCode : Inherits
    Code <|-- InferencingCode : Inherits

    AISystem <|-- TrainedSystem : Inherits
    AISystem <|-- InferenceSystem : Inherits

```

## Claims & Attestations

Below are a few examples of claims and attestations which can be made on an AI system

### Data

- **Unwanted Bias**:  
  The presence of biases in the training data that can lead to skewed results or unfair outcomes.

- **Hallucinations**:  
  Instances where the system generates outputs that are factually incorrect or misleading due to inaccuracies in the data.

- **Errors in Generated Data**:  
  Refers to inaccuracies or mistakes in the data produced by the system during its operation or training.

- **Data Poisoning**:  
  The risk that adversarial inputs can corrupt the training dataset, potentially leading to malicious outcomes.

- **Data Pollution**:  
  The introduction of unwanted or low-quality data that degrades the quality and performance of the trained model.

### Systems

- **Cybersecurity Flaws**:  
  Vulnerabilities in the system architecture that could be exploited by malicious actors to compromise security.

- **Implementation Flaws**:  
  Issues arising from incorrect implementation of the system, which can lead to performance problems or security vulnerabilities.

- **Compliance Gaps**:  
  Potential areas where the system may not meet regulatory or industry standards, impacting trust and legal standing.