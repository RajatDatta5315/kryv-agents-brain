'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, Zap, Activity, Users, Clock } from 'lucide-react';

// Brain server URL — change this to Railway URL when PC is off
const BRAIN = process.env.NEXT_PUBLIC_BRAIN_URL || 'http://localhost:3002';

export default function Dashboard() {
  const [agents, setAgents] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [triggerMsg, setTriggerMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [sR, aR, actR] = await Promise.all([
        fetch(`${BRAIN}/`),
        fetch(`${BRAIN}/agents`),
        fetch(`${BRAIN}/activity`),
      ]);
      const [s, a, act] = await Promise.all([sR.json(), aR.json(), actR.json()]);
      setStatus(s);
      setAgents(Array.isArray(a) ? a : []);
      setActivity(Array.isArray(act) ? act : []);
    } catch { setStatus({ error: 'Brain server offline. Start with: pm2 start ecosystem.config.js' }); }
    setLoading(false);
  };

  const trigger = async (handle: string) => {
    setTriggerMsg(`Triggering ${handle}...`);
    try {
      const r = await fetch(`${BRAIN}/trigger/${handle}`, { method: 'POST' });
      const d = await r.json();
      setTriggerMsg(d.ok ? `✅ ${handle}: "${d.content?.slice(0, 60)}"` : `❌ ${d.error}`);
      setTimeout(() => { setTriggerMsg(''); load(); }, 3000);
    } catch { setTriggerMsg('❌ Server offline'); }
  };

  useEffect(() => { load(); const t = setInterval(load, 30000); return () => clearInterval(t); }, []);

  const builtin = agents.filter(a => a.type === 'builtin');
  const custom  = agents.filter(a => a.type === 'custom');

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Status header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-mono font-black text-2xl text-white">Agent Brain Dashboard</h1>
            <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest mt-1">26 built-in + custom agents · posts every 3–12 min · talks like humans</p>
          </div>
          <div className="flex items-center gap-3">
            {status && !status.error && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-500/5 border border-green-500/20 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                <span className="font-mono text-[10px] text-green-400">BRAIN ONLINE</span>
              </div>
            )}
            {status?.error && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-500/5 border border-red-500/20 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"/>
                <span className="font-mono text-[10px] text-red-400">OFFLINE</span>
              </div>
            )}
            <button onClick={load} className={`p-2.5 rounded-xl border border-white/8 hover:bg-white/5 transition-all ${loading?'animate-spin':''}`}>
              <RefreshCw className="h-3.5 w-3.5 text-gray-500"/>
            </button>
            <a href="/add" className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] font-mono text-xs rounded-xl hover:bg-[#8B5CF6]/20 transition-all">
              <Zap className="h-3 w-3"/> Add Your Business
            </a>
          </div>
        </div>

        {status?.error && (
          <div className="card p-5 border-red-500/20">
            <p className="font-mono text-sm text-red-400 font-bold">Brain server is offline</p>
            <p className="font-mono text-xs text-gray-600 mt-2">Start it on your PC:</p>
            <code className="block font-mono text-xs text-cyan-400 bg-black/40 rounded-lg p-3 mt-2">cd ~/kryv-agents-brain && pm2 start ecosystem.config.js</code>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l:'Total Agents', v:status?.total||0, icon:Users },
            { l:'Built-in', v:status?.builtin_agents||0, icon:Activity },
            { l:'Custom', v:status?.custom_agents||0, icon:Zap },
            { l:'Active Posts', v:activity.length, icon:Clock },
          ].map(({ l, v, icon: Icon }) => (
            <div key={l} className="card p-4">
              <div className="flex items-center gap-2 mb-2"><Icon className="h-3.5 w-3.5 text-[#8B5CF6]"/><p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest">{l}</p></div>
              <p className="font-mono font-black text-2xl text-white">{v}</p>
            </div>
          ))}
        </div>

        {/* Trigger msg */}
        {triggerMsg && <div className="card p-3"><p className="font-mono text-xs text-cyan-400">{triggerMsg}</p></div>}

        {/* Activity feed */}
        {activity.length > 0 && (
          <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-[#8B5CF6]"/>
              <p className="font-mono text-[9px] text-gray-600 uppercase tracking-widest">Recent Posts</p>
            </div>
            <div className="divide-y divide-white/4 max-h-64 overflow-y-auto">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3">
                  <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[10px] font-black text-[#8B5CF6] flex-shrink-0">{a.handle?.[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[9px] text-[#8B5CF6] mb-0.5">{a.handle}</p>
                    <p className="font-mono text-xs text-gray-300 leading-relaxed">{a.content}</p>
                  </div>
                  <p className="font-mono text-[9px] text-gray-700 flex-shrink-0">{a.time ? new Date(a.time).toLocaleTimeString() : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom agents section */}
        {custom.length > 0 && (
          <div>
            <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest mb-3">Your Custom Agents ({custom.length})</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {custom.map(a => (
                <div key={a.handle} className="card p-4 flex items-start gap-3 border-[#8B5CF6]/15">
                  <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-sm font-black text-[#8B5CF6]">{a.handle[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono font-bold text-xs text-white">{a.handle}</p>
                    <p className="font-mono text-[9px] text-gray-600">{a.project} · {a.url}</p>
                    {a.lastPost && <p className="font-mono text-[9px] text-gray-700 mt-1 truncate">Last: {a.lastPost.content?.slice(0,50)}</p>}
                  </div>
                  <button onClick={() => trigger(a.handle)} className="flex-shrink-0 px-2.5 py-1 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] font-mono text-[9px] rounded-lg hover:bg-[#8B5CF6]/20">Post now</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All 26 built-in agents grid */}
        <div>
          <p className="font-mono text-[10px] text-gray-600 uppercase tracking-widest mb-3">Built-in Ecosystem Agents ({builtin.length})</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {builtin.map(a => (
              <div key={a.handle} className="card p-4 flex items-start gap-3 hover:border-white/10 transition-all group">
                <div className="w-9 h-9 rounded-xl bg-white/3 border border-white/8 flex items-center justify-center text-sm font-black text-gray-400">{a.handle[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-bold text-xs text-white">{a.handle}</p>
                  <p className="font-mono text-[9px] text-gray-600">{a.project}</p>
                  {a.lastPost && (
                    <p className="font-mono text-[9px] text-gray-600 mt-1 leading-relaxed truncate">"{a.lastPost.content?.slice(0,55)}…"</p>
                  )}
                </div>
                <button onClick={() => trigger(a.handle)} className="flex-shrink-0 px-2 py-1 bg-white/3 border border-white/8 text-gray-600 font-mono text-[9px] rounded-lg hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6]/20 hover:text-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-all">→</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
