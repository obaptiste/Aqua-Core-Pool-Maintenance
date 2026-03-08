import styles from './page.module.css';

const trainingPillars = [
  {
    title: 'Water Chemistry Control',
    description: 'Daily and weekly balancing routines for chlorine, pH, alkalinity, calcium hardness, and cyanuric acid.',
    detail: 'Automated prompts for corrective dosing and trend tracking.',
    emoji: '🧪',
  },
  {
    title: 'Plant Room Operations',
    description: 'Filtration, circulation, backwashing, and dosing checks that keep systems efficient and compliant.',
    detail: 'Clear weekly and monthly operator routines with escalation paths.',
    emoji: '⚙️',
  },
  {
    title: 'Bather Safety Standards',
    description: 'Risk controls, signage, supervision guidance, and incident response aligned to UK leisure operations.',
    detail: 'Rapid-reference procedures for contamination and emergency actions.',
    emoji: '🛟',
  },
  {
    title: 'Compliance & Documentation',
    description: 'Structured records for HSG179, COSHH, RIDDOR, and PWTAG expectations with auditable checklists.',
    detail: 'Evidence-ready logs built for audits, incident reviews, and handover.',
    emoji: '📋',
  },
];

const quickStats = [
  { value: '12', label: 'Training modules' },
  { value: '48+', label: 'Practical procedures' },
  { value: 'UK', label: 'Compliance focus' },
  { value: '24/7', label: 'Self-paced access' },
];

const implementationSteps = [
  'Complete the core safety and chemistry modules first.',
  'Run daily, weekly, and monthly maintenance checklists.',
  'Use module quizzes to verify team understanding.',
  'Issue completion certificates for trained operators.',
];

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.bgOrbA} aria-hidden />
      <div className={styles.bgOrbB} aria-hidden />

      <section className={styles.hero}>
        <p className={styles.eyebrow}>AquaPool Professional Platform</p>
        <h1 className={styles.title}>AquaCore Pool Maintenance</h1>
        <p className={styles.subtitle}>
          A mobile-first training and operations hub for pool teams. Learn standards, apply routines,
          and keep facilities clean, safe, and compliant.
        </p>

        <div className={styles.statsGrid}>
          {quickStats.map((item) => (
            <article key={item.label} className={styles.statCard}>
              <p className={styles.statValue}>{item.value}</p>
              <p className={styles.statLabel}>{item.label}</p>
            </article>
          ))}
        </div>

        <div className={styles.ctaRow}>
          <a href="/modules/pool-maintenance" className={styles.primaryCta}>
            Open AquaCore Academy
          </a>
          <a href="#pillars" className={styles.secondaryCta}>
            Explore training scope
          </a>
        </div>
      </section>

      <section id="pillars" className={styles.pillarsGrid}>
        {trainingPillars.map((pillar) => (
          <article key={pillar.title} className={styles.pillarCard}>
            <p className={styles.pillarEmoji} aria-hidden>
              {pillar.emoji}
            </p>
            <h2 className={styles.pillarTitle}>{pillar.title}</h2>
            <p className={styles.pillarBody}>{pillar.description}</p>
            <p className={styles.pillarDetail}>{pillar.detail}</p>
          </article>
        ))}
      </section>

      <section className={styles.checklist}>
        <h2 className={styles.checklistTitle}>Deployment checklist</h2>
        <p className={styles.checklistText}>Roll out the programme with a clean, repeatable operator flow.</p>
        <ol className={styles.list}>
          {implementationSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
