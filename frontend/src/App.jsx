/*
App.jsx - LearnTheFaithWord frontend starter (single-file)
See README for full instructions.
*/
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const resources = {
  en: { translation: {
      siteTitle: 'Learn The Faith Word',
      tagline: 'Grow in faith — learn, heal, and serve',
      courses: 'Courses',
      dashboard: 'Dashboard',
      hoursStudied: 'Hours studied',
      startLesson: 'Start Lesson',
      bibleVerses: 'Bible Verses',
      selectVersion: 'Select Bible Version',
      selectLanguage: 'Select language',
      donate: 'Donate',
      login: 'Login',
      logout: 'Logout'
  }},
  yo: { translation: {
      siteTitle: 'Ẹkọ Ọrọ Igbagbọ',
      tagline: 'Dagbasoke ninu igbagbọ — kọ́, wòsàn, kí o sì sin',
      courses: 'Ẹ̀kọ́',
      dashboard: 'Àkọsílẹ̀',
      hoursStudied: 'Wákàtí tí a kẹ́kọ̀ọ́',
      startLesson: 'Bẹrẹ Ẹ̀kọ́',
      bibleVerses: 'Ìtàn Bibeli',
      selectVersion: 'Yan Àtúnṣe Bibeli',
      selectLanguage: 'Yan Èdè',
      donate: 'Fúnni',
      login: 'Wọlé',
      logout: 'Jáde'
  }},
  ha: { translation: {
      siteTitle: 'Makarantar Imani',
      tagline: 'Girma a cikin bangaskiya — koyi, warke, ka yi hidima',
      courses: 'Kursuna',
      dashboard: 'Dashboard',
      hoursStudied: 'Awannin da aka yi nazari',
      startLesson: 'Fara Koyo',
      bibleVerses: 'Ayoyin Littafi Mai Tsarki',
      selectVersion: 'Zaɓi Nau\'in Bible',
      selectLanguage: 'Zaɓi Harshe',
      donate: 'Gudummawa',
      login: 'Shiga',
      logout: 'Fita'
  }},
  ig: { translation: {
      siteTitle: 'Mụta Okwu N&#39;okwukwe',
      tagline: 'Too nʼokwukwe — mụta, gwọọ, rụọ ọrụ',
      courses: 'Ụmụnọmụ',
      dashboard: 'Dashboard',
      hoursStudied: 'Ewela awa ịmụ',
      startLesson: 'Malite Nkuzi',
      bibleVerses: 'Akwụkwọ Nsọ',
      selectVersion: 'Họrọ Nsụgharị Bible',
      selectLanguage: 'Họrọ Asụsụ',
      donate: 'Nye onyinye',
      login: 'Banye',
      logout: 'Pụọ'
  }},
  ar: { translation: {
      siteTitle: 'تعلم كلمة الإيمان',
      tagline: 'ازدهر في الإيمان — تعلّم، شُف، وخدم',
      courses: 'الدورات',
      dashboard: 'اللوحة',
      hoursStudied: 'ساعات الدراسة',
      startLesson: 'ابدأ الدرس',
      bibleVerses: 'آيات الكتاب المقدس',
      selectVersion: 'اختر نسخة الكتاب المقدس',
      selectLanguage: 'اختر اللغة',
      donate: 'تبرع',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج'
  }},
  hi: { translation: {
      siteTitle: 'विश्वास शब्द सीखें',
      tagline: 'विश्वास में बढ़ो — सीखो, स्वस्थ हो, और सेवा करो',
      courses: 'पाठ्यक्रम',
      dashboard: 'डैशबोर्ड',
      hoursStudied: 'अध्ययन घंटे',
      startLesson: 'पाठ आरंभ करें',
      bibleVerses: 'बाइबल श्लोक',
      selectVersion: 'बाइबल संस्करण चुनें',
      selectLanguage: 'भाषा चुनें',
      donate: 'दान करें',
      login: 'लॉगिन',
      logout: 'लॉगआउट'
  }}
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

const SAMPLE_COURSES = [
  { id: 'c1', titleKey: 'Healing by Faith in Christ', durationsHours: 5, lessons: [
    { id: 'c1l1', title: 'Introduction & Biblical Foundation', lengthMin: 12, videoUrl: '' },
    { id: 'c1l2', title: 'Prayer Models for Healing', lengthMin: 25, videoUrl: '' }
  ]},
  { id: 'c2', titleKey: 'Inner Healing & Forgiveness', durationsHours: 6, lessons: [
    { id: 'c2l1', title: 'Why Forgiveness Matters', lengthMin: 18, videoUrl: '' }
  ]}
];

function useTimeTracker(userId) {
  const startRef = useRef(null);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const key = `fha_time_${userId || 'anon'}`;
    const saved = parseInt(localStorage.getItem(key) || '0', 10);
    setSeconds(saved);
  }, [userId]);

  const start = () => {
    if (intervalRef.current) return;
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => { setSeconds(s => s + 1); }, 1000);
  };
  const stop = async () => {
    if (!intervalRef.current) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    const key = `fha_time_${userId || 'anon'}`;
    localStorage.setItem(key, String(seconds));
    try { await axios.post('/api/track', { userId: userId || 'anon', seconds }); } catch (e) { console.warn('Tracking POST failed:', e.message); }
  };
  const reset = () => { setSeconds(0); const key = `fha_time_${userId || 'anon'}`; localStorage.setItem(key, '0'); };

  return { seconds, start, stop, reset };
}

function BibleIntegration({ language }) {
  const { t } = useTranslation();
  const [version, setVersion] = useState('ESV');
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState(3);
  const [verse, setVerse] = useState('16');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVerse = async () => {
    setLoading(true);
    try {
      const endpoint = import.meta.env.VITE_BIBLE_API_ENDPOINT || '';
      const apiKey = import.meta.env.VITE_BIBLE_API_KEY || '';
      if (!endpoint) { setResult({ text: 'No Bible API endpoint configured. Please set VITE_BIBLE_API_ENDPOINT in .env' }); setLoading(false); return; }
      const resp = await axios.get('/api/bible', { params: { book, chapter, verse, version, lang: language } });
      const text = resp.data?.text || resp.data?.content || JSON.stringify(resp.data);
      setResult({ text });
    } catch (err) { setResult({ text: 'Error fetching verse: ' + (err.message || String(err)) }); } finally { setLoading(false); }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="text-lg font-semibold mb-2">{t('bibleVerses')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <select className="p-2 border rounded" value={version} onChange={e => setVersion(e.target.value)}>
          <option>ESV</option><option>KJV</option><option>NIV</option><option>NASB</option><option>WEB</option><option>YORUBA</option>
        </select>
        <input className="p-2 border rounded" value={book} onChange={e => setBook(e.target.value)} />
        <input className="p-2 border rounded" value={chapter} onChange={e => setChapter(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <input className="p-2 border rounded" value={verse} onChange={e => setVerse(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={fetchVerse} disabled={loading}>{loading ? 'Loading...' : 'Fetch'}</button>
      </div>
      <pre className="mt-3 p-3 bg-gray-50 rounded text-sm whitespace-pre-wrap">{result?.text}</pre>
      <p className="mt-2 text-xs text-gray-500">Tip: configure a Bible API endpoint and API key in your environment variables.</p>
    </div>
  );
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(SAMPLE_COURSES[0]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { seconds, start, stop, reset } = useTimeTracker(user?.id);

  const languageTagMap = { en: 'en', yo: 'yo', ha: 'ha', ig: 'ig', ar: 'ar', hi: 'hi' };

  useEffect(() => { if (selectedLesson) start(); else stop(); }, [selectedLesson]);

  const toggleLogin = () => { if (user) { setUser(null); stop(); } else { setUser({ id: 'user_1', name: 'Learner' }); } };
  const changeLanguage = (lng) => { i18n.changeLanguage(lng); };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div><h1 className="text-2xl font-bold">{t('siteTitle')}</h1><p className="text-sm text-gray-600">{t('tagline')}</p></div>
          <div className="flex items-center gap-3">
            <select onChange={(e)=>changeLanguage(e.target.value)} defaultValue={i18n.language} className="p-2 border rounded">
              <option value="en">English</option><option value="yo">Yorùbá</option><option value="ha">Hausa</option><option value="ig">Igbo</option><option value="ar">Arabic</option><option value="hi">Hindi</option>
            </select>
            <button onClick={toggleLogin} className="px-4 py-2 bg-emerald-600 text-white rounded">{user ? t('logout') : t('login')}</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <aside className="col-span-1">
          <div className="p-4 bg-white rounded shadow">
            <h2 className="font-semibold mb-2">{t('courses')}</h2>
            <ul className="space-y-2">{SAMPLE_COURSES.map(c => (<li key={c.id} className="p-2 border rounded hover:bg-slate-50"><div className="flex justify-between items-center"><div><div className="font-medium">{c.titleKey}</div><div className="text-xs text-gray-500">{c.durationsHours} hrs</div></div><button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={()=>{setSelectedCourse(c); setSelectedLesson(null);}}>View</button></div></li>))}</ul>
            <div className="mt-4"><h3 className="text-sm font-medium">{t('hoursStudied')}</h3><div className="text-2xl font-bold">{(seconds/3600).toFixed(2)}</div><div className="mt-2 flex gap-2"><button onClick={()=>reset()} className="px-3 py-1 border rounded">Reset</button></div></div>
          </div>

          <div className="mt-4 p-4 bg-white rounded shadow"><h3 className="font-semibold mb-2">{t('selectVersion')}</h3><p className="text-xs text-gray-600">Configure your preferred Bible versions in Settings (admin).</p></div>
        </aside>

        <section className="col-span-2">
          <div className="p-4 bg-white rounded shadow mb-4">
            <h2 className="text-xl font-semibold">{selectedCourse.titleKey}</h2>
            <p className="text-sm text-gray-600">{selectedCourse.durationsHours} hours • {selectedCourse.lessons.length} lessons</p>
            <div className="mt-3 grid gap-2">{selectedCourse.lessons.map(lesson => (<div key={lesson.id} className="p-3 border rounded flex justify-between items-center"><div><div className="font-medium">{lesson.title}</div><div className="text-xs text-gray-500">{lesson.lengthMin} min</div></div><div className="flex gap-2"><button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={()=>setSelectedLesson(lesson)}>{t('startLesson')}</button></div></div>))}</div>
          </div>

          {selectedLesson && (
            <div className="p-4 bg-white rounded shadow">
              <div className="flex justify-between items-start">
                <div><h3 className="text-lg font-semibold">{selectedLesson.title}</h3><div className="text-xs text-gray-500">{selectedLesson.lengthMin} minutes</div></div>
                <div className="text-sm text-gray-600">{user ? `Hello, ${user.name}` : 'Guest'}</div>
              </div>

              <div className="mt-4">
                <div className="bg-black/80 aspect-video rounded mb-3 flex items-center justify-center text-white">Video player placeholder</div>
                <div className="prose max-w-none"><p>Lesson content goes here. You can provide text, downloadable PDFs, and the Bible verse viewer below.</p></div>

                <div className="mt-4"><BibleIntegration language={languageTagMap[i18n.language] || 'en'} /></div>

                <div className="mt-4 flex gap-2"><button onClick={()=>setSelectedLesson(null)} className="px-4 py-2 border rounded">Close</button><button onClick={()=>{ stop(); }} className="px-4 py-2 bg-amber-600 text-white rounded">Mark Complete</button></div>
              </div>
            </div>
          )}

        </section>
      </main>

      <footer className="bg-white mt-6 py-4"><div className="max-w-6xl mx-auto px-4 text-sm text-gray-600 flex justify-between"><div>© {new Date().getFullYear()} Learn The Faith Word</div><div>Designed with care — Multilingual + Bible multi-version ready</div></div></footer>
    </div>
  );
}
