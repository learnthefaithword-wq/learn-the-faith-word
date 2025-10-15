require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const userTimes = {};
const courses = [
  { id: 'c1', title: 'Healing by Faith in Christ', durationsHours: 5 },
  { id: 'c2', title: 'Inner Healing & Forgiveness', durationsHours: 6 }
];

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/courses', (req, res) => res.json(courses));
app.post('/api/track', (req, res) => {
  const { userId = 'anon', seconds = 0 } = req.body;
  userTimes[userId] = (userTimes[userId] || 0) + Number(seconds || 0);
  return res.json({ ok: true, totalSeconds: userTimes[userId] });
});
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  const user = { id: `user_${username || '1'}`, name: username || 'Guest' };
  return res.json({ ok: true, user });
});
app.get('/api/bible', async (req, res) => {
  const { book = 'John', chapter = '3', verse = '16', version = 'ESV', lang = 'en' } = req.query;
  const endpoint = process.env.BIBLE_API_ENDPOINT;
  const key = process.env.BIBLE_API_KEY;
  if (!endpoint) return res.status(500).json({ error: 'No Bible API endpoint configured' });
  try {
    const url = new URL(endpoint);
    url.searchParams.set('book', book);
    url.searchParams.set('chapter', chapter);
    url.searchParams.set('verse', verse);
    url.searchParams.set('version', version);
    url.searchParams.set('lang', lang);
    const resp = await fetch(url.toString(), { headers: key ? { 'api-key': key } : {} });
    const data = await resp.json();
    const text = data.text || data.content || JSON.stringify(data);
    res.json({ ok: true, text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`FHA backend listening on ${PORT}`));