import React from "react";
import Panel from "./panel";
import styles from "./css/benefits.module.css"; // Import the CSS file

export default function BenefitsOfTaibom() {
  const benefits = [
    {
      icon: "🚀", // Replace with an actual icon or image
      title: "Transparency",
      description: "Ensure clear visibility into AI system processes and dependencies.",
    },
    {
      icon: "🔒",
      title: "Trustworthiness",
      description: "Build confidence with verifiable attestations and versioning.",
    },
    {
      icon: "⚙️",
      title: "Customizable",
      description: "Easily adapt TAIBOM to your project needs with flexibility.",
    },
    {
      icon: "📈",
      title: "Scalability",
      description: "Track and manage complex AI systems across large-scale operations.",
    },
    {
      icon: "⏱️",
      title: "Efficiency",
      description: "Save time with structured AI dependency management tools.",
    },
    {
      icon: "🌐",
      title: "Interoperability",
      description: "Integrate seamlessly with existing AI frameworks and tools.",
    },
  ];

  return (
    <Panel color={"light"} includePadding={true}>
      <div className={styles.container}>
        <h1>Benefits of TAIBOM - [TO CHANGE]</h1>
        <div className={styles.grid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{benefit.icon}</div>
              <h3 className={styles.title}>{benefit.title}</h3>
              <p className={styles.description}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
