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

    }

    class InferenceSystem{
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
    DataPack --* TrainedSystem : Composition
    Weights --* InferenceSystem : Composition
    TrainedSystem --> Weights : Creates
    TrainedSystem --* InferenceSystem : Composition

    %% Licence --> TrainingData
    %% Licence --> Code
    %% Licence --> TrainedSystem
    %% Licence --> InferenceSystem

    CVE --> SBOM
    SBOM --> Code  
    Code --* TrainedSystem : Composition

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


