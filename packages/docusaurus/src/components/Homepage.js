import React from 'react';
import styles from './Homepage.module.css';
import Link from '@docusaurus/Link';

const Sections = [
  {
    title: 'Docs',
    png: require('../../static/img/documentation.png').default,
    description: 'Find detailed information about our project, API, and tools.',
    docsLink: '/docs/',
  },
  {
    title: 'Schemas',
    png: require('../../static/img/schema.png').default,
    description: 'Explore our comprehensive schema repository.',
    docsLink: '/schemas/',
  },
  {
    title: 'SDK',
    png: require('../../static/img/sdk.png').default,
    description: 'Command-line interface for creating, documenting, signing, and verifying TAIBOMs',
    docsLink: '/sdk/sdk/',
  },
];

function IconContainer({ png, title, description, docsLink }) {
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        {/* Image with hover effect */}
        {png && (
          <div className={styles.imageContainer}>
            <img className={styles.featureImg} alt={title} src={png} />
          </div>
        )}
        <div className={styles.textContainer}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <Link
            className={`${styles.button} ${styles.glassButton}`}
            to={docsLink}
          >
            View Docs
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function HomepageWGList() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.row}>
          {Sections.map((props, idx) => (
            <IconContainer key={idx} {...props} />
          ))}
        </div>
        <div className='container'>
          <h4>
            TAIBOM (Trusted AI Bill of Materials) addresses two fundamental challenges that impact the development and deployment of trustworthy AI systems.
          </h4>
          <ul>
            <li>
              <b>Versioning: </b>
              How do we refer to an AI system in a stable way? How do we produce an AI inventory of dependent components? How can we use these references to make statements about a system’s trustworthiness or its legal standing; and
            </li>
            <li>
              <b>Attestations: </b>
              How do we make attestations of trustworthiness about an AI. Whether these claims are about bias, security, right through to the strong legal contractual assertions: how do we make these claims in an interoperable way? How can we assemble the claims from the dependent parts (compositionality)? How do we reason about or validate these claims, factoring in context of use and subjectivity?
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
