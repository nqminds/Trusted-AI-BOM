## Query use case

Is there evidence that training data on which this system has been trained has been polluted (e.g. incorrectly categorised data)



## Schemas used

* [data](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/10-data.v1.0.0.schema.yaml)
* [data pack](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/20-data-pack.v1.0.0.schema.yaml)
* [config](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/25-config.v1.0.0.schema.yaml) 
* [identity](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/5-identity.v1.0.0.schema.yaml)
* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [poisoned attestation](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/66-polluted_attestation.v1.0.0.schema.yaml)




## Pseudo code 

```python
def ai_system_has_polluted_data(AISystemId):
    Attestations = []

    # Step 1: Find all Data Verification Credentials (DataVcIds) linked to the AI System
    ConfigVcId = db_get_ai_system(AISystemId).config_vc_id
    WeightsVcId = get_trained_weights(ConfigVcId)

    if not is_weights_data(WeightsVcId):
        return []  # No polluted attestations if weights data is invalid

    TrainingSystemVcId = get_training_system_for_weights(WeightsVcId)
    DatapackVcId = get_datapack_for_training_system(TrainingSystemVcId)

    # Step 2: Extract all dataset verification credentials (DataVcIds) from the datapack
    DataVcIds = extract_data_vcs_from_datapack(DatapackVcId)

    # Step 3: Identify polluted attestations for each DataVcId
    for DataVcId in DataVcIds:
        attestations = get_polluted_attestations_for_data(DataVcId)
        for attestation in attestations:
            if attestation.type == "polluted":
                ComponentHash = attestation.component_hash
                PollutionDetails = attestation.details
                Attestations.append(({"component": ComponentHash, "data_vc_id": DataVcId}, PollutionDetails))

    # Step 4: Return all polluted attestations found
    return Attestations
```

---

### **Explanation of the Full Functionality**
This function detects whether **polluted data** exists within an AI system by tracing the **data sources** used in training and verifying if any have a `"polluted"` attestation.

1. **Find the data sources used in the AI system**:  
   - Retrieve the **configuration verification credential** (`ConfigVcId`).  
   - Extract the **weights verification credential** (`WeightsVcId`).  
   - Ensure `WeightsVcId` is classified as `"Weights"`.  
   - Identify the **training system** used to generate these weights.  
   - Extract the **datapack** associated with this training system.  

2. **Extract the dataset verification credentials (`DataVcIds`)** from the datapack.  

3. **Identify attestations that indicate data pollution**:  
   - For each `DataVcId`, retrieve its **polluted attestations**.  
   - If an attestation is labeled as `"polluted"`, extract the `component hash` and `PollutionDetails`.  

4. **Return all polluted attestations** found:  
   - Each entry consists of:  
     - **Component information** (`component hash` and `DataVcId`).  
     - **Pollution details** explaining the contamination.  



## Query

- `ai_system_has_polluted_data(AiSystemId, Attestations)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/poisening%2Cpollution%26bias/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L221-L224)
- link to simulator 





## Notes

