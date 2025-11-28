import React from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Translate, { useLocale } from '@site/src/components/Translate';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const locale = useLocale();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <Heading as="h1" className={styles.heroTitle}>
            <Translate
              id="documentation.homepage.hero.title"
              description="Documentation homepage hero title"
              locale={locale}>
              HUMΛN-Ø
            </Translate>
          </Heading>
          <p className={styles.heroSubtitle}>
            <Translate
              id="documentation.homepage.hero.subtitle"
              description="Documentation homepage hero subtitle"
              locale={locale}>
              {siteConfig.tagline}
            </Translate>
          </p>
          <div className={styles.heroButtons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/intro">
              <Translate
                id="documentation.homepage.getStarted"
                description="Documentation homepage get started button"
                locale={locale}>
                Get Started - 5min ⏱️
              </Translate>
            </Link>
            <Link
              className="button button--primary button--lg"
              to="/docs/architecture">
              <Translate
                id="documentation.homepage.viewArchitecture"
                description="Documentation homepage view architecture button"
                locale={locale}>
                View Architecture
              </Translate>
            </Link>
          </div>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>3</div>
            <div className={styles.statLabel}>
              <Translate
                id="documentation.homepage.stats.blockchains"
                description="Blockchains supported stat"
                locale={locale}>
                Blockchains
              </Translate>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>100%</div>
            <div className={styles.statLabel}>
              <Translate
                id="documentation.homepage.stats.verifiable"
                description="Verifiable impact stat"
                locale={locale}>
                Verifiable
              </Translate>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>∞</div>
            <div className={styles.statLabel}>
              <Translate
                id="documentation.homepage.stats.scalable"
                description="Scalable solutions stat"
                locale={locale}>
                Scalable
              </Translate>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function FeaturesSection() {
  const locale = useLocale();
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className="col col--4">
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🌍</div>
              <h3>
                <Translate
                  id="documentation.homepage.features.global.title"
                  description="Global impact feature title"
                  locale={locale}>
                  Global Impact
                </Translate>
              </h3>
              <p>
                <Translate
                  id="documentation.homepage.features.global.description"
                  description="Global impact feature description"
                  locale={locale}>
                  Track and verify human impact across multiple blockchain networks worldwide.
                </Translate>
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔐</div>
              <h3>
                <Translate
                  id="documentation.homepage.features.secure.title"
                  description="Secure verification feature title"
                  locale={locale}>
                  Secure Verification
                </Translate>
              </h3>
              <p>
                <Translate
                  id="documentation.homepage.features.secure.description"
                  description="Secure verification feature description"
                  locale={locale}>
                  Blockchain-powered verification ensures tamper-proof impact records.
                </Translate>
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>
                <Translate
                  id="documentation.homepage.features.instant.title"
                  description="Instant access feature title"
                  locale={locale}>
                  Instant Access
                </Translate>
              </h3>
              <p>
                <Translate
                  id="documentation.homepage.features.instant.description"
                  description="Instant access feature description"
                  locale={locale}>
                  Real-time impact tracking and verification with instant proof generation.
                </Translate>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickLinksSection() {
  const locale = useLocale();
  const quickLinks = [
    {
      title: 'documentation.homepage.quickLinks.gettingStarted.title',
      description: 'documentation.homepage.quickLinks.gettingStarted.description',
      href: '/docs/intro',
      icon: '🚀'
    },
    {
      title: 'documentation.homepage.quickLinks.architecture.title',
      description: 'documentation.homepage.quickLinks.architecture.description',
      href: '/docs/architecture',
      icon: '🏗️'
    },
    {
      title: 'documentation.homepage.quickLinks.github.title',
      description: 'documentation.homepage.quickLinks.github.description',
      href: 'https://github.com/lstech-solutions/human-0.com',
      icon: '💻'
    },
    {
      title: 'documentation.homepage.quickLinks.mainSite.title',
      description: 'documentation.homepage.quickLinks.mainSite.description',
      href: 'https://human-0.com',
      icon: '🌐'
    }
  ];

  return (
    <section className={styles.quickLinks}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          <Translate
            id="documentation.homepage.quickLinks.title"
            description="Quick links section title"
            locale={locale}>
            Quick Links
          </Translate>
        </Heading>
        <div className="row">
          {quickLinks.map((link, index) => (
            <div key={index} className="col col--6">
              <Link to={link.href} className={styles.quickLinkCard}>
                <div className={styles.quickLinkIcon}>{link.icon}</div>
                <div className={styles.quickLinkContent}>
                  <h3>
                    <Translate
                      id={link.title}
                      description="Quick link title"
                      locale={locale}>
                      Quick Link {index + 1}
                    </Translate>
                  </h3>
                  <p>
                    <Translate
                      id={link.description}
                      description="Quick link description"
                      locale={locale}>
                      Description for quick link {index + 1}
                    </Translate>
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const locale = useLocale();
  
  return (
    <Layout
      title="HUMΛN-Ø Documentation"
      description="Verified Human Impact Platform - Complete documentation for HUMΛN-Ø">
      <HomepageHeader />
      <main>
        <FeaturesSection />
        <QuickLinksSection />
      </main>
    </Layout>
  );
}
