## Query use case

Has the software (SBOM) used by the inference code used for my inference AI system been tampered with?




## Schemas used

* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [code](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/40-code.v1.0.1.schema.yaml)
* [sbom](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/62-sbom.v1.0.0.schema.yaml)

## Pseudo code 

```plaintext
FUNCTION ai_system_sbom_hash_matches(AI_System_ID, Submitted_Hash)
    // Retrieve the AI system's code details using its ID.
    SET (Ignored_Hash, Code_ID) = get code details of AI_System_ID

    // Retrieve the SBOM hash stored in the code record for the given Code_ID.
    SET Stored_SBOM_Hash = get SBOM hash from code record for Code_ID

    // Compare the stored SBOM hash with the submitted hash.
    IF Stored_SBOM_Hash equals Submitted_Hash THEN
        RETURN True
    ELSE
        RETURN False
END FUNCTION
```

---

### **Explanation**

1. **Retrieve AI System Code Details:**  
   - The function extracts the code details from the AI system record using its identifier, which yields the Code ID (ignoring the verification credential hash).

2. **Retrieve Stored SBOM Hash:**  
   - Using the Code ID, the function fetches the code record and retrieves the SBOM hash stored within it.

3. **SBOM Hash Comparison:**  
   - The function compares the retrieved SBOM hash with the Submitted Hash provided as input.
   - If they match, it returns `True`, indicating the SBOM hash is valid; otherwise, it returns `False`.


## Query

- `db:ai_system_sbom_hash_matches(AiSystemId, Hash)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L245-L248)
- link to simulator 





## Notes

The relationships between entities in the AI system supply chain are shown in the below diagram, with the inference AI system and hash being checking for tampering highlighted in red.

![alt text](<22_inference software tampering.drawio.png>)