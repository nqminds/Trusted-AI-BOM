---
title: TAIBOM Implementation 
---

TAIBOM is technically built on top of W3C verifiable credentials. These are essentially distributed digital certificates, with stronger semantics and extensibility properties.  

TAIBOM allows us to describe three things

* **AI building blocks**: these are the atomic, cryptographically verifiable components from which AI systems are build - specifically 
  * code: a hash of the physical code used to build or run the AI system 
  * data: a hash of a data set. This can be the data on which the AI systems is build, but the weight/configuration data is also a large verifiable data set. 
* **AI dependencies **: these claims describe critical relationships between AI components and AI systems. Examples of these relationships are:
  * aggregation: for example multiple individual (verifiable) data sets can eb combined into a larger training data set.
  * composition: we may describe a high level AI components from individual building blocks. For example  a local AI inference system is described as a combination of the software (hash) and the trained weights 
  * dependency: AI system can describe there logical and conceptual dependency on other components. For example trained weights are dependent on the SBOM of the training software and also the training data. 
* **AI attestations**: finally when we have a robust description of an AI system and its dependencies we can start to annotate the full systems or the components with critical attributes. TAIBOM attestation are designed to be infinitely extensible, but some common examples are 
  * SBOM: the software dependency description can be added to inference or training code 
  * CVE analysis: and analysis of vulnerabilities can also be tied to the code
  * Software license: the software can be annotated with the software license under which it was published.
  * Data curation process: the data can be annotated with a description of the process used to curate the data  
  * Data origin: the data can be annotated with a description of the owner or originator of the data
  * Data license: the data can be annotated with the license under which it is published 
  * Data analysis: the data can be annotated with i.e. the human or AI analysis of critical security properties e.g. bias, poisoning etc 
  * Performance metrics: the inference system can be annotated with its performance metrics as tested at point of release
  * Process adherence: any facet of the AI system (full systems or components) can be annotated with the digitally signed evidence of conformance against any process or empirical test 



## Inferencing

TAIBOM provides  cryptographically verifiable fully distributed descriptions of complex AI systems.

When we have access to all of the descriptors we can reason about the security, performance and licensing properties of the whole system.

It allows us to write queries that can answer critical question like:

* can I see the licenses of all the data on which my system was trained
* are three any known (current or historical) software vulnerabilities present on the training system on which my system is trained.
* I have discovered that some critical common training data has been compromised (intentionally poisoned); can i determine which deployed systems are impacted 



A full list of use case  can be found  here.     



