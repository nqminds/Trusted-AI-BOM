## Query use case

Are their any known vulnerabilities on the inference code software I am using?



## Schemas used

* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [code](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/40-code.v1.0.1.schema.yaml)
* [sbom](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/62-sbom.v1.0.0.schema.yaml)
* [vulnerability attestation](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/63-vulnerability-attestation.v1.0.0.schema.yaml)


## Pseudo code 

```plaintext
FUNCTION ai_system_inference_software_vulnerabilities(AI_System_ID)
    CREATE empty list Vulnerabilities

    // Step 1: Get the Code ID for the given AI system
    SET Code_ID = get code ID from AI_System_ID

    // Step 2: Retrieve the SBOM ID from the code record
    SET SBOM_ID = get SBOM ID from Code_ID

    // Step 3: Find vulnerability attestations for this SBOM component
    FOR EACH Attestation in database DO
        IF Attestation is linked to component(_, SBOM_ID) AND
           Attestation is of type vulnerability_attestation THEN
            ADD Attestation TO Vulnerabilities

    // Step 4: Return the list of found vulnerabilities
    RETURN Vulnerabilities
END FUNCTION
```

---

### **Explanation**

1. **Retrieve AI System Code Details:**  
   - The function begins by extracting the code information for the AI system using its identifier. This gives us the unique Code ID.

2. **Extract SBOM Identifier:**  
   - Using the Code ID, the function fetches the corresponding Software Bill of Materials (SBOM) identifier from the code record.

3. **Search for Vulnerability Attestations:**  
   - The function scans all known attestations in the system.
   - It selects those that are marked as `vulnerability_attestation` and are associated with a component that references the extracted SBOM ID.

4. **Return Collected Vulnerabilities:**  
   - All matching vulnerability attestations are collected into a list.
   - The function returns this list, which represents known vulnerabilities affecting the inference software of the specified AI system.


## Query

- `db:ai_system_inference_software_vulnerabilities(AiSystemId, Vulnerabilities)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L273-L276)
- link to simulator 





## Notes

