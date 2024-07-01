# Trusted AI Bill of Materials

TAIBOM (Trusted AI Bill of Materials, formerly T-CHAIN) addresses two fundamental challenges in the development and deployment of trustworthy AI systems:

- System dentification - How do we refer to an AI system in a stable and repeatable way? How do we produce an inventory of an AI system's dependencies? How do we relate the versioning of an AI system to the versioning of its dependencies? and

- Attestation - How do we make attestations about the properties of an AI system? How do we make attestations about its behaviour or legal status? How do attestations for the system relate to attestations for its dependencies? How do we make attestations in a flexible and interoperable way? How do we reason about attestations in the context of a system's intended use and our own preferences?

TAIBOM is motivated by the recent increase in the composability within and between AI systems, particularly in the form of open source models, open adaptors, open datasets and open weights. This trend of increasing composability mirrors what has already happened in traditional software development, where open source code allowed for the creation of software that was built from dependencies from a multitude of sources that were outside of the direct control of the software system developer.

Because each such dependency is typically created from a multitude of others, it became almost impossible for the developer of a software system to understand its properties or the effect of any particular dependency. To solve this problem, Software Bill of Materials (SBOM) was introduced. SBOM makes it easy for the developer of a software system to identify all of its dependencies and to understand how they affect the properties of the system as a whole. In particular, it makes it possible to quickly identify known security vulnerabilities and unacceptable licences. The US and EU recently passed legislation relating to SBOMs in an attempt to improve the security of domestically deployed software and firmware, but SBOM still has little to say about AI, something that CISA [1] has highlighted as being essential to fix.

Most early AI systems, and many modern application-specific AI systems, are produced by single organizations using their own data, their own models and a limited set of well-specified tools. Some modern AI systems, however, are more like modern software systems, being composed of a multitude of AI-related dependencies and trained on a multitude of datasets from a multitude of sources, none of which are under the system developer's direct control. This motivates the introduction of TAIBOM, which is the equivalent of SBOM, but for AI. TAIBOM allows the developer of an AI system to easily identify its AI-related dependencies and hence for both the developer of the system and its users to more fully understand its properties.

The minimum requirements for TAIBOM are that it must provide means for identified parties to make attestations about identified AI systems.


## System Identification

In order for TAIBOM to work, it is necessary to be able to identify the specific AI system to which an attestation applies.

There are at least two important capabilities in this respect: TAIBOM must be able to distinguish between AI systems with different inference behaviours; and, if TAIBOM is to represent the legal status of an AI system, it must be able to distinguish between AI systems with different legal statuses.

The inference behaviour of an AI system is important because almost everything except the system's legal status relates to its inference behaviour: its performance; its security status; its reliability; etc. Depending on the type of the AI system, its behaviour is potentially influenced by a wide range of factors including, but not limited to: it's training data; the training algorithm; the code used for training; the inference algorithm; the code used for inference; the weights used for inference; its training and inference configurations; adaptors used during inference; and data used during inference. Where an AI system has AI-related dependencies, its behaviour is also likely to be influenced by each of those factors for each dependency, making TAIBOM compositional.

The legal status of an AI system is important because AI-related licences often restrict use, such as prohibiting military or commercial applications; and dependency providers may offer indemnifications, such as against claims for copyright infringement. It is possible that the legal status of a dependency within an AI system will vary depending on how it was obtained or based on other commercial arrangements and hence might not be determinable from a technical analysis of the dependency itself. This needs to be accounted for within TAIBOM.

TAIBOM's approach to identification is to focus on information about the essential attributes of the system or component to which an attestation applies. If, for example, an attestation applies to the combination of a particular set of weights and a particular inference algorithm, a hash of the weights and information about the inference algorithm form the identifier; if an attestation applies to particular inference code within a particular version of a particular framework, a hash of the inference code and the version of the framework form the identifier. This allows individual attestations to apply to sets of systems or components.

[detail to explain later, allow more complex logic, e.g. version 2.1.2 except where ...]


## Attestation

Many organisations, such as the Turing Institute, NIST, the EU, Microsoft and Google are defining metrics that relate to the trustworthiness of AI systems, but different organisations tend to have different measures. For example, Microsoft uses fairness, reliability, safety, privacy, security, inclusiveness, transparency and accountability. An attestation allows a party to make a claim about a system and hence the attestations need to be flexible enough to support the range of claims that might need to be made. 

Since attestations might communicate sensitive claims, such as those relating to security, they need to be unforgeable and unmodifiable so that they cannot be tampered with. This also makes it possible for the consumer of an attestation to modulate their trust based on the attestation's source: an attestation relating to an AI service, for example, might be trusted less if it originates from the service provider than if it originates from a reputable independent test house. We use verifiable credentials to express attestations because they provide strong security guarantees and are a mature W3C standard.