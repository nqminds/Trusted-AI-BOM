**As artificial intelligence (AI) continues to permeate nearly every facet of modern life, the trustworthiness of AI systems is a critical topic of concern.**

Whether in healthcare, finance, autonomous vehicles or decision-making in government, AI systems are being used in ways that can profoundly impact human lives. It is essential then that these systems are not only functional but are trustworthy. Trustworthiness in AI encompasses a number of key issues, including transparency, fairness, accountability, robustness, and privacy but at a foundational level, it is necessary to know exactly how an AI system has been constructed, with which model, which software components, which training data and so on.	

![img](https://www.techworks.org.uk/wp-content/uploads/2024/11/Featured-Image-68-1024x576.jpg)



One of the primary challenges in trusting AI systems is the "black box" nature of many advanced machine learning systems. Much like an ingredients list, the Trustworthy AI Bill Of Materials or TAIBOM, seeks to provide clarity for users or procurers of AI systems by addressing the following challenges (following detail taken from the TAIBOM project working documents):

- Versioning - How do we refer to an AI system in a stable and repeatable way? How do we produce an inventory of an AI system's dependencies? How do we relate the versioning of an AI system to the versioning of its dependencies?
- Attestation - How do we make attestations about the properties of an AI system? How do we make attestations about its behaviour or legal status? How do attestations for the system relate to attestations for its dependencies? How do we make attestations in a flexible and interoperable way? How do we reason about attestations in the context of a system's intended use and our own preferences?

TAIBOM's approach to identification is to focus on information about the essential attributes of the system or component to which an attestation applies. If, for example, an attestation applies to the combination of a particular set of weights and a particular inference algorithm, a hash of the weights and information about the inference algorithm form the identifier; if an attestation applies to particular inference code within a particular version of a particular framework, a hash of the inference code and the version of the framework form the identifier. This allows individual attestations to apply to sets of systems or components.



![img](https://www.techworks.org.uk/wp-content/uploads/2024/11/Featured-Image-67-1024x576.jpg)



 1st November 2024 | AI-TAIBOM

![img](https://www.techworks.org.uk/wp-content/uploads/2024/11/Featured-Image-66.jpg)

[Twitter](https://www.techworks.org.uk/#twitter)[Email](https://www.techworks.org.uk/#email)[LinkedIn](https://www.techworks.org.uk/#linkedin)[Share](https://www.addtoany.com/share#url=https%3A%2F%2Fwww.techworks.org.uk%2Fai-taibom%2Fwhats-in-the-box-trustworthiness-in-ai&title=What’s in the box%3F Trustworthiness in AI)

As artificial intelligence (AI) continues to permeate nearly every facet of modern life, the trustworthiness of AI systems is a critical topic of concern.

Whether in healthcare, finance, autonomous vehicles or decision-making in government, AI systems are being used in ways that can profoundly impact human lives. It is essential then that these systems are not only functional but are trustworthy. Trustworthiness in AI encompasses a number of key issues, including transparency, fairness, accountability, robustness, and privacy but at a foundational level, it is necessary to know exactly how an AI system has been constructed, with which model, which software components, which training data and so on.

![Featured Image (68)](https://www.techworks.org.uk/wp-content/uploads/2024/11/Featured-Image-68-1024x576.jpg)

One of the primary challenges in trusting AI systems is the "black box" nature of many advanced machine learning systems. Much like an ingredients list, the Trustworthy AI Bill Of Materials or TAIBOM, seeks to provide clarity for users or procurers of AI systems by addressing the following challenges (following detail taken from the TAIBOM project working documents):

- Versioning - How do we refer to an AI system in a stable and repeatable way? How do we produce an inventory of an AI system's dependencies? How do we relate the versioning of an AI system to the versioning of its dependencies?
- Attestation - How do we make attestations about the properties of an AI system? How do we make attestations about its behaviour or legal status? How do attestations for the system relate to attestations for its dependencies? How do we make attestations in a flexible and interoperable way? How do we reason about attestations in the context of a system's intended use and our own preferences?

TAIBOM's approach to identification is to focus on information about the essential attributes of the system or component to which an attestation applies. If, for example, an attestation applies to the combination of a particular set of weights and a particular inference algorithm, a hash of the weights and information about the inference algorithm form the identifier; if an attestation applies to particular inference code within a particular version of a particular framework, a hash of the inference code and the version of the framework form the identifier. This allows individual attestations to apply to sets of systems or components.

![Featured Image (67)](https://www.techworks.org.uk/wp-content/uploads/2024/11/Featured-Image-67-1024x576.jpg)

Since attestations might communicate sensitive claims, such as those relating to security, they need to be unforgeable and unmodifiable so that they cannot be tampered with. This also makes it possible for the consumer of an attestation to modulate their trust based on the attestation's source: an attestation relating to an AI service, for example, might be trusted less if it originates from the service provider than if it originates from a reputable independent test house. We use verifiable credentials to express attestations because they provide strong security guarantees and are a mature W3C standard.

Anyone using an ensemble of AI systems will benefit from an automated process that can create a dynamic inventory of the working system(s). If this process can determine provenance, dependencies and third-party attestations, so much the better. There are many use cases for this:

- License validation
- Security assessment
- Data flow validation
- Regulatory compliance
- Other risk management

TAIBOM attestations communicate claims about the properties of an identifiable entity or set of entities and need to be flexible with regards to what is identified and the means by which it is identified. This is because different parties will be interested in making, or searching for, claims about the properties of different sets of entities.



![img](https://www.techworks.org.uk/wp-content/uploads/2024/11/Featured-Image-69-1024x576.jpg)



- For example, a TAIBOM claim might assert that:

- a particular dataset is poisoned in a particular way

- a particular dataset is composed from other particular datasets

- particular inference code on a particular framework on a particular platform has a vulnerability

- particular inference code and weights applied to a particular dataset achieve a particular level of performance on a particular benchmark

- a particular set of weights was generated using particular training code, a particular training configuration and a particular mix of datasets

- particular training code implements a particular training algorithm

- a particular webpage contains a prompt injection attack

- a set of weights was downloaded from a particular source

- a set of weights were produced by a particular company

- a set of weights are associated with particular terms of use
   an inference was obtained from a particular service provider

- a particular service provider provides a particular indemnification

  To find out more about the TAIBOM project, please contact

   [gareth.richards@techworks.org.uk](mailto:gareth.richards@techworks.org.uk) or join our working group here / register your interest here 

  [AI - TechWorks](https://www.techworks.org.uk/ai#el-c655c98d)