# Hashing background

AI systems depend on large data files.

TAIBOM like assurance requires the hashing and attestation of the same large data sets 

From a security perspective the choice of hashing algorithm impacts the security properties of the solution

From an engineering perspective hashing is expensive and performance needs to be considered.

## Hashing specification

**Requirement: TAIBOM should use SHA-256 or SHA3-256 for its hashing functions.**



TODO: should we consider additional hashing recommendation functions

TODO: TAIBOM site overview - split into specification and engineering sections 



## Hashing best practice

We should recommend best practice to help implementers with the engineering of TAIBOM solutions.

To establish best practice we need to initiate some research across across large scale hashing implementation.

The following list is a working list of activities that should be undertaken

### Hashing research: performance benchmarks 

We should initiates a research to establish typical performance of hash creation and validation using. This can probably be desk based research. We will need some indicative control parameters

* hashing algorithm
* CPU speed
* File size
* Diss speed 

### Hashing research Industry best practice  

We should initiates a quick research on best practice in the following areas   



1. **Hardware optimisation methods**: for extremely large data sets are their hardware based solutions that can speed up the hashing of large data sets
2. **Software parallelisation methods**: for extremely large data sets are their recommended best practices in terms of software configuration and use of parallelization methods

## Hashing research algorithmic approaches 

Distinguishing from the computational parallelisation methods above, which looks at raw throughput, we should consider some high level analysis of hashing algorithmic approaches and data structures.   

This should consider high level considerations

1. Recommendations on splitting large files into smaller files, and recommendations on clustering sizing
2. How to create stable links between hashes
3. Comparison of hash tree and hash graph methods
4. Consideration of how you can create a W3C VC that can create a stable immutable reference to another VC 
5. Consideration of the integration of JSON-LD into W3C-VCs and how this relates to stable links



Fundamentally do we need to distinguish between shallow links and deeply verifiable links 















​	









