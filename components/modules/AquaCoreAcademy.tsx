'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import styles from './AquaCoreAcademy.module.css';
import {
  getDemoUserCredentials,
  getSessionUser,
  loginUser,
  logoutUser,
  registerUser,
  type AcademyUser,
} from '@/lib/aquacoreAuth';
import { poolMaintenanceModules } from '@/lib/data/poolMaintenanceModules';
import {
  academyCompletionPercentage,
  createCertificateNumber,
  hasCompletedAcademy,
} from '@/lib/aquacoreProgress';

const maintenanceCadence = {
  daily: [
    'Check free chlorine, combined chlorine, pH, temperature and visibility',
    'Inspect plant room for leaks, unusual noise, or alarm states',
    'Confirm dosing day tanks and PPE availability',
  ],
  weekly: [
    'Trend review of pressure, turnover, and dosing demand',
    'Backwash record audit and environmental discharge review',
    'Calibration verification of dosing probes and handheld kits',
  ],
  monthly: [
    'Mini-audit aligned to HSG179 + PWTAG controls',
    'Emergency drill rehearsal (contamination, chemical spill, pump failure)',
    'Corrective action closure review with operations leadership',
  ],
};

const emergencyActions = [
  'Faecal/vomit contamination: isolate water, apply incident treatment protocol, and notify duty manager.',
  'Chemical splash/exposure: follow SDS first-aid guidance and call emergency services where required.',
  'Major leak or pump failure: isolate relevant line, protect electrical equipment, and escalate engineering response.',
  'Suspected electrical hazard: stop work, keep area clear, and lock off until competent electrician confirms safety.',
];

function makeSimple(text: string): string {
  return text
    .replaceAll('differential pressure', 'pressure difference across the filter')
    .replaceAll('microbiological', 'germ-related')
    .replaceAll('dechlorination', 'chlorine removal')
    .replaceAll('escalate', 'report quickly')
    .replaceAll('operational', 'day-to-day')
    .replaceAll('residuals', 'leftover safe levels');
}

export default function AquaCoreAcademy() {
  const [sessionUser, setSessionUser] = useState<Pick<AcademyUser, 'name' | 'email'> | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authMessage, setAuthMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(getDemoUserCredentials().email);
  const [password, setPassword] = useState(getDemoUserCredentials().password);
  const [openModuleId, setOpenModuleId] = useState(poolMaintenanceModules[0]?.id ?? '');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});
  const [quizFeedback, setQuizFeedback] = useState<Record<string, string>>({});
  const [showSimple, setShowSimple] = useState<Record<string, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  useEffect(() => {
    setSessionUser(getSessionUser());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? Math.round((window.scrollY / documentHeight) * 100) : 0;
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const completion = useMemo(() => academyCompletionPercentage(poolMaintenanceModules, quizResults), [quizResults]);
  const completedAcademy = useMemo(() => hasCompletedAcademy(poolMaintenanceModules, quizResults), [quizResults]);

  const certificateNumber = useMemo(() => {
    if (!sessionUser || !completedAcademy) return null;
    return createCertificateNumber(sessionUser.name, new Date());
  }, [sessionUser, completedAcademy]);

  const submitAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = isLoginMode
      ? loginUser(email, password)
      : registerUser({ name: name.trim(), email: email.trim(), password });

    setAuthMessage(result.message);
    if (result.ok) {
      setSessionUser(getSessionUser());
      setPassword('');
    }
  };

  const submitQuiz = (moduleId: string) => {
    const module = poolMaintenanceModules.find((item) => item.id === moduleId);
    if (!module) return;

    const selectedAnswer = quizAnswers[moduleId];
    if (selectedAnswer === undefined) {
      setQuizFeedback((current) => ({ ...current, [moduleId]: 'Please choose an answer before submitting.' }));
      return;
    }

    const passed = selectedAnswer === module.quiz.correctIndex;
    setQuizResults((current) => ({ ...current, [moduleId]: passed }));
    setQuizFeedback((current) => ({
      ...current,
      [moduleId]: passed ? `✅ Correct. ${module.quiz.explanation}` : `❌ Not quite. ${module.quiz.explanation}`,
    }));
  };

  const toggleSpeech = (moduleId: string) => {
    const module = poolMaintenanceModules.find((item) => item.id === moduleId);
    if (!module || typeof window === 'undefined' || !window.speechSynthesis) return;

    if (activeSpeechId === moduleId) {
      window.speechSynthesis.cancel();
      setActiveSpeechId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const message = `${module.title}. ${module.overview}. Key procedures: ${module.procedures.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.93;
    utterance.pitch = 1;
    utterance.lang = 'en-GB';
    utterance.onend = () => setActiveSpeechId(null);

    setActiveSpeechId(moduleId);
    window.speechSynthesis.speak(utterance);
  };

  if (!sessionUser) {
    const demoCreds = getDemoUserCredentials();

    return (
      <section className={styles.page}>
        <article className={styles.authCard}>
          <h1>AquaCore Academy Access</h1>
          <p>Sign in to continue your certified pool maintenance training programme.</p>
          <form onSubmit={submitAuth} className={styles.form}>
            {!isLoginMode && (
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={styles.input}
                placeholder="Full name"
                required
              />
            )}
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className={styles.input}
              placeholder="Work email"
              required
            />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className={styles.input}
              placeholder="Password"
              required
            />
            <button type="submit" className={styles.button}>
              {isLoginMode ? 'Sign in to AquaCore Academy' : 'Create account'}
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode((current) => !current);
              setAuthMessage('');
            }}
            className={styles.ghost}
          >
            {isLoginMode ? 'Need an account? Register now' : 'Already registered? Sign in'}
          </button>

          {authMessage && <p className={styles.helper}>{authMessage}</p>}

          <p className={styles.demo}>
            Demo login: <strong>{demoCreds.email}</strong> / <strong>{demoCreds.password}</strong>
          </p>
        </article>
      </section>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.progressTrack}>
        <div className={styles.progressBar} style={{ width: `${scrollProgress}%` }} />
      </div>

      <header className={styles.hero}>
        <p className={styles.eyebrow}>Professional training</p>
        <h1>AquaCore Academy</h1>
        <p>
          UK-compliant pool operations programme with 12 modules, practical drills, instant knowledge checks,
          and completion certification.
        </p>
        <div className={styles.heroMeta}>
          <div className={styles.metaCard}>
            <small>Signed in as</small>
            <strong>{sessionUser.name}</strong>
          </div>
          <div className={styles.metaCard}>
            <small>Progress</small>
            <strong>{completion}%</strong>
          </div>
          <div className={styles.metaCard}>
            <small>Modules</small>
            <strong>{poolMaintenanceModules.length}</strong>
          </div>
          <div className={styles.metaCard}>
            <small>Session</small>
            <button
              type="button"
              className={styles.ghost}
              onClick={() => {
                logoutUser();
                setSessionUser(null);
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <section className={styles.panel}>
        {poolMaintenanceModules.map((module) => {
          const open = openModuleId === module.id;
          const selectedAnswer = quizAnswers[module.id];

          return (
            <article key={module.id} className={styles.moduleCard}>
              <div className={styles.moduleHeader}>
                <div>
                  <h2>{module.title}</h2>
                  <p>{module.duration}</p>
                </div>
                <button
                  type="button"
                  className={styles.smallBtn}
                  onClick={() => setOpenModuleId(open ? '' : module.id)}
                >
                  {open ? 'Collapse' : 'Open'}
                </button>
              </div>

              {open && (
                <>
                  <div className={styles.badges}>
                    {module.regulatoryFocus.map((regulation) => (
                      <span key={regulation} className={styles.badge}>
                        {regulation}
                      </span>
                    ))}
                  </div>

                  <p>{showSimple[module.id] ? makeSimple(module.overview) : module.overview}</p>

                  <div className={styles.actions}>
                    <button type="button" className={styles.smallBtn} onClick={() => toggleSpeech(module.id)}>
                      {activeSpeechId === module.id ? '⏹ Stop' : '🔊 Read aloud'}
                    </button>
                    <button
                      type="button"
                      className={styles.smallBtn}
                      onClick={() => setShowSimple((current) => ({ ...current, [module.id]: !current[module.id] }))}
                    >
                      {showSimple[module.id] ? 'Show technical copy' : 'Simplify'}
                    </button>
                  </div>

                  <ol className={styles.list}>
                    {module.procedures.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>

                  <div className={styles.quiz}>
                    <p>{module.quiz.question}</p>
                    <div className={styles.options}>
                      {module.quiz.options.map((option, index) => (
                        <label key={option}>
                          <input
                            type="radio"
                            name={`quiz-${module.id}`}
                            checked={selectedAnswer === index}
                            onChange={() => setQuizAnswers((current) => ({ ...current, [module.id]: index }))}
                          />{' '}
                          {option}
                        </label>
                      ))}
                    </div>
                    <button type="button" className={styles.quizBtn} onClick={() => submitQuiz(module.id)}>
                      Submit answer
                    </button>
                    {quizFeedback[module.id] && <p className={styles.helper}>{quizFeedback[module.id]}</p>}
                  </div>
                </>
              )}
            </article>
          );
        })}
      </section>

      <section className={styles.quickRef}>
        <h2>Maintenance cadence planner</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Frequency</th>
              <th>Core tasks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Daily</td>
              <td>{maintenanceCadence.daily.join(' • ')}</td>
            </tr>
            <tr>
              <td>Weekly</td>
              <td>{maintenanceCadence.weekly.join(' • ')}</td>
            </tr>
            <tr>
              <td>Monthly</td>
              <td>{maintenanceCadence.monthly.join(' • ')}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className={styles.quickRef}>
        <h2>Emergency quick-reference</h2>
        <ul className={styles.alerts}>
          {emergencyActions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {completedAcademy && sessionUser && (
        <section className={styles.cert}>
          <p>Completion certificate</p>
          <h2>AquaCore Academy</h2>
          <p>This certifies that</p>
          <h3>{sessionUser.name}</h3>
          <p>has successfully completed all 12 modules in Pool Maintenance Operations.</p>
          <small>Certificate No: {certificateNumber}</small>
        </section>
      )}
    </div>
  );
}
