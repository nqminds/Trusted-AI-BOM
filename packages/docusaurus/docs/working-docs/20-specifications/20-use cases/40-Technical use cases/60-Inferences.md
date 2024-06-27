## Inference use cases



An AI system is described and versioned by the component and aggregation claims. 

Individual components, or the entire system, can in future be annotated by attestation claims.

At an operational level, complex queries can be run, which essentially dynamically implements policy at the AI system level.

We list out some examples below:



## Config Data tampering check

The integrity of training and configuration data can be checked by

1. Validating the configuration claim at the local AI inference system
2. Recomputing the local hash of the configuration data
3. Ensuring the two pieces of information match 



## Local vulnerability test

Local software can be tested for vulnerabilities as follows 

1. Validating the local SBOM claim
2. Submitting the SBOM claim to a CVE analysis services (which could be locally run)
3. Retrieving and resulting active CVE analysis 
4. Implementing a threshold function and taking necessary actions



## Training vulnerability test

The vulnerability test can be extended to the training system as follows 



1. Iterating all training systems dependencies from the current inference system 
2. Requesting either SBOM descriptor or CVE analysis from each remote training system
3. Implementing the local policy 



## Training data fitness checks

The "fitness" of the training data can be tested by 

1. Explore the dependency tree to find all training data sets 
2. Request all data sets attestations from the primary author 
3. Submit all training data sets to any live training data validation services
4. Aggregate all training data descriptions 
5. Implement a policy check on the aggregate sets and report any violations

## Training data license checks

The licensing validity of the training data 

1. Explore the dependency tree to find all training data sets 
2. Request all data sets legal attestations from the primary author 
3. Aggregate all training data license descriptions 
4. Implement a policy check on the aggregate sets and report any violations



## AI inference system performance checks

The performance of the current system can be validated on a continuous assurance basis by

1. Make AI inference system accessible to external (or internal) test suite
2. Run tests using inbuilt benchmarks and or validation data sets
3. Produce quantitative performance report and encapsulate with VC
4. Retrieve and validate performance VC and implement local policy 

