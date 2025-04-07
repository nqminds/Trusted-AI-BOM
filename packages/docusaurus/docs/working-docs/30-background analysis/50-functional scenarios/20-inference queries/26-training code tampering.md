## Query use case

Has the training code used for the training AI system which was used to train my inference AI system been tampered with?



## Schemas used

* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [config](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/25-config.v1.0.0.schema.yaml)
* [code](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/40-code.v1.0.1.schema.yaml)



## Pseudo code 

```plaintext
FUNCTION training_code_sbom_hash_matches(Inference_ID, Submitted_SBOM_Hash)
    // Retrieve the configuration ID from the inference system's data.
    SET Config_ID = get configuration ID from Inference_ID

    // Retrieve the training system ID using the trained system configuration linked to the Config_ID.
    SET Training_System_ID = get training system ID from trained system configs for Config_ID

    // Retrieve the code details for the training system.
    SET (Ignored_Value, Code_ID) = get code details of Training_System_ID

    // Retrieve the stored SBOM hash from the code record for the training system.
    SET Stored_SBOM_Hash = get SBOM hash from code record for Code_ID

    // Compare the stored SBOM hash with the submitted SBOM hash.
    IF Stored_SBOM_Hash equals Submitted_SBOM_Hash THEN
        RETURN True
    ELSE
        RETURN False
END FUNCTION
```

---

### **Explanation**

1. **Retrieve Inference System Data Details:**  
   - The function extracts the configuration identifier (Config_ID) from the inference system’s data record.

2. **Extract Training System ID:**  
   - It then retrieves the training system identifier (Training_System_ID) from the trained system configurations using the Config_ID.

3. **Retrieve Training System Code Details:**  
   - The function obtains the code details for the training system, which includes the Code ID.

4. **Retrieve Stored SBOM Hash:**  
   - Using the Code ID, it fetches the stored SBOM hash from the corresponding code record.

5. **SBOM Hash Comparison:**  
   - The function compares the stored SBOM hash with the Submitted SBOM Hash.
   - If they match, it returns `True`; otherwise, it returns `False`.

## Query

- `db:training_code_hash_matches(AiSystemId, Hash)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L255C21-L255C50)
- link to simulator 




## Notes

The relationships between entities in the AI system supply chain are shown in the below diagram, with the inference AI system and hash being checking for tampering highlighted in red.

![alt text](<26_training code tampering.drawio.png>)