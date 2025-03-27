

AIBOM inherits the business case drivers of SBOM with a few minor adjustments:



| **Risk type**                   | **Use case**                                                 | **TAIBOM changes**                                           |
| ------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Software vulnerability risk** | Does my **Inference** OR **Training** system have any critical vulnerabilities?A new critical CVE is announced in component X - which of my systems are impacted? | Need to consider dependency between training and inference system |
| **Export risk**                 | Does my inventory contain any Foreign Ownership, Control, or Influence (FOCI) issues? | Different export license surrounding AIEU specific regulation restrict use |
| **Licensing risk**              | Does my inventory contain any licensing risks - e.g. GPL pollution ? | See copyright risk later                                     |
| **Support risk**                | Under CSA (or other) regulations, what software support liabilities exist through dependencies on external (open source?) systems | Unexplored what implications CSA has for AI systems          |





But wee can these additional AI focussed risks



| **Risk type**          | **Use case**                                                 |
| ---------------------- | ------------------------------------------------------------ |
| **Data poisoning**     | Has my training data been intentionally poisoned - and can I trace impact through to all deployed inference systems |
| **Data pollution**     | Has my training data been accidentally polluted?             |
| **Performance checks** | Do I have evidence that the system has been validated (performs well enough) for the application |
| **Copyright risk**     | Is there any inherent copyright infringement risk in the data on which the system has been trained |
| **Bias risk**                 | Are there inherent biases in either the data on which the AI system has been trained or in the performance on the versioned inference system |
| **System tampering risk**     | Has the software or the trained weights been tampered with   |
| **Best practice/Legislation** | Do I have evidence that the system designers employed best practice in the development of the system |
| **Supply chain risk**         | Do I trust all the actors involved in the creation of the system. FOCI checks. |

:::note

Can we think of any more 

:::
