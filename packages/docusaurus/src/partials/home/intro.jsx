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
          TAIBOM (Trustworthy AI Bill of Materials) is a groundbreaking
          framework designed to bring transparency and trust to the development
          and deployment of AI systems. By addressing challenges in{" "}
          <strong>versioning</strong> and
          <strong> attestations</strong>, TAIBOM enables organizations to
          define, track, and validate AI systems with precision and confidence.
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
