What is AIBOM in the context of SBOM.

There is an argument they are one and the same thing; AI is just complex software

The key distinction being

* in software the bulk of the risk comes from executables and shared libraries which constitute the running code, and a small amount of the risk comes from the configuration settings, or data inputs
* in AI the bulk of the risk comes from the data/configuration settings  (e.g trained weights), while the executable code is both physically smaller, by comparison and updates less regularly

In other words

* behaviour of typical software is driven be functional definition 
* behaviour of AI is driven from dynamic data sets 



Obviously this is a sliding scale, and the boundary is somewhat blurred.

However it is true that typical AI development workflows 

* introduce new flavours of risk
* have a more complex development cycle involving broader stakeholders
* have more distributed stakeholders.



This increased complexity requires new innovation. But many of these innovation can be applied to traditional software also.



Another distinction we find useful to make



* SBOM: To contain, track and manage **software** supply chain risks
* AIBOM: To contain, track and manage **information** supply chain risks



Where information is "data" and manifest in AI systems both in the trained data sets and the trained weights 
