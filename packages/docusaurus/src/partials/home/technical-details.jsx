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
          <li><b>Identity: </b>A formal method of naming, versioning and validating the constituent parts of an AI system</li>
          <li><b>Dependencies: </b>A method of describing the (complex) system depenencies in AI. It describes how systems are made from parts and how one component has an implied risk dependency on another.  </li>
          <li><b>Annotation: </b>A method of annotating components and systems with security, licensing and broader attributes, including positive and negative risk implication</li>
          <li><b>Inferencing: </b>A method of reasoning about the inherent risk in an AI system by transitively propagating risk</li>
        </ul>
      </div>
    </Panel>
  );
}
