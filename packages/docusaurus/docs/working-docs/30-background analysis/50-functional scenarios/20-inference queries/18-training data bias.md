## Query use case

Is there evidence that training data on which this system has (or is free of) bias?

## Schemas used

* [data](https://taibom.org/schemas/data/v1.0.0/TAIBOM%20Data/)
* [data pack](https://taibom.org/schemas/data-pack/v1.0.0/TAIBOM%20Datapack/)
* [config](https://taibom.org/schemas/config/v1.0.0/Trained%20System%20Configs/) 
* [identity](https://taibom.org/schemas/identity/v1.0.0/Identity%20schema/)
* [ai system](https://taibom.org/schemas/ai-system/v1.0.0/AI%20System/)
* [bias attestation](https://taibom.org/schemas/bias-attestation/v1.0.0/Bias%20Attestation/)




## Pseudo code 

```
FUNCTION ai_system_has_data_bias(AI_System_ID)
    CREATE empty list Attestations

    // Step 1: Retrieve dataset verification credentials linked to the AI system
    SET Data_VC_IDs = get dataset verification credentials associated with AI_System_ID

    // Step 2: Identify bias attestations in each dataset verification credential
    FOR EACH Data_VC_ID in Data_VC_IDs DO
        SET Attestations_List = get bias attestations linked to Data_VC_ID

        FOR EACH Attestation in Attestations_List DO
            IF Attestation is of type "bias" THEN
                SET Component_Hash = Attestation's component hash
                SET Bias_Details = Attestation's details
                
                ADD ({"component": Component_Hash, "data_vc_id": Data_VC_ID}, Bias_Details) TO Attestations

    // Step 3: Return all bias attestations found
    RETURN Attestations
END FUNCTION

```

---

### **Explanation**
1. **Find relevant data sources**:  
   - Retrieve the **configuration verification credential** (`ConfigVcId`) for the AI system.  
   - Extract the **weights verification credential** (`WeightsVcId`) used in training.  
   - Ensure that the `WeightsVcId` is classified as `"Weights"`.  
   - Trace back to the **training system** that produced these weights.  
   - Identify the **datapack** used in the training process.  

2. **Extract the list of Data Verification Credentials (`DataVcIds`)** used in training from the datapack.  

3. **Identify attestations that indicate bias**:  
   - For each `DataVcId`, retrieve its **bias attestations**.  
   - If an attestation is labeled as `"bias"`, extract its `component_hash` and `BiasDetails`.  

4. **Return a list of bias attestations**:  
   - Each entry consists of a tuple:  
     - **Component information** (`component hash` and `DataVcId`).  
     - **Bias details** describing the detected bias.  




## Query

- `ai_system_has_data_bias(AiSystemId, Attestations)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L225-L228)
- link to simulator 



## Notes

This assumes we have a trusted method to identify bias on a data set. 
