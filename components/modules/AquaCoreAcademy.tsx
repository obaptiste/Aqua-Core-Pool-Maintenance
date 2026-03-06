'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const completion = useMemo(
    () => academyCompletionPercentage(poolMaintenanceModules, quizResults),
    [quizResults],
  );
  const completedAcademy = useMemo(
    () => hasCompletedAcademy(poolMaintenanceModules, quizResults),
    [quizResults],
  );

  const certificateNumber = useMemo(() => {
    if (!sessionUser || !completedAcademy) return null;
    return createCertificateNumber(sessionUser.name, new Date());
  }, [sessionUser, completedAcademy]);

  const activeModule = poolMaintenanceModules.find((module) => module.id === openModuleId);

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
      setQuizFeedback((current) => ({
        ...current,
        [moduleId]: 'Please choose an answer before submitting.',
      }));
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

  const signOut = () => {
    logoutUser();
    setSessionUser(null);
    setAuthMessage('Signed out.');
  };

  if (!sessionUser) {
    return (
      <section className="max-w-2xl mx-auto p-6 md:p-10 bg-white rounded-3xl shadow-xl border border-slate-200">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">AquaCore Academy Access</h1>
        <p className="text-slate-600 mb-6">
          Sign in to continue your certified pool maintenance training programme.
        </p>

        <form onSubmit={submitAuth} className="space-y-4">
          {!isLoginMode && (
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3"
              placeholder="Full name"
              required
            />
          )}
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
            placeholder="Work email"
            required
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="w-full border border-slate-300 rounded-xl px-4 py-3"
            placeholder="Password"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-xl px-5 py-3 font-semibold"
          >
            {isLoginMode ? 'Sign in to AquaCore Academy' : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsLoginMode((current) => !current);
            setAuthMessage('');
          }}
          className="mt-4 text-cyan-700 font-medium"
        >
          {isLoginMode ? 'Need an account? Register now' : 'Already registered? Sign in'}
        </button>

        {authMessage && <p className="mt-4 text-sm text-slate-700">{authMessage}</p>}
      </section>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-slate-200 z-20">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-700 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header className="bg-gradient-to-r from-slate-900 via-cyan-900 to-blue-900 text-white rounded-3xl p-8 shadow-2xl mt-3">
        <div className="flex flex-wrap justify-between gap-4 items-start">
          <div>
            <p className="uppercase tracking-[0.2em] text-cyan-200 text-xs">Professional training</p>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-2">AquaCore Academy</h1>
            <p className="text-cyan-100 mt-3 max-w-2xl">
              UK-compliant pool operations programme with 12 modules, practical drills, instant
              knowledge checks, and completion certification.
            </p>
          </div>
          <div className="text-right">
            <p className="text-cyan-100 text-sm">Signed in as</p>
            <p className="font-semibold">{sessionUser.name}</p>
            <button type="button" onClick={signOut} className="mt-2 text-sm text-cyan-200 underline">
              Sign out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-cyan-100 uppercase">Modules</p>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-cyan-100 uppercase">Regulations</p>
            <p className="text-2xl font-bold">UK Focused</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-cyan-100 uppercase">Completion</p>
            <p className="text-2xl font-bold">{completion}%</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-cyan-100 uppercase">Certificate</p>
            <p className="text-2xl font-bold">{completedAcademy ? 'Unlocked' : 'In progress'}</p>
          </div>
        </div>
      </header>

      <section className="grid gap-4">
        {poolMaintenanceModules.map((module) => {
          const isOpen = module.id === openModuleId;
          const selectedAnswer = quizAnswers[module.id];

          return (
            <article key={module.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm">
              <button
                type="button"
                onClick={() => setOpenModuleId(isOpen ? '' : module.id)}
                className="w-full px-5 py-4 text-left flex flex-wrap justify-between items-center gap-2"
              >
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{module.title}</h2>
                  <p className="text-sm text-slate-600">Duration: {module.duration}</p>
                </div>
                <span className="text-sm font-medium text-cyan-700">{isOpen ? 'Hide module' : 'Open module'}</span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {module.regulatoryFocus.map((regulation) => (
                      <span
                        key={regulation}
                        className="text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200 rounded-full px-3 py-1"
                      >
                        {regulation}
                      </span>
                    ))}
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    {showSimple[module.id] ? makeSimple(module.overview) : module.overview}
                  </p>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleSpeech(module.id)}
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {activeSpeechId === module.id ? '⏹ Stop' : '🔊 Read aloud'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setShowSimple((current) => ({ ...current, [module.id]: !current[module.id] }))
                      }
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-violet-100 text-violet-800"
                    >
                      ✨ {showSimple[module.id] ? 'Show technical copy' : 'Simplify'}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Step-by-step procedures</h3>
                    <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                      {module.procedures.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="font-semibold text-slate-900 mb-2">Knowledge check</p>
                    <p className="text-sm text-slate-700 mb-3">{module.quiz.question}</p>
                    <div className="space-y-2">
                      {module.quiz.options.map((option, index) => (
                        <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="radio"
                            name={`quiz-${module.id}`}
                            checked={selectedAnswer === index}
                            onChange={() =>
                              setQuizAnswers((current) => ({
                                ...current,
                                [module.id]: index,
                              }))
                            }
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => submitQuiz(module.id)}
                      className="mt-3 px-4 py-2 rounded-lg bg-cyan-700 text-white text-sm font-semibold"
                    >
                      Submit answer
                    </button>
                    {quizFeedback[module.id] && (
                      <p className="mt-3 text-sm text-slate-700">{quizFeedback[module.id]}</p>
                    )}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Maintenance cadence planner</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-3 border border-slate-200">Frequency</th>
                <th className="p-3 border border-slate-200">Core tasks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-slate-200 font-semibold">Daily</td>
                <td className="p-3 border border-slate-200">{maintenanceCadence.daily.join(' • ')}</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-semibold">Weekly</td>
                <td className="p-3 border border-slate-200">{maintenanceCadence.weekly.join(' • ')}</td>
              </tr>
              <tr>
                <td className="p-3 border border-slate-200 font-semibold">Monthly</td>
                <td className="p-3 border border-slate-200">{maintenanceCadence.monthly.join(' • ')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-rose-900 mb-3">Emergency quick-reference</h2>
        <ul className="list-disc pl-5 text-rose-900 space-y-2">
          {emergencyActions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {completedAcademy && sessionUser && (
        <section className="bg-white rounded-3xl border-4 border-cyan-200 p-8 text-center shadow-lg">
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-700">Completion certificate</p>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-2">AquaCore Academy</h2>
          <p className="text-slate-600 mt-3">This certifies that</p>
          <p className="text-3xl font-bold text-cyan-800 mt-1">{sessionUser.name}</p>
          <p className="text-slate-600 mt-3">has successfully completed all 12 modules in Pool Maintenance Operations.</p>
          <p className="text-xs text-slate-500 mt-6">Certificate No: {certificateNumber}</p>
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-6 px-5 py-3 rounded-xl bg-cyan-700 text-white font-semibold"
          >
            Print certificate
          </button>
        </section>
      )}
    </div>
  );
}
