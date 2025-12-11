'use client';

import Link from "next/link";
import { ArrowRight, Shield, Zap, Users, Wallet as WalletIcon, Trophy, MessageCircle, Sparkles } from "lucide-react";
import { MagicLogin } from '@/components/MagicLogin';
import { VideoThumbnail } from "@/components/VideoModal";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-purple-700/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-700 to-purple-800 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-lg font-medium tracking-tight">The Culture Wallet</div>
            </div>
            <div className="flex items-center gap-8">
              <a href="https://scend.cash" target="_blank" rel="noopener" className="text-sm text-zinc-400 hover:text-purple-600 transition-colors">Scend</a>
              <a href="https://twitter.com/tonycamero" target="_blank" rel="noopener" className="text-sm text-zinc-400 hover:text-purple-600 transition-colors">@tonycamero</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero + Portal (Above-the-fold) */}
      <div className="min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full pt-16">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
            
            {/* Left: Value Prop */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-700/20 border border-purple-700/30 mb-4">
                  <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                  <span className="text-xs font-medium text-purple-600">Summer 2026 · Las Vegas Launch</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  Own the Culture.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-emerald-700">Move the Culture.</span>
                </h1>
                <p className="text-xl text-zinc-300 leading-relaxed">
                  A next-gen identity + asset layer for culture. Part digital wallet, part social graph, part reputation score.
                </p>
              </div>

              {/* Proof Points */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-700/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-base font-medium text-white">Track your cultural contributions</div>
                    <div className="text-sm text-zinc-400 mt-0.5">Build equity with every repost, remix, or drop</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-base font-medium text-white">Get rewarded, ranked, and represented</div>
                    <div className="text-sm text-zinc-400 mt-0.5">Culture = currency. Prove your impact in the ecosystem</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-700/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-base font-medium text-white">Use your influence</div>
                    <div className="text-sm text-zinc-400 mt-0.5">Access exclusive drops, communities, and opportunities</div>
                  </div>
                </div>
              </div>

              {/* Footer Micro-copy */}
              <div className="pt-8 border-t border-purple-700/20">
                <p className="text-sm text-zinc-500">
                  Built on <span className="text-purple-600">Hedera</span> · Powered by <a href="https://scend.cash" target="_blank" rel="noopener" className="text-purple-600 hover:text-purple-300 transition-colors">Scend</a> · Supported by <span className="text-purple-600">GHHA</span>
                </p>
              </div>
            </div>

            {/* Right: Login Portal */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-purple-700/30 to-emerald-700/20 blur-3xl" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2a1a3a] border border-purple-600/40 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-700 to-purple-800 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">The Culture Wallet</h2>
                    </div>
                    <p className="text-sm text-zinc-300">
                      Enter the culture. Connect your identity and start building your ledger.
                    </p>
                  </div>

                  {/* Magic Login Form */}
                  <MagicLogin />

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-purple-700/30">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">∞</div>
                      <div className="text-xs text-zinc-400 mt-1">Collections</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">TRST</div>
                      <div className="text-xs text-zinc-400 mt-1">Token</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">Web3</div>
                      <div className="text-xs text-zinc-400 mt-1">Native</div>
                    </div>
                  </div>

                  {/* Partnership Logos */}
                  <div className="pt-4 border-t border-purple-700/30">
                    <p className="text-xs text-zinc-500 text-center mb-3">Powered by</p>
                    <div className="flex items-center justify-center gap-4 text-xs text-zinc-600">
                      <span className="px-3 py-1 rounded-full bg-purple-600/5 border border-purple-700/30">Hedera</span>
                      <span className="px-3 py-1 rounded-full bg-purple-600/5 border border-purple-700/30">Scend</span>
                      <span className="px-3 py-1 rounded-full bg-purple-600/5 border border-purple-700/30">GHHA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* The Problem Section */}
      <div className="border-t border-purple-700/20 bg-gradient-to-b from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight">
              The Problem
            </h2>
            <p className="text-2xl text-zinc-300 leading-relaxed italic">
              "Culture drives commerce — but creators, communities, and collectors still don't own their impact."
            </p>
            <div className="grid md:grid-cols-3 gap-6 pt-8">
              <div className="bg-gradient-to-br from-purple-700/5 to-purple-800/20 border border-purple-700/30 rounded-xl p-6">
                <div className="text-purple-600 font-medium mb-2">Brands extract value</div>
                <div className="text-sm text-zinc-400">Culture receives crumbs</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-600/5 to-emerald-700/10 border border-emerald-600/20 rounded-xl p-6">
                <div className="text-yellow-500 font-medium mb-2">No central ledger</div>
                <div className="text-sm text-zinc-400">Cultural value is invisible</div>
              </div>
              <div className="bg-gradient-to-br from-purple-700/5 to-purple-800/20 border border-purple-700/30 rounded-xl p-6">
                <div className="text-purple-600 font-medium mb-2">Gen Z & Alpha want alignment</div>
                <div className="text-sm text-zinc-400">Not just content</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works - 3 Loops */}
      <div className="border-t border-purple-700/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-xl text-zinc-400">Three integrated loops to own and move the culture</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Wallet Loop */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a3a] border border-purple-600/40 rounded-2xl p-8 space-y-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-700 to-purple-800 flex items-center justify-center">
                <WalletIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Wallet</h3>
                <p className="text-sm text-purple-600 mb-4">Connect socials, manage assets</p>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5" />
                    <span>TRST token balance & transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5" />
                    <span>Receive, send, and request value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5" />
                    <span>Activity feed of cultural contributions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Community Loop */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a3a] border border-emerald-600/30 rounded-2xl p-8 space-y-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-pink-700 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Community</h3>
                <p className="text-sm text-yellow-500 mb-4">Secure communications + ledgering</p>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1.5" />
                    <span>Encrypted XMTP messaging</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1.5" />
                    <span>Send value within conversations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-1.5" />
                    <span>Cultural graph connections</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Collectibles Loop */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a1a3a] border border-purple-600/40 rounded-2xl p-8 space-y-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-700 to-purple-800 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Collectibles</h3>
                <p className="text-sm text-purple-600 mb-4">Payments, points, tokens, badges</p>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5" />
                    <span>GHHA membership NFTs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5" />
                    <span>Dynamic reputation scoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5" />
                    <span>Access exclusive drops & communities</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="border-t border-purple-700/20 bg-gradient-to-b from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold tracking-tight mb-4">Use Cases</h2>
            <p className="text-xl text-zinc-400">Culture deserves a ledger. The Culture Wallet is it.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-purple-700/30 to-purple-800/20 border border-purple-600/40 rounded-xl flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-purple-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-white mb-2">Artists & Collectives</div>
                <div className="text-sm text-zinc-400">Prove influence and impact in the cultural ecosystem</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-emerald-600/20 to-pink-700/20 border border-emerald-600/30 rounded-xl flex items-center justify-center">
                <Users className="w-12 h-12 text-yellow-500" />
              </div>
              <div>
                <div className="text-lg font-bold text-white mb-2">Fans</div>
                <div className="text-sm text-zinc-400">Earn clout by promoting early and supporting creators</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-purple-700/30 to-purple-800/20 border border-purple-600/40 rounded-xl flex items-center justify-center">
                <Zap className="w-12 h-12 text-purple-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-white mb-2">Brands</div>
                <div className="text-sm text-zinc-400">Activate authentic ambassadors with proven cultural capital</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="aspect-video bg-gradient-to-br from-emerald-600/20 to-pink-700/20 border border-emerald-600/30 rounded-xl flex items-center justify-center">
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
              <div>
                <div className="text-lg font-bold text-white mb-2">Cultural Institutions</div>
                <div className="text-sm text-zinc-400">Track lineage + impact across cultural movements</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tech/IP Edge Section */}
      <div className="border-t border-purple-700/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-center">
            
            {/* Left: Tech Points */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
                We're not building another rewards app.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-emerald-700">We're minting the next social protocol.</span>
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Powered by Hedera's enterprise-grade blockchain, CultureWallet combines cultural graph engines, dynamic reputation scoring, and privacy-first architecture.
              </p>
            </div>

            {/* Right: Tech Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-700/20 to-purple-500/5 border border-purple-600/40 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-purple-700/30 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-sm font-medium text-white mb-1">Cultural graph engine</div>
                <div className="text-xs text-zinc-500">Map influence and impact across movements</div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-700/5 border border-emerald-600/30 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-600/20 flex items-center justify-center mb-4">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-sm font-medium text-white mb-1">Dynamic reputation scoring</div>
                <div className="text-xs text-zinc-500">Prove cultural capital on-chain</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-700/20 to-purple-500/5 border border-purple-600/40 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-purple-700/30 flex items-center justify-center mb-4">
                  <WalletIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-sm font-medium text-white mb-1">Tokenized value layer</div>
                <div className="text-xs text-zinc-500">Plug-and-play cultural economy</div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-700/5 border border-emerald-600/30 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-600/20 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-sm font-medium text-white mb-1">Privacy + provenance</div>
                <div className="text-xs text-zinc-500">Your data, your identity, your ledger</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="border-t border-purple-700/20 bg-gradient-to-b from-[#0a0a0a] via-[#2a1050] to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tight">
              Let's move the culture
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-emerald-700">forward — together</span>
            </h2>
            <p className="text-xl text-zinc-300">
              Culture deserves a ledger. The Culture Wallet is it.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link
                href="/contacts"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-700 to-emerald-700 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg transition-all transform hover:scale-105"
              >
                <span>Enter the Culture</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-purple-700/20 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-zinc-600">
              © 2025 The Culture Wallet · Built on <span className="text-purple-600">Hedera</span> · Powered by <a href="https://scend.cash" target="_blank" rel="noopener" className="text-purple-600 hover:text-purple-300 transition-colors">Scend</a>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://twitter.com/tonycamero" target="_blank" rel="noopener" className="text-sm text-zinc-600 hover:text-purple-600 transition-colors">@tonycamero</a>
              <a href="https://twitter.com/Web3GangGeneral" target="_blank" rel="noopener" className="text-sm text-zinc-600 hover:text-purple-600 transition-colors">@Web3GangGeneral</a>
              <a href="https://scend.cash" target="_blank" rel="noopener" className="text-sm text-zinc-600 hover:text-purple-600 transition-colors">Scend</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
