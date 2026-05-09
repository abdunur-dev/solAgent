import React from 'react';

const Index: React.FC = () => {
  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white font-body selection:bg-solana-cyan/30">
      
      {/* ════════════ HERO ════════════ */}
      <section className="hero">
        <div className="hero-ring"></div>
        <div className="hero-ring2"></div>
        <div className="hero-orb"></div>
        <div className="hero-orb-glow"></div>

        {/* NAV */}
        <nav className="site-nav">
          <a className="nav-logo no-underline">
            <div className="w-8 h-8 bg-solana-cyan rounded-lg flex items-center justify-center font-display font-extrabold text-black text-xl">S</div>
            <span className="font-display font-extrabold tracking-[0.05em] uppercase">SolAgent</span>
          </a>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How it Works</a>
            <a href="#faq" className="nav-link">FAQ</a>
            <button className="btn-solana">Launch App</button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center px-10 lg:px-[72px] gap-12 pt-10">
          <div className="flex-1 max-w-[650px] text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solana-cyan/10 border border-solana-cyan/20 text-solana-cyan text-xs font-semibold mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-solana-cyan animate-pulse"></div>
              Powered by Solana
            </div>
            <h1 className="font-display font-bold leading-[1.08] tracking-[-0.025em] mb-6" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)' }}>
              Your AI Agent<br/><span className="text-solana-cyan">on Solana</span>
            </h1>
            <p className="text-white/60 text-lg lg:text-xl mb-10 leading-relaxed max-w-[550px]">
              Say It. Get It Done. Connect your wallet and let AI handle swaps, transfers, staking and more — all in plain English.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <button className="btn-solana text-sm px-8 py-4">Launch App</button>
              <button className="btn-ghost text-sm px-8 py-4">How it Works →</button>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-10 mt-16 justify-center lg:justify-start">
              <div>
                <div className="text-2xl font-bold font-display">50K+</div>
                <div className="text-white/40 text-xs uppercase tracking-widest mt-1">Transactions</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-display">12K+</div>
                <div className="text-white/40 text-xs uppercase tracking-widest mt-1">Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-display text-solana-cyan">&lt;1s</div>
                <div className="text-white/40 text-xs uppercase tracking-widest mt-1">Execution</div>
              </div>
            </div>
          </div>

          {/* AI Chat Mockup */}
          <div className="flex-1 w-full max-w-[480px]">
            <div className="chat-window flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-solana-purple rounded-full flex items-center justify-center font-bold">S</div>
                  <div>
                    <div className="text-sm font-bold">SolAgent</div>
                    <div className="text-[10px] text-solana-cyan flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-solana-cyan"></div>
                      Online
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 min-h-[200px]">
                <div className="chat-bubble user">
                  Swap 2 SOL for USDC at the best rate
                </div>
                <div className="chat-bubble ai">
                  Found the best route via Jupiter. Swapping 2 SOL for 312.45 USDC. Confirming transaction...
                </div>
                <div className="chat-bubble ai bg-solana-cyan/10 border-solana-cyan/20 text-solana-cyan">
                  Done! 312.45 USDC received. Transaction confirmed in 0.4s.
                </div>
                <div className="text-[10px] text-white/20 text-center uppercase tracking-widest mt-2">
                  Confirmed on-chain
                </div>
              </div>
              
              <div className="mt-8 relative">
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/30 text-sm flex items-center justify-between">
                  Type a command...
                  <div className="w-5 h-5 bg-solana-cyan rounded flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="text-[10px] uppercase tracking-[0.2em]">Scroll</div>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* ════════════ LOGO TICKER ════════════ */}
      <section className="py-20 border-y border-white/5 bg-black/20">
        <p className="text-center text-white/30 text-[11px] uppercase tracking-[0.3em] mb-12">Compatible with all major Solana Wallets</p>
        <div className="ticker-wrap">
          <div className="ticker-track">
            {['Phantom', 'Backpack', 'Solflare', 'Ledger', 'Magic Eden', 'Atomic', 'Exodus', 'Trust Wallet'].concat(['Phantom', 'Backpack', 'Solflare', 'Ledger', 'Magic Eden', 'Atomic', 'Exodus', 'Trust Wallet']).map((wallet, i) => (
              <div key={i} className="flex items-center gap-3 text-white/40 font-display font-bold text-2xl grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                <div className="w-8 h-8 bg-white/10 rounded-lg"></div>
                {wallet}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
      <section id="how-it-works" className="py-32 px-10 lg:px-[72px] relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[40%] h-[60%] bg-solana-purple/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-20">
            <div className="text-solana-cyan font-display font-bold text-sm tracking-widest uppercase mb-4">&gt; Simple by Design</div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl">How It Works</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {[
              { num: '01', title: 'Connect Wallet', desc: 'Connect any Solana wallet in one click. Phantom, Backpack, Solflare and more.' },
              { num: '02', title: 'Type Your Command', desc: 'Tell SolAgent what to do in plain English. No confusing interfaces, no technical steps.' },
              { num: '03', title: 'AI Executes On-Chain', desc: 'SolAgent understands your intent and executes the transaction securely on Solana.' }
            ].map((step, i) => (
              <div key={i} className="group">
                <div className="text-6xl font-display font-black text-white/5 mb-6 group-hover:text-solana-cyan/10 transition-colors">{step.num}</div>
                <h4 className="text-xl font-bold mb-4">{step.title}</h4>
                <p className="text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CAPABILITIES ════════════ */}
      <section id="features" className="py-32 px-10 lg:px-[72px] bg-black/40">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <div className="text-solana-purple font-display font-bold text-sm tracking-widest uppercase mb-4">&gt; Capabilities</div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl mb-6">What SolAgent Can Do</h2>
            <p className="text-white/40 max-w-[600px] mx-auto text-lg">One AI agent that replaces dozens of interfaces. Talk naturally and get things done on Solana.</p>
          </div>
          
          <div className="feat-grid">
            {[
              { tag: 'AI', title: 'AI-Powered Agent', desc: 'Understands natural language and executes complex DeFi actions automatically.', color: 'purple' },
              { tag: 'DeFi', title: 'Cross-Chain Bridging', desc: 'Bridge assets across 60+ chains (Ethereum, Base, etc.) using LI.FI\'s powerful aggregation.', color: 'cyan' },
              { tag: 'DeFi', title: 'On-Chain Swaps', desc: 'Execute token swaps via LI.FI & Jupiter Aggregator just by typing \'Swap 5 SOL to USDC\'.', color: 'purple' },
              { tag: 'Staking', title: 'Secure Staking', desc: 'Stake your SOL with top validators and start earning rewards with simple commands.', color: 'cyan' },
              { tag: 'Payments', title: 'Payment Requests', desc: 'Generate Solana Pay compatible QR codes for specific amounts with \'Request 1 SOL\'.', color: 'purple' },
              { tag: 'Markets', title: 'Prediction Markets', desc: 'Place on-chain predictions on real-world events and crypto prices instantly.', color: 'cyan' },
              { tag: 'Transfers', title: 'Instant Transfers', desc: 'Send SOL or any SPL token to any address instantly. Just say \'Send 1 SOL to...\'.', color: 'purple' },
              { tag: 'Portfolio', title: 'Asset Management', desc: 'Check balances, view your transaction history, and manage your NFT collection in one place.', color: 'cyan' }
            ].map((feat, i) => (
              <div key={i} className="feat-card">
                <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-6 ${feat.color === 'cyan' ? 'bg-solana-cyan/10 text-solana-cyan' : 'bg-solana-purple/10 text-solana-purple'}`}>
                  {feat.tag}
                </div>
                <h4 className="text-lg font-bold mb-3">{feat.title}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ COMPARISON ════════════ */}
      <section className="py-32 px-10 lg:px-[72px]">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-16">
            <div className="text-solana-cyan font-display font-bold text-sm tracking-widest uppercase mb-4">&gt; Compare</div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl mb-6">Why SolAgent?</h2>
            <p className="text-white/40 text-lg">Compare the traditional wallet experience with the new era of AI-driven blockchain interaction.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="comp-table">
              <thead className="comp-header">
                <tr>
                  <th>Feature</th>
                  <th>Traditional Wallet</th>
                  <th>SolAgent AI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Transaction Speed', 'Multiple clicks & approvals', 'One natural sentence'],
                  ['DeFi Complexity', 'Navigating 10+ tabs', 'Unified AI interface'],
                  ['Asset Tracking', 'Manual dashboard checks', 'Real-time AI insights'],
                  ['Security', 'Manual signature review', 'AI-assisted risk analysis'],
                  ['User Experience', 'Complex & Technical', 'Human-like & Intuitive']
                ].map((row, i) => (
                  <tr key={i} className="comp-row">
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ════════════ ROADMAP ════════════ */}
      <section className="py-32 px-10 lg:px-[72px] bg-black/20 relative">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-24">
            <div className="text-solana-purple font-display font-bold text-sm tracking-widest uppercase mb-4">&gt; Timeline</div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl">Roadmap</h2>
          </div>
          
          <div className="relative">
            <div className="roadmap-line"></div>
            
            <div className="space-y-24">
              {[
                { phase: 'Phase 1', title: 'Project Foundation', date: 'Q1 2026', items: ['Core Agent Engine', 'Devnet Integration', 'Natural Language Parsing'], status: 'In Progress' },
                { phase: 'Phase 2', title: 'Alpha Release', date: 'Q2 2026', items: ['Staking & Swaps', 'Payment Requests', 'LI.FI Cross-Chain Integration'] },
                { phase: 'Phase 3', title: 'Mainnet Launch', date: 'Q3 2026', items: ['Mainnet Liquidity', 'Advanced Risk Analysis', 'Multi-Chain Expansion'] },
                { phase: 'Phase 4', title: 'AI Ecosystem', date: 'Q4 2026', items: ['Yield Optimization', 'Automated Rebalancing', 'DAO Governance'] }
              ].map((milestone, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-8 md:gap-0 items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="flex-1 text-center md:text-right md:px-12">
                    {i % 2 === 0 ? (
                      <>
                        <div className="text-solana-cyan font-bold mb-1">{milestone.phase}</div>
                        <h4 className="text-xl font-bold mb-4">{milestone.title}</h4>
                        <div className="text-white/30 text-sm font-display">{milestone.date}</div>
                      </>
                    ) : (
                      <div className="space-y-2 text-left md:text-right">
                        {milestone.items.map((item, j) => (
                          <div key={j} className="text-white/50 text-sm">{item}</div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="roadmap-dot"></div>
                  
                  <div className="flex-1 text-center md:text-left md:px-12">
                    {i % 2 !== 0 ? (
                      <>
                        <div className="text-solana-purple font-bold mb-1">{milestone.phase}</div>
                        <h4 className="text-xl font-bold mb-4">{milestone.title}</h4>
                        <div className="text-white/30 text-sm font-display">{milestone.date}</div>
                      </>
                    ) : (
                      <div className="space-y-2 text-left">
                        {milestone.items.map((item, j) => (
                          <div key={j} className="text-white/50 text-sm">{item}</div>
                        ))}
                        {milestone.status && <div className="inline-block px-2 py-0.5 bg-solana-cyan/10 text-solana-cyan text-[10px] font-bold rounded mt-2 uppercase">{milestone.status}</div>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ FAQ ════════════ */}
      <section id="faq" className="py-32 px-10 lg:px-[72px]">
        <div className="max-w-[800px] mx-auto">
          <div className="mb-16">
            <div className="text-solana-cyan font-display font-bold text-sm tracking-widest uppercase mb-4">&gt; Support</div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl mb-6">Frequently Asked Questions</h2>
            <p className="text-white/40 text-lg">Everything you need to know about SolAgent.</p>
          </div>
          
          <div className="space-y-4">
            {[
              "What is SolAgent?",
              "Is this safe to use?",
              "Does it work on Mainnet?",
              "How do I get Devnet SOL?",
              "What kind of transactions can I do?"
            ].map((q, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-xl px-6 py-5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
                <span className="text-white/80 font-medium">{q}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/20 group-hover:text-solana-cyan transition-colors"><path d="M12 5v14M5 12h14"/></svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CTA ════════════ */}
      <section className="py-32 px-10 lg:px-[72px] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-solana-purple/10 to-transparent"></div>
        <div className="max-w-[1000px] mx-auto bg-gradient-to-r from-solana-purple/20 to-solana-cyan/20 rounded-[32px] p-12 lg:p-20 text-center relative z-10 border border-white/10 backdrop-blur-xl">
          <h2 className="font-display font-bold text-4xl lg:text-6xl mb-8">Ready to Talk to Solana?</h2>
          <p className="text-white/60 text-lg lg:text-xl mb-12 max-w-[600px] mx-auto">Connect your wallet and start executing on-chain in seconds. No learning curve, no complex UIs.</p>
          <button className="btn-solana px-12 py-5 text-base">Launch App</button>
          
          <div className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-white/10">
            {['Non-custodial', 'Open source', 'Built on Solana'].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-solana-cyan"><path d="M20 6L9 17l-5-5"/></svg>
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="footer-section py-20 px-10 lg:px-[72px]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
            <div className="max-w-[300px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-solana-cyan rounded-lg flex items-center justify-center font-display font-extrabold text-black">S</div>
                <span className="font-display font-extrabold text-xl tracking-[0.05em] uppercase">SolAgent</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed mb-8">Your AI-powered agent on Solana. Bridging the gap between human intent and on-chain execution.</p>
              <div className="flex items-center gap-4">
                {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 bg-white/5 rounded-full hover:bg-solana-cyan/20 transition-colors cursor-pointer"></div>)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-widest mb-6 text-solana-cyan">Platform</h5>
                <ul className="space-y-4 text-sm text-white/40">
                  <li className="hover:text-white cursor-pointer transition-colors">Launch App</li>
                  <li className="hover:text-white cursor-pointer transition-colors">How it Works</li>
                  <li className="hover:text-white cursor-pointer transition-colors">API Docs</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-xs uppercase tracking-widest mb-6 text-solana-purple">Community</h5>
                <ul className="space-y-4 text-sm text-white/40">
                  <li className="hover:text-white cursor-pointer transition-colors">X / Twitter</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Discord</li>
                  <li className="hover:text-white cursor-pointer transition-colors">GitHub</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-xs uppercase tracking-widest mb-6 text-white/60">Legal</h5>
                <ul className="space-y-4 text-sm text-white/40">
                  <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Terms</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-6">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/20">
              Forged with <span className="text-solana-purple">❤</span> & code
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/20">
              Built on Solana
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/20">
              © 2026 SolAgent. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Index;
