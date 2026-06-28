import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'User Guides',
    emoji: '🤖',
    description: (
      <>
        Learn how our autonomous AI agents interact with the platform,
        process data, and help you rock.
      </>
    ),
  },
  {
    title: 'Troubleshooting Tips',
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
