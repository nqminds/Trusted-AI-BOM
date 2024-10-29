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

    class TrainingData{
        name
        location
        hash
        hashLocation
        lastUpdated
    }

    class Licence{
    }

    class CVE{
    }

    class SBOM {
    }

    class TrainedSystem {
        name
        location
        hash
        hashLocation
    }

    class InferenceSystem{
        name
        location
        hash
        hashLocation
    }
    
    class Weights{
        name
        location
        hash
        hashLocation
    }

    class Code { 
        name
        location
        hash
        hashLocation
    }

    TrainingData "*" --o "1" DataPack : Aggregation
    DataPack --> TrainedSystem
    DataPack --> Weights
    Weights --> InferenceSystem
    TrainedSystem --> Weights
    TrainedSystem --> InferenceSystem

    %% Licence --> TrainingData
    %% Licence --> Code
    %% Licence --> TrainedSystem
    %% Licence --> InferenceSystem

    CVE --> SBOM
    SBOM --> Code  
    Code --> TrainedSystem  

```

## Relationships

`{Data}`  => Data Pack

Data Pack + System => Weights

Weights + System => Inferencing system


## Additional attributes

Data + Licence => Licenced Data

SBOM + system => System component breakdown

CVE + System component breakdown => Security-Audited System 

## Claims & Attestations

### Data

- Unwanted Bias
- Hallucinations 
- Errors in generated data
- Poisoning 
- Pollution
- etc.

### Systems 
- Cybersecurity Flaws
- Implementation flaws
- etc


