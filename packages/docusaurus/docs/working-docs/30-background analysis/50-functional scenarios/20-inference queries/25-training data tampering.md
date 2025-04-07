## Query use case

Has the training data my AI system was trained on (by the training AI system) been tampered with?



## Schemas used

* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [config](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/25-config.v1.0.0.schema.yaml)
* [data pack](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/20-data-pack.v1.0.0.schema.yaml)
* [data](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/10-data.v1.0.0.schema.yaml)


## Pseudo code 

```plaintext
FUNCTION training_code_hash_matches(Inference_ID, Submitted_Hash)
    // Retrieve the configuration ID from the inference system's data.
    SET Config_ID = get configuration ID from Inference_ID

    // Retrieve the training system ID using the trained system configuration linked to the Config_ID.
    SET Training_System_ID = get training system ID from trained system configs for Config_ID

    // Retrieve the code details for the training system.
    SET (Ignored_Hash, Code_ID) = get code details of Training_System_ID

    // Retrieve the stored code hash for the training system using the Code_ID.
    SET Stored_Code_Hash = get code hash from code record for Code_ID

    // Compare the stored code hash with the submitted hash.
    IF Stored_Code_Hash equals Submitted_Hash THEN
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
   - It then uses the Config_ID to retrieve the training system identifier (Training_System_ID) from the trained system configurations.

3. **Retrieve Training System Code Details:**  
   - The function obtains the code details for the training system, which provides a Code ID.

4. **Retrieve Stored Code Hash:**  
   - Using the Code ID, it fetches the stored code hash from the code record.

5. **Hash Comparison:**  
   - The stored code hash is compared with the Submitted Hash.
   - If they match, the function returns `True`; otherwise, it returns `False`.


## Query

- `db:submitted_training_data_matches(AiSystemId, HashesArray)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L265-L268)
- link to simulator 





## Notes

The relationships between entities in the AI system supply chain are shown in the below diagram, with the inference AI system and hash being checking for tampering highlighted in red.

![alt text](<25_inference data tampering.drawio.png>)