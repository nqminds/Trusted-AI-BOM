import React from "react";
import Panel from "./panel";

export default function TechnicalDetails() {
  const details = [

  ];

  return (
    <Panel color={"light"} includePadding={false}>
      <div style={{ width: "75%", justifySelf: "center" }}>
        <h1>Technical building blocks</h1>
        <p>TAIBOM is underpinned by the W3C verifiable credential interoperable standard, and provides:</p>
        <ul>
          <li>A formal method of describing and attesting to the constituent parts of an AI system</li>
          <li>A method of describing larger systems, and system dependencies within and across AI system</li>
          <li>A method of annotating components and systems with security attributes positive and negative risk implication</li>
          <li>A method of reasoning about the inherent risk in an AI system by transitively propagating risk</li>
        </ul>
      </div>
    </Panel>
  );
}
