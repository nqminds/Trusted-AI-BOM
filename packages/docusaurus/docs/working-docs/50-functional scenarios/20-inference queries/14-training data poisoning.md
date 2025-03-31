## Query use case

Is there evidence that any of the training data on which this system has been trained has been poisoned



## Schemas used

* [data](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/10-data.v1.0.0.schema.yaml)
* [data pack](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/20-data-pack.v1.0.0.schema.yaml)
* [config](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/25-config.v1.0.0.schema.yaml) 
* [identity](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/5-identity.v1.0.0.schema.yaml)
* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [poisoned attestation](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/65-poisoned_attestation.v1.0.0.schema.yaml)


## Pseudo code 

```python
def ai_system_has_poisoned_data(AISystemId):
    Attestations = []

    # Step 1: Find all Data Verification Credentials (DataVcIds) linked to the AI System
    ConfigVcId = db_get_ai_system(AISystemId).config_vc_id
    WeightsVcId = get_trained_weights(ConfigVcId)

    if not is_weights_data(WeightsVcId):
        return []  # No poisoned attestations if weights data is invalid

    TrainingSystemVcId = get_training_system_for_weights(WeightsVcId)
    DatapackVcId = get_datapack_for_training_system(TrainingSystemVcId)

    # Step 2: Extract all dataset verification credentials (DataVcIds) from the datapack
    DataVcIds = extract_data_vcs_from_datapack(DatapackVcId)

    # Step 3: Identify poisoned attestations for each DataVcId
    for DataVcId in DataVcIds:
        attestations = get_poisoned_attestations_for_data(DataVcId)
        for attestation in attestations:
            if attestation.type == "poisoned":
                ComponentHash = attestation.component_hash
                PoisoningDetails = attestation.details
                Attestations.append(({"component": ComponentHash, "data_vc_id": DataVcId}, PoisoningDetails))

    # Step 4: Return all poisoned attestations found
    return Attestations
```

---

### **Explanation of the Full Functionality**
1. **Find relevant data sources**:  
   - Retrieve the **configuration verification credential** (`ConfigVcId`) for the AI system.  
   - Extract the **weights verification credential** (`WeightsVcId`) used in training.  
   - Ensure that the `WeightsVcId` is classified as `"Weights"`.  
   - Trace back to the **training system** that produced these weights.  
   - Identify the **datapack** used in the training process.  

2. **Extract the list of Data Verification Credentials (`DataVcIds`)** used in training from the datapack.  

3. **Identify attestations that indicate data poisoning**:  
   - For each `DataVcId`, retrieve its **poisoned attestations**.  
   - If an attestation is labeled as `"poisoned"`, extract its `component_hash` and `PoisoningDetails`.  

4. **Return a list of poisoned attestations**:  
   - Each entry consists of a tuple:  
     - **Component information** (`component hash` and `DataVcId`).  
     - **Poisoning details** describing how the data was compromised.  



## Query

- `ai_system_has_poisoned_data(AiSystemId, Attestations)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/poisening%2Cpollution%26bias/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L217-L220)
- link to simulator 



## Notes

