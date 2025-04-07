## Query use case

Have the inference weights used for my AI system been tampered with?



## Schemas used

* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [config](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/25-config.v1.0.0.schema.yaml) 
* [data](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/10-data.v1.0.0.schema.yaml)


## Pseudo code 

```plaintext
FUNCTION weights_hash_matches_for_ai_system(AI_System_ID, Submitted_Hash)
    // Retrieve the configuration ID from the AI system's data details.
    SET Config_ID = get configuration ID from AI_System_ID

    // Delegate the matching process to the weights_hash_matches_for_config function.
    RETURN weights_hash_matches_for_config(Config_ID, Submitted_Hash)
END FUNCTION
```

---

### **Explanation**

1. **Extract Configuration ID:**  
   - The function retrieves the configuration identifier (Config_ID) from the AI system’s data details.

2. **Delegate to Configuration-Specific Function:**  
   - It then calls the helper function `weights_hash_matches_for_config` with the Config_ID and Submitted Hash as arguments.

3. **Retrieve Weights Verification Credential:**  
   - Inside `weights_hash_matches_for_config`, the function obtains the weights verification credential (Vc_ID) associated with the configuration.

4. **Retrieve Stored Weights Hash:**  
   - Using the Vc_ID, it fetches the stored weights hash from the taibom data.

5. **Hash Comparison:**  
   - The stored weights hash is compared with the Submitted Hash.
   - If they match, the function returns `True`; otherwise, it returns `False`.


## Query

- `db:weights_hash_matches_for_ai_system(AiSystemId, Hash)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L241-L243)
- link to simulator 





## Notes

The relationships between entities in the AI system supply chain are shown in the below diagram, with the inference AI system and hash being checking for tampering highlighted in red.

![alt text](<24_inference weights tampering.drawio.png>)