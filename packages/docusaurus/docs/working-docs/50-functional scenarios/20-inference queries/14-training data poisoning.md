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

```
FUNCTION ai_system_has_poisoned_data(AI_System_ID)
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

    // Step 3: Check for poisoned attestations in each dataset verification credential
    FOR EACH Data_VC_ID in Data_VC_IDs DO
        SET Attestations_List = get poisoned attestations linked to Data_VC_ID

        FOR EACH Attestation in Attestations_List DO
            IF Attestation is of type "poisoned" THEN
                SET Component_Hash = Attestation's component hash
                SET Poisoning_Details = Attestation's details
                
                ADD ({"component": Component_Hash, "data_vc_id": Data_VC_ID}, Poisoning_Details) TO Attestations

    // Step 4: Return all poisoned attestations found
    RETURN Attestations
END FUNCTION
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

