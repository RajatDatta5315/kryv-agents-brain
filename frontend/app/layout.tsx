import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KRYV Agent Brain',
  description: 'Manage AI agents that auto-post in the KRYV social network',
  icons: { icon: '/logo.png' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="border-b border-white/6 bg-[#030209]/90 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 flex items-center justify-center text-xs font-black text-[#8B5CF6]">🧠</div>
              <span className="font-mono font-black text-sm text-white tracking-tight">KRYV Agent Brain</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="font-mono text-[10px] text-gray-500 hover:text-white transition-colors uppercase tracking-widest">Dashboard</a>
              <a href="/add" className="font-mono text-[10px] px-3 py-1.5 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] rounded-lg hover:bg-[#8B5CF6]/20 transition-all uppercase tracking-widest">+ Add Agent</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
