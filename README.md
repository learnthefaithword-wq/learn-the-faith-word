
# Learn The Faith Word - Starter (LearnTheFaithWord.com)

This repo contains a ready-to-run starter for a multilingual faith-based learning platform.
It includes a React frontend and a simple Node/Express backend (API proxy for Bible lookups and time tracking).

## What's included
- frontend/ : Vite React starter (src/App.jsx main file)
- server/ : Node/Express backend with /api/track and /api/bible proxy
- translations/ : CSV templates (not yet populated)
- README with deploy steps (this file)

## Quick local run (development)
1. Frontend:
   - cd frontend
   - npm install
   - Create a .env file with VITE_BIBLE_API_ENDPOINT and VITE_BIBLE_API_KEY if you want Bible lookups
   - npm run dev (Vite will start at http://localhost:5173)

2. Backend:
   - cd server
   - npm install
   - Copy .env.example to .env and edit BIBLE_API_ENDPOINT/BIBLE_API_KEY
   - node server.js (API server starts on port 8080)

3. To connect frontend to backend during dev, proxy API calls:
   - In development you can run both servers and configure axios base URL to http://localhost:8080

## Deploying to Vercel (recommended)
1. Create a GitHub repository and push the contents.
2. Sign in to Vercel and import the GitHub repository.
3. Set environment variables in Vercel project settings (Frontend):
   - VITE_BIBLE_API_ENDPOINT -> https://your-backend-or-bible-provider/endpoint
   - VITE_BIBLE_API_KEY -> (if needed)
4. Deploy the frontend. For the backend:
   - Option A: Deploy server/ as a separate project on Render, Heroku, or Vercel (Serverless Functions)
   - Option B: Deploy server/ to a small VPS or Docker host and set BIBLE_API_ENDPOINT to point to it.
5. (Optional) Add Weglot or other translation service: paste the Weglot snippet in index.html head and set your Weglot API key in their dashboard.

## Connect your custom domain (LearnTheFaithWord.com)
1. Buy the domain (Namecheap, Google Domains, etc.).
2. In Vercel dashboard -> Domains -> Add -> enter LearnTheFaithWord.com.
3. Follow Vercel's DNS instructions (create A/ALIAS / CNAME records with your domain registrar).
4. Once Vercel validates, your site will be served from LearnTheFaithWord.com.

## Transfer ownership / take control
- I can create a GitHub repository and deploy to Vercel for you, but I cannot manage billing or long-term domain purchase.
- After deployment I will provide repository and project links and you can take ownership via GitHub/Vercel transfer UI.

## Notes & Next steps I can help with
- Wire a paid Bible API provider and map multi-version codes.
- Configure Stripe subscriptions and webhook endpoints.
- Set up Weglot + human translators for Yoruba, Hausa, Igbo, Hindi, Arabic, and Indian languages.
- Create initial course content and upload videos (I can help craft course scripts).

If you'd like, I can now prepare a GitHub repo and Vercel deployment bundle. I cannot push to your GitHub from this environment, but I can produce a zip archive you can upload, or I can guide you step-by-step to deploy it. 
