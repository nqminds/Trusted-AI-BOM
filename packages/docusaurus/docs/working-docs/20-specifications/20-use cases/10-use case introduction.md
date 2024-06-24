# Stakeholders

There are a large number of parties that may be affected by, or involved in, the development, deployment and use of AI systems or AI system components and hence who might benefit from TAIBOM. They include the following:

* Users of AI systems. These can be members of the public, governments or businesses that use products and services that involve AI. The presence of TAIBOM attestations for products and services can provide information relating to terms of use, security, privacy and performance.

* Regulators. Regulators need to have confidence that AI systems in different contexts comply with regulatory requirements. The transparency provided by TAIBOM attestations should help regulators to do that.

* Copyright holders and content owners. By providing transparency about the data used to train different systems, TAIBOM makes it easier for copyright holders to check that their content is being used appropriately.

* Corporate legal teams. TAIBOM can make it easier to see which licences apply to a system that uses AI, making it easier for corporate legal teams to understand the resulting legal exposure.

* Cybersecurity and IT security teams. TAIBOM makes it possible to see which emerging AI related security risks and vulnerabilities, such as prompt hijack attacks or data poisoning attacks, can be used against a business's AI assets.

* AI system developers. Teams developing solutions using AI systems should more easily be able to understand the strengths and weaknesses of different AI systems, including independent benchmarks and known vulnerabilities.

* Investors and venture capitalists. TAIBOM can support due diligence prior to an investment decision being made, making it easier to identify legal, technical, intellectual property and security risks arising from a business's AI assets.

* AI ethics teams, academics and political actors. By improving transparency around the properties of high profile AI systems, TAIBOM can support the work of ethics teams, academics and political actors.

* Insurance providers. Businesses that provide insurance against AI-related risks, such as copyright infringement, regulatory breaches, etc. will benefit from the trsanparency that TAIBOM provides about the properties of the systems being insured.

The stakeholders also include the following interested parties:

* Hardware developers and vendors. TAIBOM should be able to represent information about training and inference hardware and firmware.

* Software developers, and system and model builders, developers and vendors. TAIBOM should include information about the software components of an AI system, its training data and its training environment.

* Service providers. TAIBOM should include information about inference software, inference data and the inference environment.

* Providers of AI component repositories and AI component hosts and distributors. Providers of AI system or component stores or repositories should make TAIBOMs available for each AI system or component that they provide. Ideally, they should also allow user to search for AI systems and components based on the contents of their TAIBOMs.


# Use Cases

A number of use cases for TAIBOM have been outlined in brief above where they relate to specific stakeholders. In the following sections, we will describe three use cases in more detail: downloading an AI model from a repository; using inferences performed by a third party AI system; and generating an inventory of an AI system.


## Downloading an AI Model from a Repository

A business is developing software that integrates a pretrained AI model for recognising road signs. Domain-specific regulations require third party assessments of the robustness of the model to adversarial modification of road signs in the wild and internal cybersecurity teams require information about known vulnerabilities in the model and software assets associated with performing inference using the model.

The download of the model from the provider includes a TAIBOM with a hash of the model weights, a hash of the inference code and information about the training data, which is composed of multiple datasets.

After download, the downloaded weights and inference code are hashed by a TAIBOM client and compared to the respective hashes in the downloaded TAIBOM, confirming that the TAIBOM relates to the downloaded assets. The TAIBOM client searches for attestations relating to the TAIBOM according to the requirements of the downloader.

The search reveals attestations by a third party that the combinations of the downloaded weights and inference code meet the regulator's requirements, but also an attestation that one of the components of the training dataset is known to be poisoned. The business decides to search the model repository for a different model that was not trained on the poisoned data.


## Using Inferences Performed by a Third Party AI System

A business is integrating with an API-based AI service that is provided by a third party. The service searches the internet to provide answers to a user's questions. Before signing up to the service, the business downloads a TAIBOM that provides information about the underlying model, its training data and the data sources it can access during inference. Additionally, every inference API response is associated with a supplemental TAIBOM that provides the URIs of the websites that were used in the specific inference.

A search for attestations relating to the model reveals that it is vulnerable to a variety of prompt hijacking attacks, training data extraction attacks and prompt extraction attacks. The business decides to proceed with the service despite the attestations, but, for each inference, looks up the URIs in the supplemental TAIBOM to find attestations as to whether the pages represent a threat to the model and, if so, the result of the inference is subjected to automatic inspection.


## Generating an Inventory of an AI System

A business acquires a competitor and inherits AI-related software assets. The management team of teh acquiring business wants to understand the state of the assets, what their dependencies are, whether they have known vulnerabilities and what licences are involved. The business uses a TAIBOM client to scan the AI-related software assets to identify their component parts and then to search for relevant attestations.

======================================================

Some general text talking about taibom use cases




# Different AI system stakeholders



## Algorithm developers



#