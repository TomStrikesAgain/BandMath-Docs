import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'User Guides',
    emoji: '🤖',
    description: (
      <>
        Learn about all the cool things you can do with BandMath.
      </>
    ),
  },
  {
    title: 'Troubleshooting Tips',
    emoji: '⚠️',
    description: (
      <>
        A comprehensive guide to handling unexpected scenarios, like
        incorrectly logged merch or at-cost and discounted transactions.
      </>
    ),
  },
];

function Feature({emoji, title, description}) {
  return (
    <div className={clsx('col col--6')}>
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
