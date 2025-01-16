import React from "react";
import Panel from "./panel";

export default function IntroToTaibom() {
  return (
    <Panel color={"primary"} includePadding={true}>
      <div
        style={{
          maxWidth: "80%", // Limit the width
          margin: "0 auto", // Center horizontally
          padding: "20px", // Add some padding for readability
          textAlign: "center", // Center align text
        }}
      >
        <p style={{fontSize: 22}}>
          TAIBOM is an emerging standard to describe and manage AI systems and AI system risk.
          TAIBOM addresses the full AI supply chain, from training data through the results that AI systems produce. 

        </p>
        <a
          href="/docs"
          style={{
            display: "inline-block",
            backgroundColor: "#f8f9fad7",
            color: "#1a202c",
            padding: "10px 20px",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
        >
          Learn More About TAIBOM
        </a>
      </div>
    </Panel>
  );
}
