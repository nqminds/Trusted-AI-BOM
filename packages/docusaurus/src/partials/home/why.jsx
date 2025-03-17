import React from "react";
import Panel from "./panel";

export default function Why() {
  return (
    <Panel color={"light"} includePadding={true}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // Ensure responsiveness on smaller screens
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto", // Center the content
          gap: "20px",
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        {/* Left: Image */}
        <div>
          <img
            loading="lazy"
            src="/img/taibom-2.webp"
            alt="How TAIBOM works"
            height={275}
            style={{
              borderRadius: "15px", // Rounds the corners of the image
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Optional: Adds a subtle shadow
            }}
          />
        </div>

        {/* Right: Text */}
        <div style={{ flex: "1 1 50%", textAlign: "left", padding: "10px" }}>
          <h1>Why TAIBOM?</h1>
          <p>
            To manage AI systems and their risk we need to know what version we are using, where it came from and how it's put together.
          </p>
          <p>
            If we can't label, version and attest (be sure its what it says it is) the system we have no foundation for making higher level statements.. It's like building a house on sand. We need robust, cryptographically backed system descriptions before we can start.
          </p>
          <p>
            TAIBOM addresses the technical challenge of providing formal descriptions of AI systems and dependencies. It additionally provides a method of describing and validating subjective claims about the qualities of these systems
          </p>
          <h1>Why the <b>"T"</b> ?</h1>
          <p>
            The "T" standards for "trustable". The necessary but insufficent basis of for trust. TAIBOM is designed to interoprate with other AI trust measures such as vanilla AIBOM and model cards. TAIBOM adds the critial foundations needed to make trusworthines assessments. 
          </p>
        </div>
      </div>
    </Panel>
  );
}
