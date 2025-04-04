TAIBOM has been created with key principles in mind, which have impacted the design and implementation

These are:

## Identify and verify

Each component of the AI system, should have a strong identity, with clear defined semantics on how this identify can be verified. Strong identity is non negotiable aspect of cyber secure system. 

## Strong versioning 

Strong versioning builds on the identity model. It must be possible to clear when a component has been upgraded and it must be possible to verify that it has been upgraded. 

## Compositionality 

Complex systems are built from simpler systems. TAIBOM provides a mechanism for describing how systems are built.

## Dependency relations

In fact compositionality is a subset of a more general relation that exists between parts, that is an abstract notion of dependency. TAIBOM provides a language to describe these dependencies, focussing in particular where one component inherits risks present in another.

## Data Centric Security 

In general TAIBOM embraces the data centric security model. In this model critical security attributes such as integrity, provenance and encryption (where needed) are implemented at the atomic data level (withing the data packet itself) rather than being a property of the bearer. This allows us to not worry about how the information arrived (what transport was used), when evaluating the content of what we are being told.

## Multi party, distributed authorship

AI systems are complex systems, built from many components, involving many stakeholders. TAIBOM provides the language to model this problem.

for example

* the author of data - which can be different to
* the curator of trained data sets - which can be different to
* the trainer of the AI system  - which can be different to
* the validator/ QA/ Auditor of the  system (who released it) - which can be different to
* the application developer who integrates the AI system into  - which can be different to
* host of the AI application  - which can be different to
* the user of the AI application

However, each of these stakeholders has useful things to contribute to the end to end description of a secure AI system

TAIBOM allows these different to describe the component for which they have responsibility and to assemble these parts into the description of a more complex system 

## Third party descriptions

It is not only the author/developer of the system that can describe and annotate a system, but a third party is also capable.

For example we may have an inference system. It could be black box (e.g. OpenAI) or open eights (e.g. LLAMA). But in both cases we don't have any evidence as two what the training data sets were. using TAIBOM it is perfectly possible for another third party to describe these dependencies. (it is up to you whether you believe them)

## Subjectivity of inference

TAIBOM provides a cryptographic system for many parties to describe an annotate a complex AI system.

It perfectly possible that some of these description are "contradictory"

It is left to the TAIBOM end users (and their chosen inference system) to resolve inconsistency, and prioritise information. 

There is a clear distinction in the TAIBOM system between "what you are told" and "what you believe"

Usually, but not always, this is achieved by rebalancing the trust you have in the information sources. 

## Information sources and information relays

TAIBOM distinguishes an information source form an information relay

This is an emergent property of a data centric security model.

An information source is the signatory of the verifiable credential that encapsules the information . In other works its the cryptographically verified 

source

And information relay is the method by which the information got to you. All information relays are essentially information caches.   

## Revocation

Information can change. Trust in information sources can change. 

Certification (and verifiable credentials) are essentially secure local caches of information.

Revocation, traditionally, in cyber security is a hard problem to solve.

TAIBOM has two coarse grained approaches to revocation

1. **Check with source**. Every verifiable credential has an explicitly issuer (usually the signatory). The user can re-check the information with the originator at any tie using this issuer address.
2. **Verify using a trusted authority**: The TAIBOM user can choose what information sources to "add". Because TAIBOM supports third party descriptors, if the TAIBOM user has an information source that takes precedent over the information source it can  override. Classic certificate revocation, or black listing leaked public keys are all reductive examples of this more general model 



   