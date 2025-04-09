## Query use case

Are their any known vulnerabilities on the training code software that was used?



## Schemas used

* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [config](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/25-config.v1.0.0.schema.yaml)
* [code](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/40-code.v1.0.1.schema.yaml)
* [sbom](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/30-sbom.v1.0.0.schema.yaml)
* [vulnerability attestation](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/63-vulnerability-attestation.v1.0.0.schema.yaml)



## Pseudo code 

```plaintext
FUNCTION ai_system_training_software_vulnerabilities(AI_System_ID)
    CREATE empty list Vulnerabilities

    // Step 1: Retrieve the Config ID from the AI system's data
    SET Config_ID = get configuration ID from AI_System_ID

    // Step 2: Use the Config ID to find the training system's ID
    SET Training_System_ID = get training AI system linked to Config_ID

    // Step 3: Retrieve the Code ID from the training AI system
    SET Code_ID = get code ID from Training_System_ID

    // Step 4: Retrieve the SBOM ID from the code record
    SET SBOM_ID = get SBOM ID from Code_ID

    // Step 5: Find all vulnerability attestations linked to this SBOM
    FOR EACH Attestation in database DO
        IF Attestation is linked to component(_, SBOM_ID) AND
           Attestation is of type vulnerability_attestation THEN
            ADD Attestation TO Vulnerabilities

    // Step 6: Return the list of vulnerabilities
    RETURN Vulnerabilities
END FUNCTION
```

---

### **Explanation**

1. **Extract Configuration from AI System:**  
   - The function begins by retrieving the configuration identifier (`Config_ID`) from the specified AI system's training data.

2. **Identify Training AI System:**  
   - Using the `Config_ID`, the function finds the associated training AI system. This is the system used to generate the model or perform training.

3. **Retrieve Code Identifier of Training System:**  
   - It then extracts the `Code_ID` associated with the training AI system, which contains software-related metadata.

4. **Fetch SBOM Identifier:**  
   - The Software Bill of Materials (SBOM) identifier is retrieved from the code record of the training system.

5. **Find Matching Vulnerability Attestations:**  
   - The function searches for attestations that reference the extracted SBOM component and are of the type `vulnerability_attestation`.

6. **Return the Results:**  
   - All valid vulnerability attestations related to the training system’s software are compiled and returned.



## Query

- `db:ai_system_training_software_vulnerabilities(AiSystemId, Vulnerabilities)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L277-L280)
- link to simulator 





## Notes

