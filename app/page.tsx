import ModuleCard from '@/components/ui/ModuleCard';
import { modules } from '@/lib/data/modules';

const moduleCategories = [
  {
    id: 'history',
    label: 'History & Culture',
    emoji: '🏛️',
    color: 'from-rose-500 to-pink-600',
    border: 'border-rose-400',
    bg: 'bg-rose-50',
    ids: ['history', 'orishas'],
  },
  {
    id: 'stem',
    label: 'Science & Maths',
    emoji: '🔬',
    color: 'from-blue-500 to-indigo-600',
    border: 'border-blue-400',
    bg: 'bg-blue-50',
    ids: ['maths', 'chemistry', 'pool-maintenance', 'physics', 'biology'],
  },
  {
    id: 'literacy',
    label: 'Language & Literacy',
    emoji: '📝',
    color: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-400',
    bg: 'bg-emerald-50',
    ids: ['english', 'etymology'],
  },
  {
    id: 'lifeskills',
    label: 'Life Skills & Wellbeing',
    emoji: '🌱',
    color: 'from-amber-500 to-orange-600',
    border: 'border-amber-400',
    bg: 'bg-amber-50',
    ids: ['financial-literacy', 'food-nutrition', 'wellbeing'],
  },
];

const stats = [
  { value: '12', label: 'Modules' },
  { value: '100+', label: 'Lessons' },
  { value: '4', label: 'Subject Areas' },
  { value: '∞', label: 'Curiosity' },
];

const dailySchedule = [
  { time: '9:00–9:30', activity: 'Check-in, stretch, plan the day' },
  { time: '9:30–11:00', activity: 'Main focus (English / Maths)' },
  { time: '11:00–11:30', activity: 'Break / snack / quick walk' },
  { time: '11:30–13:00', activity: 'Second focus (Science / Computing)' },
  { time: '13:00–14:00', activity: 'Lunch & reset' },
  { time: '14:00–15:00', activity: 'Creative / Practical (Art, Music, PSHE)' },
  { time: '15:00–16:00', activity: 'Reflection, journalling, or community task' },
];

const subjectTips = [
  {
    subject: 'English Language & Literature',
    emoji: '📖',
    tip: 'Read widely; discuss themes & characters; keep a reading journal; write short reviews. Rotate: one week creative writing, next week non-fiction/essay. Use History Quest stories as reading material!',
  },
  {
    subject: 'Mathematics',
    emoji: '🔢',
    tip: 'Use real-life problems: cooking ratios, home budgeting, map scales. Short daily practice beats long cramming. Mix videos + problems + talk-throughs.',
  },
  {
    subject: 'Science',
    emoji: '⚗️',
    tip: 'Home experiments + virtual labs (e.g., PhET). Keep a lab log: question → method → result → what we learned. Visit museums when you can.',
  },
  {
    subject: 'Languages',
    emoji: '🌍',
    tip: 'Daily 10 minutes of vocab + 10 minutes speaking/listening. Label objects at home. Watch short videos with subtitles; write tiny dialogues.',
  },
  {
    subject: 'Computing & Digital Skills',
    emoji: '💻',
    tip: 'Create a simple website or blog. Discuss online safety & digital footprints. Try a coding project (Scratch/Python) with a clear, fun goal.',
  },
  {
    subject: 'Art, Design & Media',
    emoji: '🎨',
    tip: 'Keep a sketchbook. Explore photography walks. Try upcycling or poster design. Share finished pieces in a portfolio folder.',
  },
  {
    subject: 'PSHE & Wellbeing',
    emoji: '🌈',
    tip: 'Weekly check-in: mood, stress, wins. Practise mindfulness/light exercise. Cook together; talk about healthy habits & friendships. Use Whisper Garden for gentle confidence building.',
  },
];

const resources = [
  { label: 'GOV.UK Home Education', href: 'https://www.gov.uk/home-education', emoji: '🏛️' },
  {
    label: 'Croydon Council',
    href: 'https://www.croydon.gov.uk/schools-and-education/parents/educating-your-child-home',
    emoji: '🏙️',
  },
  {
    label: 'Oak National Academy',
    href: 'https://classroom.thenational.academy/',
    emoji: '🌳',
  },
  { label: 'BBC Bitesize', href: 'https://www.bbc.co.uk/bitesize', emoji: '📡' },
  {
    label: 'Financial Education',
    href: 'https://www.bankofengland.co.uk/education/education-resources',
    emoji: '💷',
  },
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* ── Hero ── */}
      <header className="relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 p-8 md:p-12 text-center">
        {/* decorative blobs */}
        <div
          aria-hidden
          className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-indigo-200/40 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-purple-200/40 blur-3xl pointer-events-none"
        />

        <div className="relative">
          <div className="text-6xl mb-4">🌷</div>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-3 leading-tight">
            Cronx Academy
          </h1>
          <p className="text-lg md:text-xl text-purple-700 font-semibold mb-1">
            Sheena&apos;s Homeschool Teaching Guide for Thalia
          </p>
          <p className="text-gray-500 italic mb-8">
            Age 14 · Croydon, UK · Learning together, growing together 💛
          </p>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-indigo-50 rounded-2xl py-4 px-2">
                <p className="text-3xl font-extrabold text-indigo-600">{s.value}</p>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Nav CTAs */}
          <nav className="flex flex-wrap gap-3 justify-center">
            <a
              href="#modules"
              className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              📚 Modules
            </a>
            <a
              href="#guide"
              className="bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              📖 Teaching Guide
            </a>
            <a
              href="#resources"
              className="bg-white border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-full font-bold hover:bg-indigo-50 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              🔗 Resources
            </a>
          </nav>
        </div>
      </header>

      {/* ── Modules by Category ── */}
      <section id="modules" className="scroll-mt-6 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-2">
            🎯 Interactive Learning Modules
          </h2>
          <p className="text-white/80 text-lg">Click any module to start learning!</p>
        </div>

        {moduleCategories.map((cat) => {
          const catModules = modules.filter((m) => cat.ids.includes(m.id));
          if (catModules.length === 0) return null;
          return (
            <div key={cat.id}>
              {/* Category header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`flex items-center gap-2 bg-gradient-to-r ${cat.color} text-white px-5 py-2 rounded-full font-bold text-sm shadow-lg`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </div>
                <div className="flex-1 h-px bg-white/30" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {catModules.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Teaching Guide ── */}
      <section
        id="guide"
        className="scroll-mt-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8 md:p-10"
      >
        <h2 className="text-3xl font-extrabold text-indigo-600 mb-2">
          🧭 Teaching Guide for Sheena
        </h2>
        <p className="text-gray-500 mb-6 text-sm">Click any section to expand it.</p>

        {/* Welcome callout */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-400 rounded-2xl p-5 mb-6">
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-indigo-700">💛 Welcome & Encouragement:</strong> Dear Sheena,
            you don&apos;t need to be a professional teacher — just patient, curious, and willing to
            learn alongside Thalia. This guide helps you turn each day into an opportunity for
            connection and growth. Perfection isn&apos;t the goal; joy and progress are.
          </p>
        </div>

        <div className="space-y-3">
          {/* Your Role */}
          <details className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-bold text-gray-800 hover:bg-indigo-50 transition-colors list-none">
              <span>🌼 Your Role as a Home Educator</span>
              <span className="text-indigo-500 group-open:rotate-180 transition-transform duration-200 text-xl">
                ▾
              </span>
            </summary>
            <div className="px-6 pb-5 pt-1">
              <ul className="space-y-2 text-gray-700">
                {[
                  '📚 Provide full-time, suitable education (no need to follow the national curriculum)',
                  '🕰️ Keep a gentle 9–4 structure with movement and breaks',
                  '🌼 Encourage questions, choice, and creativity',
                  '💬 Flex when needed — interest-led detours are powerful',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>

          {/* Curriculum Overview */}
          <details className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-bold text-gray-800 hover:bg-indigo-50 transition-colors list-none">
              <span>📚 Curriculum Overview</span>
              <span className="text-indigo-500 group-open:rotate-180 transition-transform duration-200 text-xl">
                ▾
              </span>
            </summary>
            <div className="px-6 pb-5 pt-1 grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-bold text-gray-800 mb-2">Core Subjects:</p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  {[
                    'English – reading, writing, analysis',
                    'Maths – algebra, geometry, statistics',
                    'Science – biology, chemistry, physics',
                    'Language – French/Spanish daily practice',
                  ].map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <span className="text-indigo-500">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-2">Creative, Digital & Life Skills:</p>
                <ul className="space-y-1 text-gray-700 text-sm">
                  {[
                    'Computing & digital citizenship',
                    'Art, design & media',
                    'PSHE, wellbeing & physical activity',
                    'Community projects & volunteering',
                  ].map((s) => (
                    <li key={s} className="flex items-start gap-2">
                      <span className="text-indigo-500">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>

          {/* Daily Routine */}
          <details className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-bold text-gray-800 hover:bg-indigo-50 transition-colors list-none">
              <span>🌞 Daily Routine (9:00 – 16:00)</span>
              <span className="text-indigo-500 group-open:rotate-180 transition-transform duration-200 text-xl">
                ▾
              </span>
            </summary>
            <div className="px-6 pb-5 pt-1">
              <div className="space-y-2">
                {dailySchedule.map((slot, i) => (
                  <div
                    key={slot.time}
                    className={`flex gap-4 items-center rounded-xl px-4 py-3 ${i % 2 === 0 ? 'bg-indigo-50' : 'bg-white border border-gray-100'}`}
                  >
                    <span className="text-indigo-600 font-mono font-bold text-sm whitespace-nowrap w-28 flex-shrink-0">
                      {slot.time}
                    </span>
                    <span className="text-gray-700 text-sm">{slot.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </details>

          {/* Subject Tips */}
          <details className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
            <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-bold text-gray-800 hover:bg-indigo-50 transition-colors list-none">
              <span>🪄 Subject-by-Subject Tips</span>
              <span className="text-indigo-500 group-open:rotate-180 transition-transform duration-200 text-xl">
                ▾
              </span>
            </summary>
            <div className="px-6 pb-5 pt-2 grid md:grid-cols-2 gap-4">
              {subjectTips.map((tip) => (
                <div key={tip.subject} className="bg-white rounded-xl border border-gray-100 p-4">
                  <p className="font-bold text-gray-800 mb-1">
                    {tip.emoji} {tip.subject}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">{tip.tip}</p>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* ── Resources ── */}
      <section
        id="resources"
        className="scroll-mt-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8 md:p-10"
      >
        <h2 className="text-3xl font-extrabold text-indigo-600 mb-2">🔗 Helpful Resources</h2>
        <p className="text-gray-500 mb-6">External links to support your homeschooling journey.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {resources.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gradient-to-br from-indigo-600 to-purple-700 text-white px-5 py-4 rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-800 hover:-translate-y-1 hover:shadow-xl transition-all"
            >
              <span className="text-2xl">{r.emoji}</span>
              <span>{r.label}</span>
            </a>
          ))}
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-2xl p-5">
          <p className="text-gray-700">
            <strong className="text-amber-700">🏛️ Local Cultural Resources:</strong>
            <br />
            Museum of Croydon, Historic Croydon Airport, and Croydon libraries offer great learning
            opportunities for history and community engagement.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center text-white/80 py-6 text-sm space-y-1">
        <p>🌸 Curriculum design and materials compiled by Oris John-Baptiste, 2025</p>
        <p className="text-white/60 text-xs">
          Built with love for Thalia&apos;s learning journey 💛
        </p>
      </footer>
    </div>
  );
}
