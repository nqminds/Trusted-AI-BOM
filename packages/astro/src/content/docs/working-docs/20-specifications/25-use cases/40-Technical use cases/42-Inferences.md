---
title: a
---
## Using Inferences Performed by a Third Party AI System

A business is integrating with an API-based AI service that is provided by a third party. The service searches the internet to provide answers to a user's questions. Before signing up to the service, the business downloads a TAIBOM that provides information about the underlying model, its training data and the data sources it can access during inference. Additionally, every inference API response is associated with a supplemental TAIBOM that provides the URIs of the websites that were used in the specific inference.

A search for attestations relating to the model reveals that it is vulnerable to a variety of prompt hijacking attacks, training data extraction attacks and prompt extraction attacks. The business decides to proceed with the service despite the attestations, but, for each inference, looks up the URIs in the supplemental TAIBOM to find attestations as to whether the pages represent a threat to the model and, if so, the result of the inference is subjected to automatic inspection.