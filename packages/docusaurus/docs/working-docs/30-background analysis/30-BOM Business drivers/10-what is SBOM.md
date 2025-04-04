A Gemini AI summary provides the following useful definition 

> A Software Bill of Materials (SBOM) is a list of all the components that make up a software program. 
>
> It includes information about the licenses, versions, and patch status of each component.
>
> What's in an SBOM?
>
> - **Components**: 
>
>   A list of all the components, including open-source libraries, proprietary software, and licensed dependencies
>
>   
>
> - **Licenses**: 
>
>   The licenses that govern each component
>
>   
>
> - **Versions**: 
>
>   The versions of each component used in the code
>
>   
>
> - **Patch status**: 
>
>   The patch status of each component
>
>   
>
> - **Provenance information**: 
>
>   Other information about the components, such as the tools used to produce them
>
>   
>
> Why are SBOMs important?
>
> 
>
> - SBOMs help organizations understand their software supply chains and identify risks.
> - They help organizations track known and new vulnerabilities.
> - They help organizations ensure that only authorized dependencies are included in software projects.
> - They help organizations make better security decisions.
>
> How have SBOMs been used?
>
> 
>
> - The [National Telecommunications and Information Administration (.gov)](https://www.ntia.gov/page/software-bill-materials) (NTIA) has been involved in developing SBOMs through a multistakeholder process.
> - The White House (.gov) issued an executive order in 2021 that made SBOMs mandatory for federal IT systems. 



CISA Landing page https://www.cisa.gov/sbom



Fundamentally SBOMs provide a useful tool to help manage risks

They do so by providing a system description, which is of sufficient detail to help map and propagate risks, across complex software systems

And important clarification on the limits of SBOM 

- the system description and the dependencies are of sufficient level of complexity to track risks
- the system description does not provide sufficient level to build the system (that is a different level )
- SBOM does not provide bit exact descriptions , but system dependencies

The typical risks that are annotated and mapped are

* CVE - vulnerability riks
* licensing based risk 









