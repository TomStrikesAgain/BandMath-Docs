import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'AI Workflows',
    emoji: '🤖',
    description: (
      <>
        Learn how our autonomous AI agents interact with the platform,
        process data, and manage edge cases.
      </>
    ),
  },
  {
    title: 'Marketing Strategies',
    emoji: '📈',
    description: (
      <>
        Explore our best practices for growing your band's audience,
        optimizing ad spend, and running campaigns.
      </>
    ),
  },
  {
    title: 'Edge Cases',
    emoji: '⚠️',
    description: (
      <>
        A comprehensive guide to handling unexpected scenarios, from
        incorrect merch logging to API rate limits.
      </>
    ),
  },
];

function Feature({emoji, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center" style={{fontSize: '4rem'}}>
        {emoji}
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
