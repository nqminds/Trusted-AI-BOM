







## Verifiable Credential Schema 

TAIBOM is built on verifiable credentials

The scope of version 1 is summarised on the diagram below, which identifies the key elements and the relationship between each  





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

