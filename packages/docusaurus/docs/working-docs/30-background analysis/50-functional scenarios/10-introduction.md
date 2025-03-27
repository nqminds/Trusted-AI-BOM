In this section we will formally define each functional requirement

The goal is that each functional requirement can be implemented by a query, typically running at (or adjacent to) the inference engine.

The the query to be executable, the following things must exist.



1. A formal schema is defined which ensures the atomic data statements re interoperable
2. Facts must exist (conforming to the appropriate schema) with describe the (components, system, attestations)
3. Data flows: concrete mechanism are defined for gathering the appropriate facts from trusted data sources
4. Formal queries are defined that deliver the functional results, buy applying an inference engine to the trusted data sources



In the initial phases we assume  a simple data flow scenario where all system meta data is assumed to be packaged within  the TAIBOM descriptor that sits with the inference engine



