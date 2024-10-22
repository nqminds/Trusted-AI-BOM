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

    class Data{
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

    class TrainingSystem{
    }

    class TestingSystem{
    }

    class InferenceSystem{
    }

    Licence --> Data
    Data  -->  DataPack: Many
    CVE --> SBOM
    SBOM --> system
    DataPack --> system
    Data --> system

    %% Inheritance to represent types of Data
    Data <|-- Weights
    Data <|-- TrainingData

    %% Inheritance to represent types of system
    system <|-- TrainingSystem
    system <|-- TestingSystem
    system <|-- InferenceSystem


```


