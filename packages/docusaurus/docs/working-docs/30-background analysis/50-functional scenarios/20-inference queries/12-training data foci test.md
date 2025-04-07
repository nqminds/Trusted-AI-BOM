## Query use case

Do we trust the providers/origin of all training data used - using exception list


## Schemas used

* [data](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/10-data.v1.0.0.schema.yaml)
* [data pack](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/20-data-pack.v1.0.0.schema.yaml)
* [config](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/25-config.v1.0.0.schema.yaml) 
* [identity](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/5-identity.v1.0.0.schema.yaml)
* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [provided attestation](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/64-provided_attestation.v1.0.0.schema.yaml)


## Pseudo code 

```
FUNCTION ai_system_providers_trusted_with_blacklist(AI_System_ID, Blacklist_Emails)
    // Step 1: Retrieve provider UUIDs associated with the AI system
    SET Provider_UUIDs = get list of providers contributing data to AI_System_ID

    // Step 2: Retrieve provider email addresses
    SET Provider_Emails = map provider UUIDs to their identity email addresses

    // Step 3: Check if any provider email appears in the blacklist
    SET Matches = intersection of Provider_Emails and Blacklist_Emails

    // If there are no matches, the AI system providers are trusted
    IF Matches is empty THEN
        RETURN True
    ELSE
        RETURN False
END FUNCTION

```

### **Explanation of the Full Functionality**
1. **Find relevant data sources**:  
   - Retrieve the **configuration verification credential** (`ConfigVcId`) for the AI system.  
   - Extract the **weights verification credential** (`WeightsVcId`) used in training.  
   - Ensure that the `WeightsVcId` is classified as `"Weights"`.  
   - Trace back to the **training system** that produced these weights.  
   - Identify the **datapack** used in the training process.  

2. **Extract the list of Data Verification Credentials (`DataVcIds`)** used in training from the datapack.  

3. **Determine the providers** who contributed this data:  
   - For each `DataVcId`, check its **attestations** and extract provider UUIDs where the attestation type is `"provided"`.  

4. **Map provider UUIDs to their email identities**.  

5. **Check if any provider's email appears in the blacklist**.  

6. **Return `True` only if there are no blacklisted providers** (i.e., intersection is empty).  


## Query

- `ai_system_providers_trusted_with_blacklist(AiSystemId, Blacklist)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L201-L204)
- link to simulator 
