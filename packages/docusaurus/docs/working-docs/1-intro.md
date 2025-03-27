---
slug: /
title: TAIBOM
---

# Trustable AI Bill of Materials

TAIBOM (Trustable AI Bill of Materials) addresses two fundamental challenges that impact the development and deployment of trustworthy AI systems.
- Versioning: How do we refer to an AI system in a stable way? How do we produce an AI inventory of dependent components? How can we use these references to make statements about a system’s trustworthiness or its legal standing; and
- Annotations: How do we make annotations of trustworthiness about an AI. Whether these claims are about bias, security, right through to the strong legal contractual assertions: how do we make these claims in an interoperable way? How can we assemble the claims from the dependent parts (compositionality)? How do we reason about or validate these claims, factoring in context of use and subjectivity?

TAIBOM is motivated by the recent increase in the composability within and between AI systems, particularly in the form or open source models, open adaptors, open datasets and open weights. This trend of increasing composability mirrors what has already happened in traditional software development, where open source allowed for the creation of software that was built from components from a multitude of sources that were outside of the direct control of the software system developer.

Since each such component is itself typically created from a multitude of other components, it became almost impossible for the developer of a software system to understand its properties and characteristics or the implications of including a particular component. To solve this problem, Software Bill of Materials (SBOM) was introduced. SBOM makes it easy for the developer of a software system to identify all of its components and to understand how they affect the properties and characteristics of the system as a whole. In particular, it makes it possible to quickly identify known security vulnerabilities and unacceptable licences.

Most early AI systems, and many modern application-specific AI systems, are produced by a single organization using their own data, their own models and a limited set of well-specified tools. Some modern AI systems, however, are more like modern software systems, being composed of a multitude of AI components from a multitude of sources that are not under the system developer's direct control. This motivates the introduction of TAIBOM. TAIBOM allows the developer of a complex AI system to easily identify its components and hence for both the developer of the system and its users to more fully understand its properties and characteristics.

## Versioning
AI systems are highly volatile; a change of a single training parameter, a poisoned training data set or an insecure training or deployment machine can change the behaviour of an AI system enormously. A trustworthy system becomes untrustworthy in an almost imperceptible manner.
The versioning problem is one of compositionality and dependency: how to describe a complex system in terms of its component parts and how to track the inherent dependencies. 

An AI system is essentially a highly complex software system. It inherits the complexity of software system management. But this problem is made worse by the fact that the AI system behaviour is further determined by up to 1 trillion parameters (e.g. ChatGPT 4). The state of the art for "trustworthy software" development is the SBOM - Software Bill or Materials, recently enacted into US and EU law. SBOMs provide the tools to describe the complex dependencies of software components; but has not been designed for AI. TAIBOM builds on this work. CISA itself [1] has stated that this is essential work to progress. It will take current industry best practice (CycloneDX/SPDX) and adapt and extend this work to make it fit for purpose to describe the full complexity of an AI system. This work will explicitly manifest the dependencies on training data, training algorithm, validation data and training and deployment machines?

To describe and manage the trustworthiness attributes of the system, we first need the language to describe a stable AI system. (What is it we are talking about?)
AI Adoption: AI component developers, AI system assemblers, AI training data providers, AI system integrators and AI system users will have the tools to deterministically describe the AI component and assembled AI. Without this innovation, it is almost impossible to make any stable, reliable claim about any facet of an AI system.

## Annotations
Many organisations (e.g. Turing Institute, NIST, EU, Microsoft and Google) are defining process or metrics to define trustworthiness and the distinct parameters envisioned (e.g. Microsoft's version: fairness, reliability/safety, privacy/security, inclusiveness, transparency and accountability). Most of these approaches neglect two important facts: a) the statements are inherently biased by the organisation making the statement; and b) the interpretation of the claim is inherently subjective.

Even when we consider basic system (non-AI) trustworthiness, it is clear that subjectivity is an integral part of the evaluation. Take a telecom system example: Does "China Mobile" trust Huawei telecommunication software? Does Vodafone trust Cisco telecommunication software? But does Vodafone trust Huawei kit and does China mobile trust Cisco kit?

The foundational work for this approach is in W3C Verifiable Credentials [2]. This work will be extended and refined to make distributed claims about AI system components.

AI Adoption: this innovation will provide the tools for AI stakeholders, from the original developer through to independent test agencies, auditors and legislators to make qualified statements about a systems trustworthiness, across multiple dimensions of trustworthiness. Each of these statements will be fully interoperable, will be explicit about both subject and claimant, will have the ability to express context (what is it being used for) and can be evaluated subjectively, depending on the trust foundation of the assessor.

TAIBOM creates a standardised ecosystem for describing the nuanced composition of AI systems (versioning) and making contextualised but precise claims about the trustworthiness (annotations) of the system, and its components.

Our approach is dual strand:
- Develop the commercial tools for managing AI system lifecycle
- Develop/refine the interoperable, international, standards that ensure this technology is created in a broad ecosystem.

