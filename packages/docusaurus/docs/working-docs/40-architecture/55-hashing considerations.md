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

We should initiate a quick research on best practice in the following areas 

1. **Hardware optimisation methods**: for extremely large data sets are their hardware based solutions that can speed up the hashing of large data sets

2. **Software parallelisation methods**: for extremely large data sets are their recommended best practices in terms of software configuration and use of parallelization methods



### Hashing research: performance benchmarks 

> We should initiate  research to establish typical performance of hash creation and validation using. This can probably be desk based research. We will need some indicative control parameters
>
> * hashing algorithm
> * CPU speed
> * File size
> * Diss speed 
>
> Query is has creation lower than valiation
>
> https://www.numberanalytics.com/blog/computational-complexity-hash-based-signatures 





### Hashing research: Industry best practice  

We should initiates a quick research on best practice in the following areas   



1. **Hardware optimisation methods**: for extremely large data sets are their hardware based solutions that can speed up the hashing of large data sets
2. **Software parallelisation methods**: for extremely large data sets are their recommended best practices in terms of software configuration and use of parallelization methods

## Hashing research: algorithmic approaches 

Distinguishing from the computational parallelisation methods above, which looks at raw throughput, we should consider some high level analysis of hashing algorithmic approaches and data structures.   

This should consider high level considerations

1. Recommendations on splitting large files into smaller files, and recommendations on clustering sizing
2. How to create stable links between hashes
3. Comparison of hash tree and hash graph methods
4. Consideration of how you can create a W3C VC that can create a stable immutable reference to another VC 
5. Consideration of the integration of JSON-LD into W3C-VCs and how this relates to stable links



Fundamentally do we need to distinguish between shallow links and deeply verifiable links 





## Probabilistic Hashing

TODO: explore the use of probabilistic hashing as a practical audit method 







 **Actions**

| **Action Item**                                              | **Owner**    | **Notes**                                                    |
| ------------------------------------------------------------ | ------------ | ------------------------------------------------------------ |
| Clean up and separate sections in spec                       | Nick Allott  | Distinguish spec, background, and engineering notes  <br /><br />Still to do |
| Confirm whether SHA-256 is quantum-safe                      | Gareth       | Added to doc                                                 |
| Investigate performance benchmarks for hashing               | Ryan Baldwin | Use existing studies or run new tests                        |
| Share source discussing hash generation vs verification  speed | Mark         | Posted link in shared doc  <br /><br />DONE                  |
| Confirm definitively whether SHA-256 is non-parallelisable   | Ryan Baldwin | Clarify implications and alternatives                        |
| Liaise hashing/addressing issues with W3C                    | Nick Allott  | Especially around deep linking and hash-in-URI  <br /><br />DONE - wating on resposne |
| Collect industry best practices on hashing, chunking, file  handling | All          | Check for optimised hardware, hashing libraries              |









# Draft content 







## Research links



#### NVidia Hash maps

https://developer.nvidia.com/blog/maximizing-performance-with-massively-parallel-hash-maps-on-gpus/

?? is there a serialiseation standard 





#### Sha-2 wikipedia



https://en.wikipedia.org/wiki/SHA-3



interesting points on

* performance
* hardware optimisation trade-offs
* parallelisation 

#### NIST SP

http://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-185.pdf









​	









