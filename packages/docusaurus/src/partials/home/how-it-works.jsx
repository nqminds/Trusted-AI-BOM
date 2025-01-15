import React from "react";
import Panel from "./panel";

export default function HowItWorks() {
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
          flexDirection: "row"
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
        <div style={{flex: "1 1 50%", textAlign: "left", padding: "10px"}}>
          <h1>How it Works</h1>
          <p>
          Quisque placerat tincidunt diam id aliquet. Pellentesque mollis lorem quis quam vestibulum, eleifend gravida odio auctor. Maecenas nec leo vehicula, tempus erat id, ullamcorper lorem. Vivamus non erat tincidunt, finibus arcu vitae, molestie ante. Duis suscipit erat sed convallis luctus. Curabitur euismod, turpis sit amet vestibulum euismod, mi quam accumsan quam, non lobortis tellus lacus sed nulla. Nulla facilisi. Donec eu nisl nec sem hendrerit rutrum vitae eget eros. Duis vulputate placerat risus in molestie. Nulla ac dui hendrerit tellus mollis gravida.          </p>
        </div>
      </div>
    </Panel>
  );
}
