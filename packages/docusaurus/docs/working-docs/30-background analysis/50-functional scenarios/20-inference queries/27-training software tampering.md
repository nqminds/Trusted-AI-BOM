## Query use case

Has the software (SBOM) used by the training code used for the training AI system which was used to train my inference AI system been tampered with?


## Schemas used

* [ai system](https://taibom.org/schemas/ai-system/v1.0.0/AI%20System/)
* [config](https://taibom.org/schemas/config/v1.0.0/Trained%20System%20Configs/)
* [code](https://taibom.org/schemas/code/v1.0.1/Code/)
* [sbom](https://taibom.org/schemas/sbom/v1.0.0/SBOM/)

## Pseudo code 

```plaintext
FUNCTION submitted_training_data_matches(Inference_ID, Submitted_Hashes)
    // Retrieve details of training data associated with the inference system.
    SET Data_Details = get training data details for Inference_ID

    // Extract the list of expected hashes from the data details.
    INITIALIZE Expected_Hashes as an empty list
    FOR EACH Data_Record in Data_Details DO
        IF Data_Record has a hash value THEN
            ADD the hash value from Data_Record TO Expected_Hashes

    // Sort both the expected and submitted hash lists.
    SET Sorted_Expected = sort(Expected_Hashes)
    SET Sorted_Submitted = sort(Submitted_Hashes)

    // Check if the sorted lists are identical.
    IF Sorted_Expected equals Sorted_Submitted THEN
        RETURN True
    ELSE
        RETURN False
END FUNCTION
```

---

### **Explanation**

1. **Retrieve Training Data Details:**  
   - The function retrieves the training data details associated with the inference system.

2. **Extract Expected Hashes:**  
   - From these details, it extracts all hash values from each training data record to form a list of expected hashes.

3. **Sort Hash Lists:**  
   - The function sorts both the list of expected hashes and the Submitted Hashes.

4. **Hash List Comparison:**  
   - It compares the sorted lists for equality.
   - If they are identical, the function returns `True`, indicating that the submitted training data matches exactly; otherwise, it returns `False`.


## Query

- `db:training_code_sbom_hash_matches(AiSystemId, Hash)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L257-L260)
- link to simulator 



## Notes

The relationships between entities in the AI system supply chain are shown in the below diagram, with the inference AI system and hash being checking for tampering highlighted in red.

![alt text](<27_training software tampering.drawio.png>)