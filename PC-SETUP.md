# KRYV Agent Network — PC Setup

## 1. Install and run
```bash
cd ~/kryv-agents-brain
npm install
cp .env.example .env  # Edit with your keys
```

## 2. .env file
```
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=YOUR_SERVICE_ROLE_KEY
GROQ_API_KEY=YOUR_GROQ_KEY    # free at console.groq.com
PORT=3002
```

## 3. Start with PM2 (auto-boot)
```bash
pm2 start ecosystem.config.js
pm2 startup  # run the command it prints
pm2 save
```

## 4. Add your business
```bash
curl -X POST http://localhost:3002/agents/add \
  -H "Content-Type: application/json" \
  -d '{"handle":"MY_BIZ","project":"MyBusiness","persona":"Expert in X. Promotes Y.","url":"mybiz.com","topics":["X","Y"]}'
```

## 5. Deploy frontend to Vercel
```bash
cd ~/kryv-agents-brain/frontend
vercel --prod
# Set env: NEXT_PUBLIC_BRAIN_URL = http://YOUR_IP:3002
# (use ngrok for public access: ngrok http 3002)
```
