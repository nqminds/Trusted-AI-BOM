## Query use case

Is there evidence that training data on which this system has been trained has been pollution (e.g. incorrectly categorised data)



## Schemas used

* [data](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/10-data.v1.0.0.schema.yaml)
* [data pack](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/20-data-pack.v1.0.0.schema.yaml)
* [config](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/25-config.v1.0.0.schema.yaml) 
* [identity](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/5-identity.v1.0.0.schema.yaml)
* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [poisoning attestation](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/66-pollution-attestation.v1.0.0.schema.yaml)




## Pseudo code 

```
FUNCTION ai_system_has_data_pollution(AI_System_ID)
    CREATE empty list Attestations

    // Step 1: Retrieve the AI system's configuration and trained weights
    SET Config_VC_ID = get configuration verification credential of AI_System_ID
    SET Weights_VC_ID = get trained weights using Config_VC_ID

    // If the weights data is invalid, return an empty list
    IF Weights_VC_ID is not valid THEN
        RETURN empty list

    // Retrieve the training system and associated datapack
    SET Training_System_VC_ID = get training system linked to Weights_VC_ID
    SET Datapack_VC_ID = get datapack linked to Training_System_VC_ID

    // Step 2: Extract dataset verification credentials from the datapack
    SET Data_VC_IDs = extract dataset verification credentials from Datapack_VC_ID

    // Step 3: Check for pollution attestations in each dataset verification credential
    FOR EACH Data_VC_ID in Data_VC_IDs DO
        SET Attestations_List = get pollution attestations linked to Data_VC_ID

        FOR EACH Attestation in Attestations_List DO
            IF Attestation is of type "pollution" THEN
                SET Component_Hash = Attestation's component hash
                SET Pollution_Details = Attestation's details
                
                ADD ({"component": Component_Hash, "data_vc_id": Data_VC_ID}, Pollution_Details) TO Attestations

    // Step 4: Return all pollution attestations found
    RETURN Attestations
END FUNCTION

```

---

### **Explanation of the Full Functionality**
This function detects whether **pollution data** exists within an AI system by tracing the **data sources** used in training and verifying if any have a `"pollution"` attestation.

1. **Find the data sources used in the AI system**:  
   - Retrieve the **configuration verification credential** (`ConfigVcId`).  
   - Extract the **weights verification credential** (`WeightsVcId`).  
   - Ensure `WeightsVcId` is classified as `"Weights"`.  
   - Identify the **training system** used to generate these weights.  
   - Extract the **datapack** associated with this training system.  

2. **Extract the dataset verification credentials (`DataVcIds`)** from the datapack.  

3. **Identify attestations that indicate data pollution**:  
   - For each `DataVcId`, retrieve its **pollution attestations**.  
   - If an attestation is labeled as `"pollution"`, extract the `component hash` and `PollutionDetails`.  

4. **Return all pollution attestations** found:  
   - Each entry consists of:  
     - **Component information** (`component hash` and `DataVcId`).  
     - **Pollution details** explaining the contamination.  



## Query

- `ai_system_has_data_pollution(AiSystemId, Attestations)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L221-L224)
- link to simulator 





## Notes

