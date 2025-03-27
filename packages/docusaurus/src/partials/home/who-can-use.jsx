import React, { useState, useEffect } from "react";
import Panel from "./panel";

export default function WhoCanUse() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check screen width
    const checkScreenSize = () => {
      if (window.innerWidth <= 1300) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener on resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <Panel color={"light"} includePadding={true}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // Ensure responsiveness on smaller screens
          alignItems: "center",
          margin: "0 auto", // Center the content
          gap: "20px",
        }}
      >
        {/* Left: Text */}
        <div
          style={{
            flex: "1", // Take up the remaining space
            textAlign: "left",
          }}
        >
          <h1>Who can use use TAIBOM</h1>
          <p>TAIBOM is distributed by nature, to reflect the complex supply chain of AI systems. Likewise the technology can be used by many stakeholders.</p>
          <ul>
            <li>
              Data owners: owners of the data on which AI systems are trained can version and annotate their data with things like copyright licenses
            </li>
            <li>
              AI software developers: can version the software, and annotate this software with licenses or vulnerabilities.
            </li>
            <li>
              AI system trainers: can version the trained models and annotate these systems with think like: performance metrics, bias metrics, licences or vulnerabilities
            </li>
            <li>
              Data publishers: can aggregate data for training, using or extending the meta data descriptors
            </li>
            <li>
              AI system providers: can publish AI systems with strong version control and extended meta data descriptors and quality assurance measures
            </li>
          </ul>
          <p>
            But the main users are the AI system end users. With TAIBOM the AI system user possess the technical tools to do detailed investigation and quires on the system descriptions and security qualities
          </p>
        </div>

        {/* Right: Image */}
        {!isMobile && (
          <div
            style={{
              flex: "1", // Ensure it takes the same width as the text container
              textAlign: "center", // Center the image
            }}
          >
            <img
              loading="lazy"
              src="/img/Flowchart.png"
              alt="How TAIBOM works"
              height={400}
            />
          </div>
        )}
      </div>
    </Panel>
  );
}
