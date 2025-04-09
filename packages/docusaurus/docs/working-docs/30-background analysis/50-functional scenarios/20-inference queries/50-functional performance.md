## Query use case

Has the system passed a functional test to the desired threshold level?


## Schemas used

* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [functional performance attestation](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/69-functional-performance-attestation.v1.0.0.schema.yaml)


## Pseudo code 

```plaintext
FUNCTION ai_system_functional_performance(AI_System_ID)

    CREATE empty list Attestations

    // Step 1: Search for all functional performance attestations
    FOR EACH record IN database DO
        IF record is of the form functional_performance_attestation(_, Attestation, component(_, AI_System_ID)) THEN
            ADD (Attestation, AI_System_ID) TO Attestations

    // Step 2: Return all collected attestations
    RETURN Attestations

END FUNCTION
```

---

### 📘 **Explanation**

1. **Search for Functional Performance Attestations:**  
   - The function queries the knowledge base for all `functional_performance_attestation` facts where the attested component corresponds to the specified `AI_System_ID`.

2. **Collect Attestations:**  
   - For each matching record, it collects a tuple `(Attestation, AI_System_ID)` into a list named `Attestations`.

3. **Return Result:**  
   - The resulting list contains all known functional performance attestations associated with the AI system, which is returned for further evaluation or reporting.


## Query

- `ai_system_functional_performance(AiSystemId, Attestations)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L293-L296)
- link to simulator 



## Notes

