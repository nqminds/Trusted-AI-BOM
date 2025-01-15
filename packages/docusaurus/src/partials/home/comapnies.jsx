import React from "react";
import Panel from "./panel";
import Marquee from "react-fast-marquee";

const height = 125;

export default function Companies() {

  return <Panel color={"light"} container={false}>

    <Marquee>
      <a
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Innovate UK"
        href={"https://www.ukri.org/"}>
        <img loading="lazy" src="/img/logos/innovate.png"
          alt="Innovate UK Logo"
          height={height} style={{padding: 25}}/>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TechWorks"
        href={"https://www.techworks.org.uk/"}>
        <img loading="lazy" src="/img/logos/techworks.png"
          alt="TechWorks Logo"
          className="w-48 m-4" height={height} style={{padding: 25}}/>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        aria-label="NquiringMinds"
        href={"https://nquiringminds.com"}>
        <img loading="lazy" src="/img/logos/nqminds.svg"
          alt="NquiringMinds Logo"
          height={height} style={{padding: 25}}/>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Copper Horse"
        href={"https://copperhorse.co.uk/"}>
        <img loading="lazy" src="/img/logos/copperhorse.webp"
          alt="Copper Horse Logo"
          height={height} style={{padding: 25}}/>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        aria-label="University of Oxford"
        href={"https://www.ox.ac.uk/"}>
        <img loading="lazy" src="/img/logos/oxford.png"
          alt="University of Oxford Logo"
          height={height} style={{padding: 25}}/>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        aria-label="BSI"
        href={"https://www.bsigroup.com/en-GB/"}>
        <img loading="lazy" src="/img/logos/bsi.png"
          alt="BSI Logo"
          height={height} style={{padding: 25}}/>
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        aria-label="BAE"
        href={"https://www.baesystems.com/en/home"}>
        <img loading="lazy" src="/img/logos/bae.svg"
          alt="BAE Logo"
          height={height} style={{padding: 25}}/>
      </a>
    </Marquee>
  </Panel>;

}
