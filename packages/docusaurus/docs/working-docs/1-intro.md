---
slug: /
title: TAIBOM
---

# Trusted AI Bill of Materials

TAIBOM (Trusted AI Bill of Materials) (formally T-CHAIN) addresses two fundamental challenges that impact the development and deployment of trustworthy AI systems.
- Versioning: How do we refer to an AI system in a stable way? How do we produce an AI inventory of dependent components? How can we use these references to make statements about a system’s trustworthiness or its legal standing; and
- Attestations: How do we make attestations of trustworthiness about an AI. Whether these claims are about bias, security, right through to the strong legal contractual assertions: how do we make these claims in an interoperable way? How can we assemble the claims from the dependent parts (compositionality)? How do we reason about or validate these claims, factoring in context of use and subjectivity?

In background to this is the recent emergence of composability of models, commodity models and commodity data sets. 
Commodity could be commercial or permissive open source and examples include LLMs leveraging image recognition & generation models. This composability echoes what was seen previously in ‘traditional’ software where open source, in particular, has enabled ecosystems to emerge where final capability is ultimately dependent on an edifice of prior work from disparate sources (hence the need for SBOM). This is in contrast to early software systems which were largely composed from the work of a single organisation and then later, perhaps, with some well understood outsourced inputs. Similarly, early AI was a single coherent work of an organisation or research group with a few foundational inputs (e.g. PyTorch). Increasingly this is not so, with many fundamental aspects being incorporated as prior work from disparate sources. In this respect AI can be seen as accelerating towards the state of software in general.

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
- Develop/refine the interoperable, international, standards that ensure this technology is created in a broad ecosystem.




