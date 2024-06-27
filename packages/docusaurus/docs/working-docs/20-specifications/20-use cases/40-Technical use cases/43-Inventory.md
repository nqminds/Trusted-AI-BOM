## Generating an Inventory of an AI System

A business acquires a competitor and inherits AI-related software assets. The management team of the acquiring business wants to understand the state of the assets, what their dependencies are, whether they have known vulnerabilities and what licences are involved. The business uses a TAIBOM client to scan the AI-related software assets to identify their component parts and then to search for relevant attestations.



This inventory can then be used to perform the typical checks, used in an SBOM scenario, for example:

* **Check for vulnerability**: the individual AI system components (and the system as a whole) can be checked against known vulnerability lists. In the case of software and host OS this can use systems such as CVE databases and GitHub vulnerabilities. In the case of data, we envision new databases being created that annotate data vulnerabilities or checks. 

* **Check for license compatibility**: the induvial AI system components (and the system as a whole) can be checked for license compatibilities. 