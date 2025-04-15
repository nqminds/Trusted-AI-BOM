## Query use case

Has the inference code used for my inference AI system been tampered with?



## Schemas used

* [ai system](https://taibom.org/schemas/ai-system/v1.0.0/AI%20System/)
* [code](https://taibom.org/schemas/code/v1.0.1/Code/)



## Pseudo code 

```plaintext
FUNCTION ai_system_code_hash_matches(AI_System_ID, Submitted_Hash)
    // Retrieve the AI system's code information, including the verification credential hash and Code ID
    SET (HashOfVC, Code_ID) = get code information of AI_System_ID

    // Retrieve the stored hash associated with the Code ID
    SET Stored_Hash = get stored code hash for Code_ID

    // Compare the stored hash with the submitted hash
    IF Stored_Hash equals Submitted_Hash THEN
        RETURN True
    ELSE
        RETURN False
END FUNCTION
```

---

### **Explanation**

1. **Retrieve AI System Code Details:**  
   - The function first extracts the code details from the AI system using its identifier (`AI_System_ID`). This includes a verification credential (`HashOfVC`) and a unique code identifier (`Code_ID`).

2. **Retrieve Stored Code Hash:**  
   - Using the `Code_ID`, the function fetches the stored hash (`Stored_Hash`) that represents the actual code's fingerprint.

3. **Hash Comparison:**  
   - The function then compares the `Stored_Hash` with the `Submitted_Hash` provided as input.
   - If they match, it returns `True`, indicating that the code hash for the AI system is valid.
   - Otherwise, it returns `False`.



## Query

- `db:ai_system_code_hash_matches(AiSystemId, Hash)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L233-L236)
- link to simulator 





## Notes

The relationships between entities in the AI system supply chain are shown in the below diagram, with the inference AI system and hash being checking for tampering highlighted in red.

![alt text](<20-inference code tampering.drawio.png>)