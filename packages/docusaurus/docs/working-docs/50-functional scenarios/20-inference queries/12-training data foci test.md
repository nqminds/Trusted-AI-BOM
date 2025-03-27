## Query use case

Do we trust the providers/origin of all training data used - using exception list


## Schemas used

* [data](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/10-data.v1.0.0.schema.yaml)
* [data pack](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/20-data-pack.v1.0.0.schema.yaml)
* [config](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/25-config.v1.0.0.schema.yaml) 
* [identity](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/5-identity.v1.0.0.schema.yaml)
* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [provided attestation](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/schemas/src/taibom-schemas/64-provided_attestation.v1.0.0.schema.yaml)


## Pseudo code 

```python
def ai_system_providers_trusted_with_blacklist(AISystemId, BlacklistEmails):
    # Step 1: Find all Data Verification Credentials (DataVcIds) linked to the AI System
    ConfigVcId = db_get_ai_system(AISystemId).config_vc_id
    WeightsVcId = get_trained_weights(ConfigVcId)

    if not is_weights_data(WeightsVcId):
        return False  # Ensure WeightsVcId is valid

    TrainingSystemVcId = get_training_system_for_weights(WeightsVcId)
    DatapackVcId = get_datapack_for_training_system(TrainingSystemVcId)

    # Step 2: Extract all dataset verification credentials (DataVcIds) from the datapack
    DataVcIds = extract_data_vcs_from_datapack(DatapackVcId)

    # Step 3: Identify the providers of each DataVcId
    ProviderUUIDs = set()
    for DataVcId in DataVcIds:
        attestations = get_attestations_for_data(DataVcId)
        for attestation in attestations:
            if attestation.type == "provided":
                ProviderUUIDs.add(attestation.provider_uuid)

    # Step 4: Convert Provider UUIDs to Emails
    ProviderEmails = {get_provider_email(uuid) for uuid in ProviderUUIDs}

    # Step 5: Check if any provider email is in the blacklist
    Matches = ProviderEmails.intersection(set(BlacklistEmails))

    # Step 6: Return True if there are no matches (i.e., no blacklisted providers)
    return len(Matches) == 0
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

- `ai_system_providers_trusted_with_blacklist(AiSystemId, Blacklist)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/training-data-provenance/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L201-L204)
- link to simulator 
