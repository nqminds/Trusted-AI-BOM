import React from 'react';
import styles from "./css/contributor.module.css"; // Import the CSS file

const ContributorAvatar = ({ author = {}, lastContribution, total }) => {
  // Destructure the necessary fields from the author object
  const { avatar_url, name, company, bio, email_address, title } = author;

  return (
    <div
      className={styles["contributor-item"]}
    >
      <div className={styles["contributor-info"]}>
        {/* Contributor Avatar */}
        <img
          width="75"
          height="75"
          className={styles["contributor-avatar"]}
          src={avatar_url}
          alt={name}
        />
        {/* Contributor Name */}
        <div className={styles["contributor-name"]}>{name}</div>
        
        {/* Display Company Name */}
        {company && company.name && (
          <div className={styles["contributor-company"]}>{company.name}</div>
        )}

      </div>
    </div>
  );
};

export default ContributorAvatar;
