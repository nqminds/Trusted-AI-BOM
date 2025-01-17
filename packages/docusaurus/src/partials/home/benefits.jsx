import React from "react";
import Panel from "./panel";
import styles from "./css/benefits.module.css"; // Import the CSS file

export default function BenefitsOfTaibom() {
  const benefits = [
    {
      icon: "🔒", // Security
      title: "Security",
      description:
        "The trustworthiness (or trustability) of the AI system improves through strong interoperable foundations.",
    },
    {
      icon: "🔍", // Supply Chain Transparency
      title: "Supply Chain Transparency",
      description:
        "End users can see in detail where the system comes from, allowing them to make informed decisions on usage based on relative trust.",
    },
    {
      icon: "📜", // IP and Licensing
      title: "IP and Licensing",
      description:
        "Transparency and respectability of licensing and IP terms across the value chain increases, protecting both end users, data owners, and system developers.",
    },
  ];

  return (
    <Panel color={"light"} includePadding={true}>
      <div className={styles.container}>
        <h1>Benefits</h1>
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
