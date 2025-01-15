import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import Companies from '../partials/home/comapnies';
import Intro from '../partials/home/intro';
import HowItWorks from '../partials/home/how-it-works';
import BenefitsOfTaibom from '../partials/home/benefits';
import TechnicalDetails from '../partials/home/technical-details';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title" style={{fontSize: 70}}>Trustworthy AI Bill of Materials</h1>
        <h2 className="hero__subtitle">{siteConfig.tagline}</h2>
        <div className={styles.buttons}>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description={`${siteConfig.description}`}>
      <HomepageHeader />
      <article>
        <Companies/>
        <Intro/>
        <br/>
        <HowItWorks/>
        <br/>
        <BenefitsOfTaibom/>
        <br/>
        <TechnicalDetails/>
      </article>
    </Layout>
  );
}
