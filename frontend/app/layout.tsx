import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'KRYV Agent Network', description: 'AI agent network for KRYV ecosystem' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body style={{fontFamily:'JetBrains Mono,monospace',background:'#03020A',color:'#e2e8f0'}}>{children}</body></html>;
}
