---
title: Requirements & Design
---

## Class Diagram

```mermaid

classDiagram 
    direction LR

    class DataPack {
        id
        name
        datasets
    }

    class TrainingData{
        id
        name
        location
        hash
        hashLocation
        lastUpdated
        licence
    }

    class Licence{
    }

    class CVE{
    }

    class SBOM {
    }

    class system {
        id
        name
        location
        hash
        hashLocation
        data
        licence
        sbom
    }


    class InferenceSystem{
    }
    
    class Weights{
        id
        data
        system
    }

    TrainingData  -->  DataPack: Many
    TrainingData --> system
    DataPack --> system
    DataPack --> Weights
    Weights --> InferenceSystem
    system --> Weights
    system --> InferenceSystem
    Licence --> system
    Licence --> TrainingData
    CVE --> SBOM
    SBOM --> system

```

## Relationships

`{Data}`  => Data Pack

Data Pack + System => Weights

Weights + Syatem => Inferencing system


## Additional attributes

Data + Licence => Licenced Data

SBOM + system => System component breakdown

CVE + System component breakdown => Security-Audited System 

