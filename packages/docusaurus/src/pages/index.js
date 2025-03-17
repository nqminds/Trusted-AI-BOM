import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import Companies from '../partials/home/comapnies';
import Intro from '../partials/home/intro';
import Why from '../partials/home/why';
import BenefitsOfTaibom from '../partials/home/benefits';
import TechnicalDetails from '../partials/home/technical-details';
import Contributors from '../partials/home/contributors';
import WhoCanUse from '../partials/home/who-can-use';
import HowItWorks from '../partials/home/how-it-works';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title" style={{fontSize: 70}}>Trustable AI Bill of Materials</h1>
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
        <Why/>
        <br/>
        <TechnicalDetails/>
        <HowItWorks/>
        <br/>
        <WhoCanUse/>
        <br/>
        <BenefitsOfTaibom/>

        <br/>
        <Contributors/>
      </article>
    </Layout>
  );
}
