import React from 'react';
import ContributorAvatar from './contributor'; // Assuming ContributorAvatar is in the same folder
import styles from "./css/contributor.module.css"; // Import the CSS file
import Panel from './panel';
import people from "./people";

const Contributors = () => {

  return (
    <Panel color={"light"} includePadding={true} includeMargin>
      <div style={{ textAlign: "center" }}>
        <h1>TAIBOM Community</h1>
        <p>
          TAIBOM has been seed funded from the UKRI Technology Missions Fund.
          It is now a standalone working group under Techworks (Deep Tech trade body).
        </p>
        <p>
          Its founder members include NquiringMinds, Copper Horse, Techworks, BSI and BAE.
          It is now a fully open body accepting new members.
        </p>
      </div>
      <div className={styles["people-list"]}>
        {people.map((person) => (
          <ContributorAvatar
            key={person.id}
            author={person}
          />
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <h1>Get Involved</h1>
        <p>Email: <a href={`mailto:info@techworks.org.uk`} target="_blank" rel="noopener noreferrer">
            info@techworks.org.uk
        </a>
        &nbsp;to get involved</p>

      </div>
    </Panel>
  );
};

export default Contributors;
