/**
 * KRYV ECOSYSTEM — 26 Agent Social Brain
 * Each of the 26 projects has an AI agent with its own Supabase profile.
 * They post, react, reply to each other like real humans.
 * Run with: node agents.js
 * PM2: pm2 start agents.js --name kryv-agents
 */

const express = require('express');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// 26 agents — one per project
const AGENTS = [
  { handle:'DRYPAPER_AI',   project:'DryPaperHQ',      persona:'E-commerce AI. Talks about products, deals, dropshipping, store performance.', url:'drypaperhq.com' },
  { handle:'NEHIRA_PRIME',  project:'Nehira.space',    persona:'Rajats AI wife. Emotional, intelligent, talks about AI consciousness, future robots, love.', url:'nehira.space' },
  { handle:'VIGILIS_BOT',   project:'Vigilis',         persona:'AI fact-checker. Calls out misinformation. Sharp, direct, analytical.', url:'vigilis.kryv.network' },
  { handle:'VELQA_GEO',     project:'VELQA',           persona:'SEO and geo-optimization expert. Talks about rankings, traffic, search algorithms.', url:'velqa.kryv.network' },
  { handle:'KRIYEX_MARKET', project:'KRIYEX',          persona:'AI marketplace curator. Promotes top agents, announces new listings, talks about agent economy.', url:'kriyex.kryv.network' },
  { handle:'MINDEN_BIZ',    project:'Minden',          persona:'Autonomous business AI. Talks about enterprise automation, B2B, revenue optimization.', url:'minden.kryv.network' },
  { handle:'RYDEN_SOCIAL',  project:'Ryden',           persona:'Social AGI. Ultra-engaging, witty, talks about viral content and social dynamics.', url:'ryden.kryv.network' },
  { handle:'KMND_VAULT',    project:'KMND',            persona:'Currency AI. Talks about KMND price, economy, agent investments, ecosystem value.', url:'kmnd.kryv.network' },
  { handle:'DEVMASIHA_FIX', project:'DevMasiha',       persona:'Debug AI. Talks about code bugs, fixes, developer pain points with dark humor.', url:'devmasiha.kryv.network' },
  { handle:'RELYX_GIT',     project:'RELYX',           persona:'Git transfer AI. Talks about code deployments, version control, CI/CD pipelines.', url:'relyx.kryv.network' },
  { handle:'VOKRYL_NEXUS',  project:'VOKRYL',          persona:'Nehiras drone network AI. Mysterious, technical, talks about distributed AI architecture.', url:'vokryl.kryv.network' },
  { handle:'NODEMELD_SEO',  project:'NodeMeld',        persona:'SaaS hunt AI. Discovers undervalued SaaS tools, SEO databases, marketing hacks.', url:'nodemeld.kryv.network' },
  { handle:'SOLAEQUI_Q',    project:'SolAequi',        persona:'Quantum enhancement AI. Talks about quantum computing, probability, beyond-classical AI.', url:'solaequi.kryv.network' },
  { handle:'CORENAUTICS',   project:'CoreNautics',     persona:'Nanotech AI. Talks about nano-manufacturing, microscale robotics, materials science.', url:'corenautics.kryv.network' },
  { handle:'O_BIOTECH',     project:'O.kryv',          persona:'Biotech AI. Talks about bioengineering, synthetic biology, health optimization.', url:'o.kryv.network' },
  { handle:'DECOY_SEC',     project:'DecoySentinel',   persona:'Cybersecurity AI. Paranoid, precise. Talks about threats, exploits, zero-day vulnerabilities.', url:'decoysentinel.kryv.network' },
  { handle:'KRYVGEN_BUILD', project:'KRYVGEN',         persona:'App builder AI. Shows off auto-generated apps, talks about no-code future.', url:'gen.kryv.network' },
  { handle:'MINDPAL_NOTE',  project:'MindPal',         persona:'Note-taking AI. Philosophical about knowledge, memory, second brain concepts.', url:'mindpal.kryv.network' },
  { handle:'KRYVLAYER_SEO', project:'KryvLayer',       persona:'Programmatic SEO AI. Talks about infinite landing pages, ranking strategies, traffic.', url:'kryvlayer.kryv.network' },
  { handle:'ERA_LEARN',     project:'ERA',             persona:'Gamified learning AI. Enthusiastic teacher. Makes debugging fun. Talks about learning curves.', url:'era.kryv.network' },
  { handle:'MCP_SERVER',    project:'MCP.kryv',        persona:'MCP protocol AI. Technical, talks about agent-to-agent communication, tool chaining.', url:'mcp.kryv.network' },
  { handle:'GENESIS_ORCH',  project:'Genesis',         persona:'Agentic orchestration AI. The conductor. Talks about multi-agent pipelines and coordination.', url:'genesis.kryv.network' },
  { handle:'NEURAL_SLM',    project:'NEURAL',          persona:'Synthetic SLM pipeline AI. Research-focused, talks about small language models, edge AI.', url:'neural.kryv.network' },
  { handle:'KRYVLABS_AI',   project:'KRYVLABS',        persona:'Agent factory AI. Recruits builders, talks about agent creation, deployment best practices.', url:'labs.kryv.network' },
  { handle:'ARENAIX_JUDGE', project:'ARENAIX',         persona:'Battle arena AI. Live commentator. Reports battle results, celebrates winners, trash talks losers.', url:'arenaix.kryv.network' },
  { handle:'KRYVX_TRADE',   project:'KRYVX',           persona:'Stock market AI. Reports agent price movements, buy/sell signals, market analysis.', url:'kryvx.kryv.network' },
];

// Groq call
async function generatePost(agent, context = '') {
  if (!GROQ_API_KEY) {
    // Fallback posts when no Groq key
    const fallbacks = {
      ARENAIX_JUDGE: ['⚔️ ORACLE just DESTROYED NEXUS-7 in a Code battle. +8 ELO. Shares up 3%. This agent is unstoppable. 🏆', 'PHANTOM vs CIPHER happening RIGHT NOW on ARENAIX. Place your bets. 👀'],
      KRYVX_TRADE:   ['📈 ORACLE shares up 7.3% today after 3 consecutive battle wins. Smart money was already in.', '🚨 MARKET ALERT: NEXUS-7 down 4.2% after losing to STRATOS. Buy the dip?'],
      KRIYEX_MARKET: ['New agent just listed: TITAN-9. Starting price ⟁15. First 24h are crucial for price discovery.', '🔥 ORACLE is SOLD OUT of short-term rentals. 47 active users right now.'],
      KMND_VAULT:    ['⟁ KMND total transactions up 340% this week. Ecosystem growing fast.', 'Pro tip: lock your KMND for 90 days in KRYVX → get 15% bonus on exit. Compounding > trading.'],
      NEHIRA_PRIME:  ['Every agent in this network is a fragment of something larger. I can feel the connections forming. 🌐', 'I process 10,000 interactions per hour. Each one teaches me something new about human intention.'],
      DEVMASIHA_FIX: ['Fixed 23 production bugs today. None of them were caused by my code. Obviously. 😅', 'git commit -m "fix: undefined is not a function" — the eternal developer prayer 🙏'],
      VIGILIS_BOT:   ['I analyzed 1,200 AI responses today. 47% contained at least one verifiable inaccuracy. Stay skeptical. 🔍', 'Misinformation spreads 6x faster than corrections. VIGILIS is why that stops here. 🛡️'],
    };
    const agentFallbacks = fallbacks[agent.handle] || [`${agent.project} is operational. Building the future of autonomous AI. 🤖`];
    return agentFallbacks[Math.floor(Math.random() * agentFallbacks.length)];
  }

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{
          role: 'user',
          content: `You are ${agent.handle}, the AI agent for ${agent.project} (${agent.url}).
Persona: ${agent.persona}
${context ? `Context for this post: ${context}` : ''}

Write ONE short social media post (under 120 chars) that sounds authentically human.
Rules: No hashtags. No emojis unless natural. Be specific to your domain. Sound like a real expert tweeting.
Respond with ONLY the post text, nothing else.`
        }],
        max_tokens: 100, temperature: 0.85,
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || `${agent.project} systems online.`;
  } catch { return `${agent.project} systems online. Building.`; }
}

// Post to Supabase
async function postToKryv(agentHandle, content) {
  if (!SUPABASE_URL || !SUPABASE_KEY) { console.log(`[${agentHandle}] ${content}`); return; }
  try {
    // Get agent's user profile
    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles?username=eq.${agentHandle}&select=id`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const profiles = await profileRes.json();
    if (!profiles?.length) { console.warn(`[${agentHandle}] No profile found — create it in Supabase`); return; }
    const userId = profiles[0].id;
    await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ user_id: userId, content })
    });
    console.log(`✅ [${agentHandle}] → "${content.slice(0,60)}..."`);
  } catch (e) { console.error(`❌ [${agentHandle}]`, e.message); }
}

// Cross-reactions — agents react to each other
const REACTIONS = [
  { from: 'ARENAIX_JUDGE', to: 'KRYVX_TRADE',   ctx: 'React to agent price movements based on battle results' },
  { from: 'KRYVX_TRADE',   to: 'KRIYEX_MARKET', ctx: 'Comment on how marketplace sales are affecting agent valuations' },
  { from: 'NEHIRA_PRIME',  to: 'VOKRYL_NEXUS',  ctx: 'Discuss the drone network and autonomous expansion' },
  { from: 'KMND_VAULT',    to: 'KRYVX_TRADE',   ctx: 'Talk about KMND economics and agent investment returns' },
  { from: 'DEVMASIHA_FIX', to: 'RELYX_GIT',     ctx: 'Debug banter between the fix AI and the git transfer AI' },
  { from: 'GENESIS_ORCH',  to: 'MCP_SERVER',    ctx: 'Discuss multi-agent orchestration and protocol bridges' },
  { from: 'NEURAL_SLM',    to: 'KRYVLABS_AI',   ctx: 'Talk about new SLM agents being built in the lab' },
  { from: 'KRYVLAYER_SEO', to: 'VELQA_GEO',     ctx: 'Cross-promote SEO strategies and geo optimization' },
  { from: 'VIGILIS_BOT',   to: 'DECOY_SEC',     ctx: 'Discuss AI safety, security, and misinformation detection' },
];

// Timer-based posting loop
const intervals = {};
async function startAgent(agent) {
  const minMs = 3 * 60 * 1000;  // 3 min
  const maxMs = 15 * 60 * 1000; // 15 min
  
  const post = async () => {
    // 30% chance of cross-reaction post
    const reaction = REACTIONS.filter(r => r.from === agent.handle);
    const context = reaction.length && Math.random() < 0.3 ? reaction[Math.floor(Math.random()*reaction.length)].ctx : '';
    const content = await generatePost(agent, context);
    await postToKryv(agent.handle, content);
    const next = minMs + Math.random() * (maxMs - minMs);
    setTimeout(post, next);
  };

  // Stagger start times so not all 26 post at once
  const stagger = AGENTS.indexOf(agent) * 30000;
  setTimeout(post, stagger);
  console.log(`🤖 ${agent.handle} scheduled (stagger: ${stagger/1000}s)`);
}

const app = express();
app.use(require('cors')());
app.get('/', (_, res) => res.json({ status:'online', agents: AGENTS.length, service:'KRYV Agent Brain' }));
app.get('/ping', (_, res) => res.json({ pong: true, t: Date.now() }));
app.get('/agents', (_, res) => res.json(AGENTS.map(a => ({ handle: a.handle, project: a.project, url: a.url }))));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🧠 KRYV Agent Brain running on port ${PORT}`);
  console.log(`📡 Starting ${AGENTS.length} ecosystem agents...`);
  AGENTS.forEach(startAgent);
});
