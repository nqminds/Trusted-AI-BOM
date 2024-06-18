---
title: TAIBOM Project
---

# Trusted AI Bill of Materials

TAIBOM (Trusted AI Bill of Materials) addresses two fundamental challenges that impact the development and deployment of trustworthy AI s:stems.
- Ver -ioning: How do we refer to an AI system in a stable way? How do we produce an AI inventitspendent components? How can weseinventory rences to make statementstheabout a system’s trustworthiness or its legal standing; and
- Atte -tations: How do we make attestations of trustworthiness abo systemut an AI. Whe attestationse claims arthe system'sut bias,  oreg legal con constraits on its application, rtions: how do attestations  claims in an interoperable way? How can we aattestations about the whole system from attestations about its partsonality)? How do we reason about or vattestations whilst considering theoring in conthe system's text of our own subjective requirementsectTAIBOM is motivated by the recent increase in the composability within and between AI systems, particularly in the form or open source models, open datasets, open source adaptors and open weights. This trend of increasing composability mirrors what has already happened in traditional software development, where open source has allowed for the creation of software that is built from components from a multitude of sources that are outside of the direct control of the software developer. Since each such component is typically created from a multitude of other components, it became almost impossible for the developer of a software system to be completely confident in its properties and characteristics. To solve this problem, Software Bill of Materials (SBOM). SBOM allows a software developer to easily identify the components of their software system and hence to identify problems such as security vulnerabilities and unacceptable licences.

Most early AI systems, and many modern application-specific AI systems, are produced by a single organization using their own data, their own models and a limited set of well-specified tools. Some modern AI systems, however, are more like modern software systems, being composed of a multitude of AI components from a multitude of sources that are not under the system developer's direct control. This motivates the introduction of TAIBOM. TAIBOM allows an AI system developer to easily identify the components of their AI system and hence to have confidence in its properties and characteristics.in general.

## Versioning
AI systems are highly volatile; a change of a single training parameter, a poisoned training data set or an insecure training or deployment machine can change the behaviour of an AI system enormously. A trustworthy system becomes untrustworthy in an almost imperceptible manner.
The versioning problem is one of compositionality and dependency: how to describe a complex system in terms of its component parts and how to track the inherent dependencies. 

An AI system is essentially a highly complex software system. It inherits the complexity of software system management. But this problem is made worse by the fact that the AI system behaviour is further determined by up to 1 trillion parameters (e.g. ChatGPT 4). The state of the art for "trustworthy software" development is the SBOM - Software Bill or Materials, recently enacted into US and EU law. SBOMs provide the tools to describe the complex dependencies of software components; but has not been designed for AI. TAIBOM builds on this work. CISA itself [1] has stated that this is essential work to progress. It will take current industry best practice (CycloneDX/SPDX) and adapt and extend this work to make it fit for purpose to describe the full complexity of an AI system. This work will explicitly manifest the dependencies on training data, training algorithm, validation data and training and deployment machines?

To describe and manage the trustworthiness attributes of the system, we first need the language to describe a stable AI system. (What is it we are talking about?)
AI Adoption: AI component developers, AI system assemblers, AI training data providers, AI system integrators and AI system users will have the tools to deterministically describe the AI component and assembled AI. Without this innovation, it is almost impossible to make any stable, reliable claim about any facet of an AI system.

## Attestation
Many organisations (e.g. Turing Institute, NIST, EU, Microsoft and Google) are defining process or metrics to define trustworthiness and the distinct parameters envisioned (e.g. Microsoft's version: fairness, reliability/safety, privacy/security, inclusiveness, transparency and accountability). Most of these approaches neglect two important facts: a) the statements are inherently biased by the organisation making the statement; and b) the interpretation of the claim is inherently subjective.

Even when we consider basic system (non-AI) trustworthiness, it is clear that subjectivity is an integral part of the evaluation. Take a telecom system example: Does "China Mobile" trust Huawei telecommunication software? Does Vodafone trust Cisco telecommunication software? But does Vodafone trust Huawei kit and does China mobile trust Cisco kit?

The foundational work for this approach is in W3C Verifiable Credentials [2]. This work will be extended and refined to make distributed claims about AI system components.

AI Adoption: this innovation will provide the tools for AI stakeholders, from the original developer through to independent test agencies, auditors and legislators to make qualified statements about a systems trustworthiness, across multiple dimensions of trustworthiness. Each of these statements will be fully interoperable, will be explicit about both subject and claimant, will have the ability to express context (what is it being used for) and can be evaluated subjectively, depending on the trust foundation of the assessor.

TAIBOM creates a standardised ecosystem for describing the nuanced composition of AI systems (versioning) and making contextualised but precise claims about the trustworthiness (attestations) of the system, and its components.

Our approach is dual strand:
- Develop the commercial tools for managing AI system lifecycle
- Develop/refine the interoperable, international, standards that ensure this technology is