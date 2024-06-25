## Downloading an AI Model from a Repository

A business is developing software that integrates a pretrained AI model for recognising road signs. Domain-specific regulations require third party assessments of the robustness of the model to adversarial modification of road signs in the wild and internal cybersecurity teams require information about known vulnerabilities in the model and software assets associated with performing inference using the model.

The download of the model from the provider includes a TAIBOM with a hash of the model weights, a hash of the inference code and information about the training data, which is composed of multiple datasets.

After download, the downloaded weights and inference code are hashed by a TAIBOM client and compared to the respective hashes in the downloaded TAIBOM, confirming that the TAIBOM relates to the downloaded assets. The TAIBOM client searches for attestations relating to the TAIBOM according to the requirements of the downloader.

The search reveals attestations by a third party that the combinations of the downloaded weights and inference code meet the regulator's requirements, but also an attestation that one of the components of the training dataset is known to be poisoned. The business decides to 