## Query use case

Was best practice used in the system validation process? E.g. QA before release


## Schemas used

Links 

* [ai system](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/50-ai-system.v1.0.0.schema.yaml)
* [config](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/25-config.v1.0.0.schema.yaml)
* [data pack](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/20-data-pack.v1.0.0.schema.yaml)
* [data](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/10-data.v1.0.0.schema.yaml)
* [best practice attestation](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/schemas/src/taibom-schemas/68-best-practice-attestation.v1.0.0.schema.yaml)

## Pseudo code 

```plaintext
FUNCTION ai_system_best_practice_attestations(Inference_AI_System_ID)
    CREATE empty lists InferenceAtts, TrainingAtts, DataAtts

    // Step 1: Get the configuration ID from the inference AI system
    SET Config_ID = get configuration ID from Inference_AI_System_ID

    // Step 2: Find the training AI system using the configuration
    SET Training_AI_System_ID = get training system linked to Config_ID

    // Step 3: Retrieve the datapack ID from the training AI system
    SET Datapack_ID = get datapack ID from Training_AI_System_ID

    // Step 4: Extract all dataset IDs from the datapack
    SET Dataset_List = get dataset list from Datapack_ID
    SET Data_IDs = extract all Data_IDs from Dataset_List

    // Step 5: Collect best practice attestations for inference AI system
    FOR EACH Attestation IN database DO
        IF Attestation is for component(_, Inference_AI_System_ID) AND
           Attestation is of type best_practice_attestation THEN
            ADD (Attestation, Inference_AI_System_ID) TO InferenceAtts

    // Step 6: Collect best practice attestations for training AI system
    FOR EACH Attestation IN database DO
        IF Attestation is for component(_, Training_AI_System_ID) AND
           Attestation is of type best_practice_attestation THEN
            ADD (Attestation, Training_AI_System_ID) TO TrainingAtts

    // Step 7: Collect best practice attestations for each data ID
    FOR EACH Data_ID in Data_IDs DO
        FOR EACH Attestation IN database DO
            IF Attestation is for component(_, Data_ID) AND
               Attestation is of type best_practice_attestation THEN
                ADD (Attestation, Data_ID) TO DataAtts

    // Step 8: Return all collected attestations
    RETURN (InferenceAtts, TrainingAtts, DataAtts)
END FUNCTION
```

---

### **Explanation**

1. **Extract Configuration for Inference System:**  
   - The function begins by retrieving the `Config_ID` associated with the inference AI system. This configuration is needed to trace the training process.

2. **Determine Training AI System:**  
   - Using the `Config_ID`, it locates the training AI system (`Training_AI_System_ID`) which was used to generate or refine the inference system.

3. **Retrieve Datapack from Training System:**  
   - The training system contains a reference to a `Datapack_ID`, which holds information about the datasets used during training.

4. **Extract Dataset Identifiers:**  
   - The datapack is unpacked to retrieve all `Data_IDs` representing the individual datasets used during the training process.

5. **Find Inference System Best Practice Attestations:**  
   - It scans for all `best_practice_attestation` facts where the attested component is the inference AI system, collecting them into `InferenceAtts`.

6. **Find Training System Best Practice Attestations:**  
   - Similarly, it gathers best practice attestations related to the training AI system into `TrainingAtts`.

7. **Find Training Data Best Practice Attestations:**  
   - For each `Data_ID`, the function finds any best practice attestations linked to that dataset and stores them in `DataAtts`.

8. **Return Attestation Collections:**  
   - Finally, the function returns three lists: one for the inference system, one for the training system, and one for the training datasets.


## Query

- `db:ai_system_best_practice_attestations(AiSystemId, InferenceAttestations, TrainingAttestations, DataAttestations)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L285-L288)
- link to simulator 





## Notes


