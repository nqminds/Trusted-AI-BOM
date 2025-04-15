## Query use case

For this inference system provide me a list of all training data sets.


## Schemas used

* [data](https://taibom.org/schemas/data/v1.0.0/TAIBOM%20Data/)
* [data pack](https://taibom.org/schemas/data-pack/v1.0.0/TAIBOM%20Datapack/)
* [config](https://taibom.org/schemas/config/v1.0.0/Trained%20System%20Configs/) 
* [ai system](https://taibom.org/schemas/ai-system/v1.0.0/AI%20System/)



## Pseudo code 

```plaintext
FUNCTION data_in_inferencing_system(Data_VC_IDs, Inferencing_System_VC_ID)

    // Step 1: Retrieve configuration VC from the inferencing AI system
    SET Config_VC_ID = get configuration VC of Inferencing_System_VC_ID
                       where system type is "Inferencing"

    // Step 2: Retrieve the weights VC from the trained system configs
    SET Weights_VC_ID = get weights VC linked to Config_VC_ID

    // Step 3: Verify the type of the VC is "Weights"
    IF get type of Weights_VC_ID IS NOT "Weights" THEN
        RETURN empty list

    // Step 4: Retrieve data verification credentials from the weights VC
    SET Data_VC_IDs = data_in_weight(Weights_VC_ID)

    RETURN Data_VC_IDs

END FUNCTION
```

---

### **Explanation**

1. **Retrieve Configuration VC from Inferencing System:**  
   - The function starts by accessing the inferencing AI system’s structure using its verification credential (`Inferencing_System_VC_ID`).  
   - It extracts the associated configuration VC (`Config_VC_ID`), confirming that the AI system is of type `"Inferencing"`.

2. **Get Weights VC from Training Configuration:**  
   - It then fetches the trained system configuration tied to the configuration VC.  
   - From that, it retrieves the VC for the weights component (`Weights_VC_ID`).

3. **Validate VC Type:**  
   - The function checks that the retrieved weights VC is explicitly marked as type `"Weights"` to ensure correct linkage.

4. **Retrieve Underlying Data VCs:**  
   - Finally, it delegates to `data_in_weight/2` to obtain all the dataset verification credentials (`Data_VC_IDs`) that were used to produce those weights.

## Query

- `db:data_in_inferencing_system(DataVcIds, AiSystemId)` [link to query](https://github.com/nqminds/Trusted-AI-BOM/blob/main/packages/claim_cascade_batteries/taibom-battery/scenarios.json#L217-L220)
- link to simulator 


## Notes

