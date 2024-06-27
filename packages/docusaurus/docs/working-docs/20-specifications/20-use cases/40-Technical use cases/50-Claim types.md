# Claim types

At the macro level we distinguish two flavours of AIBOM claims

* **AI system labelling claims**: these version and label the individual components or describe the system as a whole
* **AI system attestations**: these ascribe testable of verifiable qualities to either the system as whole or the components of the system



## TAIBOM Labelling claims

The following section lists out the different labelling claims we have identified.

### Component claims

These claims relate to the individual elements of the system.

#### VC: Local data claim

This claim versions an individual piece of data held locally.

The full payload of the data is available to the recipient.

Key properties

* Unique ID
* Hash: the hash of the data payload
* Filename (optional)
* Description (optional)
* Owner (optional)

#### VC: Remote data claim

This claim versions an individual piece of data held remotely on a website (accessible over http or https).

The full payload of the data is not available to the recipient.

Key properties

* Unique ID
* URI: the root identifier of the data to be made available  
* Version (optional): the owner can self declare a stable version. However this is not verifiable by the client 
* Hash (optional): the hash is optional, it can be created by the data author, and is verifiable on complete download, if we have strong spidering semantics 
* Description (optional)
* Owner (optional)
* DateTime: When the data was accessed for training (as this data may change / be removed / etc.): base ownership implied by domain ownership.

Crawling and manifest semantics need to be defined for multi-part remote hosted content.

#### VC: Software claim

This claim labels and versions distributable software.

In the context of the AI system this is the distributable code for the inference system or training algorithm.

Key properties

* Unique ID
* Hash: the hash of the file or folder which constitutes the running system
  * Possible option for a hash of the installer/distribution package  
* (optional) SBOM: a link to the SBOM description of the software
  * can either be attached withing the VC
  * file name and hash of a separate descriptor adjacent to the VC
  * or URI 
* Version (optional)
* Description (optional)
* Owner (optional): base ownership implied by domain ownership

#### VC: OS/System claim

This claim will define the version of the underlying operating system and any ancillary system level dependencies required.

TBD: defining the specific references 

#### VC: Hardware claim

This claim will define the version of the underlying hardware component (e.g. GPUs) needed to run or train the system.

TBD: defining the specific references 



#### VC: Config claim

This claim will define the version of configuration parameters used for the inferencing system.

Each config package could come in different forms: from a small set of training parameters to a full set of trained weights.

Optionally, as this matures, we may enhance this claim with strict schemas and formats, but in the first instance we are just concerned with the versioned hash.

* Unique ID
* Hash: the hash of the file or folder which constitutes the running system
* (optional) file ref: local file name of the accompanying package 
* Description (optional)

TBD: we may define methods for passing the remotely (HTTP) - like training data.



### System description claims

#### VC: Aggregation claim

This claim aggregates two or more claims into a larger set.

This is most typically used for training data, where many different training data sets may be used.

* Unique ID
* List of unique IDs of the referenced sets

Aggregation claims can also be used to define larger units for example binding [AI Inference Code] AND [Trained Weights] into a versioned system. 



#### VC: Dependency claim

Dependency claims may at a later date come in different flavours, but in abstract a dependency claim implies that certain attestations will have a transitive property.

For example, if there is bias in one of training data sets, then we can infer that the trained system will be potentially biased.

Some examples of dependency claims:

* [AI inference system] IS DEPENDENT ON [AI Inference Code] AND [Trained Weights]
* [Trained weights]  IS DEPENDET ON [AI Training Code ] AND [Training data]

 

## TAIBOM Attestation claims

We have identified two primary forms of attestation claim.

* Legal claims: generally pertaining to licensing constraints
* Behavioural claims: relating to the observed of inferred behaviour

Attestation claims can be made against induvial components or aggregate components.

### Legal attestations

Currently we have three types of legal attestation in scope:

* Training data: terms of use. e.g is it open data or commercial data. Does it come with restrictions?
* End user license: these are software terms that may relate to AI training software or AI inference software
* AI artefact licenses: these are licenses that apply to the operational results of an AI system (e.g. generatd text, generated images, decisions, etc. )



### Behavioural attestations

Behavioural attestations can come in many forms

Some examples are listed below:

* Software vulnerability check: the SBOM of the inferencing of training software can be analysed for potential vulnerabilities and these can be reported in an encapsulated VC
* Training data check: training data sets can be analysed by human or computer and validated against. Examples of training data checks:
  * Poisoning check
  * Bias check 
* Performance checks: the operational performance of a trained inference system can be validated against an external tests suite (which may include a validation data set for example)
