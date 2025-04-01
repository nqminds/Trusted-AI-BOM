## Query use case

Is there evidence that training data on which this system has (or is free of) bias?

## Schemas used

* [data](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/10-data.v1.0.0.schema.yaml)
* [data pack](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/20-data-pack.v1.0.0.schema.yaml)
* [config](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/25-config.v1.0.0.schema.yaml) 
* [identity](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/5-identity.v1.0.0.schema.yaml)
* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [biased attestation](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/67-biased_attestation.v1.0.0.schema.yaml)




## Pseudo code 

```
FUNCTION ai_system_has_biased_data(AI_System_ID)
    CREATE empty list Attestations

    // Step 1: Retrieve dataset verification credentials linked to the AI system
    SET Data_VC_IDs = get dataset verification credentials associated with AI_System_ID

    // Step 2: Identify biased attestations in each dataset verification credential
    FOR EACH Data_VC_ID in Data_VC_IDs DO
        SET Attestations_List = get biased attestations linked to Data_VC_ID

        FOR EACH Attestation in Attestations_List DO
            IF Attestation is of type "biased" THEN
                SET Component_Hash = Attestation's component hash
                SET Bias_Details = Attestation's details
                
                ADD ({"component": Component_Hash, "data_vc_id": Data_VC_ID}, Bias_Details) TO Attestations

    // Step 3: Return all biased attestations found
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

3. **Identify attestations that indicate bias**:  
   - For each `DataVcId`, retrieve its **biased attestations**.  
   - If an attestation is labeled as `"biased"`, extract its `component_hash` and `BiasDetails`.  

4. **Return a list of biased attestations**:  
   - Each entry consists of a tuple:  
     - **Component information** (`component hash` and `DataVcId`).  
     - **Bias details** describing the detected bias.  




## Query

- `ai_system_has_biased_data(AiSystemId, Attestations)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/poisening%2Cpollution%26bias/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L225-L228)
- link to simulator 



## Notes

This assumes we have a trusted method to identify bias on a data set. 
