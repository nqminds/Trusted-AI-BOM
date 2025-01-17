import React, { useState, useEffect } from "react";
import Panel from "./panel";

export default function HowItWorks() {
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
    <Panel color={"primary"} includePadding={true}>
      <img
        loading="lazy"
        src="/img/how-it-works.png"
        alt="How TAIBOM works"
        style={{
          width: isMobile ? "90%" : "60%", // Larger on small screens (90%), default 60% on larger screens
          margin: "0 auto", // Center the image
          display: "block", // Ensure the image is displayed as block for centering
        }}
      />
    </Panel>
  );
}
