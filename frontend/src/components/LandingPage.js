import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Shield, Activity, Share2, Play, CheckCircle2, Menu, 
  Zap, Lock, Globe, ChevronRight, BarChart3, Search, Fingerprint,
  Twitter, Instagram, Linkedin, Github, Facebook
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

export default function LandingPage({ onStart }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#814ac8]/30 selection:text-[#df7afe] overflow-x-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {/* === MOTION PLANET === */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute top-[5%] right-[-15%] w-[700px] h-[700px]"
            style={{ transformOrigin: "center center" }}
          >
            {/* Planet Core */}
            <div className="absolute inset-[60px] rounded-full bg-[radial-gradient(ellipse_at_30%_30%,_#814ac8_0%,_#2e1065_40%,_#0d0318_80%)] shadow-[inset_-30px_-30px_80px_rgba(0,0,0,0.7),inset_20px_20px_60px_rgba(223,122,254,0.15)]" />

            {/* Planet glow / atmosphere */}
            <div className="absolute inset-[50px] rounded-full bg-[radial-gradient(ellipse_at_center,_transparent_60%,_rgba(129,74,200,0.35)_100%)] blur-[6px]" />

            {/* Outer atmosphere halo */}
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,_transparent_55%,_rgba(129,74,200,0.12)_75%,_transparent_100%)] blur-[20px]" />

            {/* Ring 1 */}
            <motion.div
              animate={{ rotateX: [70, 72, 70] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-[20px] rounded-full border border-[#df7afe]/20"
              style={{ transform: "rotateX(70deg)", borderRadius: "50%" }}
            />
            {/* Ring 2 */}
            <motion.div
              animate={{ rotateX: [70, 68, 70] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute inset-[5px] rounded-full border border-[#814ac8]/15"
              style={{ transform: "rotateX(70deg)" }}
            />
          </motion.div>

          {/* Planet ambient glow behind */}
          <motion.div
            animate={{ opacity: [0.25, 0.4, 0.25], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-20%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(129,74,200,0.25)_0%,_transparent_70%)] blur-[60px]"
          />

          {/* Main Gradient Blob - Top Left */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#814ac8]/20 via-[#4c1d95]/5 to-transparent rounded-full blur-[100px]" 
          />
          
          {/* Secondary Gradient Blob - Bottom Right */}
          <motion.div 
             animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, -40, 0],
              y: [0, -40, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3b82f6]/10 via-[#1d4ed8]/5 to-transparent rounded-full blur-[120px]" 
          />

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative w-10 h-10 flex items-center justify-center">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#814ac8] to-[#df7afe] rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                 <div className="relative w-full h-full bg-[#0d0d0d] border border-white/10 rounded-xl flex items-center justify-center group-hover:border-[#814ac8]/30 transition-colors">
                    <Share2 className="w-5 h-5 text-[#df7afe]" />
                 </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#df7afe] transition-colors">
                GraphMule
              </span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
              {['Capabilities', 'Solutions', 'Technology', 'About'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className="hover:text-white transition-colors relative group py-2"
                >
                  {item}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#df7afe] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-6">
              <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                Sign In
              </button>
              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(129, 74, 200, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onStart}
                className="relative group px-6 py-2.5 bg-white text-black text-sm font-bold rounded-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#df7afe] to-[#814ac8] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2 group-hover:text-white transition-colors">
                  Launch App <ChevronRight className="w-4 h-4" />
                </span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#814ac8]/10 border border-[#814ac8]/20 text-[#df7afe] text-xs font-semibold uppercase tracking-wider mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#df7afe] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#814ac8]"></span>
            </span>
            Next-Gen Fraud Detection
          </motion.div>
          
          <motion.h1 
            style={{ opacity, scale }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1]"
          >
            Stop Financial Crime <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#df7afe] via-[#814ac8] to-[#4c1d95] animate-gradient bg-300%">
              Before It Impacts
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto text-xl text-zinc-400 mb-12 leading-relaxed"
          >
             GraphMule analyzes complex transaction networks in <span className="text-white font-medium">real-time</span> to uncover cycles, smurfing, and shell accounts that traditional rules miss.
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 bg-[#814ac8] hover:bg-[#6d28d9] text-white text-lg font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(129,74,200,0.3)] hover:shadow-[0_0_50px_rgba(129,74,200,0.5)] transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Start Analysis
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900/50 hover:bg-zinc-800 text-white border border-white/10 hover:border-white/20 text-lg font-semibold rounded-xl transition-all backdrop-blur-sm flex items-center justify-center gap-2">
              <Play className="w-5 h-5 fill-white" />
              Watch Demo
            </button>
          </motion.div>

          {/* Abstract Graph Simulation */}
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-24 relative mx-auto max-w-5xl group"
          >
             <div className="absolute -inset-1 bg-gradient-to-r from-[#814ac8] to-[#df7afe] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
             <div className="relative bg-[#0a0a0a] rounded-xl border border-white/10 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] ring-1 ring-white/5">
                
                {/* Graph Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/djv4zxxb2/image/upload/v1718045557/graph-bg_h37w1l.png')] bg-cover bg-center opacity-20 mix-blend-screen grayscale"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50"></div>
                
                {/* Animated Graph Nodes (Simulated) */}
                <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-3 h-3 rounded-full bg-[#df7afe] shadow-[0_0_15px_#df7afe]"
                            initial={{ 
                                x: Math.random() * 800, 
                                y: Math.random() * 300,
                                opacity: 0.3
                            }}
                            animate={{ 
                                x: Math.random() * 800, 
                                y: Math.random() * 300,
                                opacity: [0.3, 0.8, 0.3]
                            }}
                            transition={{ 
                                duration: 5 + Math.random() * 5, 
                                repeat: Infinity, 
                                repeatType: "mirror",
                                ease: "easeInOut"
                            }}
                        />
                    ))}
                </div>

                {/* Dashboard Overlay UI */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                   <motion.div 
                     initial={{ x: -50, opacity: 0 }}
                     animate={{ x: 0, opacity: 1 }}
                     transition={{ delay: 1 }}
                     className="bg-[#121212]/80 backdrop-blur-md border border-white/10 p-5 rounded-xl max-w-sm w-full shadow-2xl"
                   >
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                            <Shield className="w-5 h-5 text-red-500" />
                         </div>
                         <div>
                            <h3 className="font-bold text-white text-sm">Suspicious Activity Detected</h3>
                            <p className="text-xs text-red-400 font-medium">Smurfing Pattern • 98% Confidence</p>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between text-xs text-zinc-500 font-medium">
                            <span>Accounts Involved</span>
                            <span className="text-white">12 Nodes</span>
                         </div>
                         <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: "98%" }}
                              transition={{ duration: 1.5, delay: 1.5 }}
                              className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                            />
                         </div>
                      </div>
                   </motion.div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 relative z-10" id="capabilities">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-sm font-bold text-[#df7afe] uppercase tracking-widest mb-3">Core Engines</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">See What Others Miss</h3>
            <p className="text-lg text-zinc-400">
              Traditional rule-based systems generate high false positives. GraphMule uses graph topology to identify the <span className="text-white">structure</span> of financial crime.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <FeatureCard 
              icon={<Search className="w-6 h-6 text-[#df7afe]" />}
              title="Cycle Detection"
              description="Identify circular flows where money loops back to the originator, a classic sign of wash trading and synthetic fraud."
              delay={0}
            />
            <FeatureCard 
              icon={<Fingerprint className="w-6 h-6 text-[#a855f7]" />}
              title="Smurfing Analysis"
              description="Detect fan-out (layering) and fan-in (integration) patterns used to break large sums into undetectable micro-transactions."
              delay={0.1}
              highlight={true}
            />
            <FeatureCard 
              icon={<Lock className="w-6 h-6 text-[#3b82f6]" />}
              title="Shell Accounts"
              description="Pinpoint dormant or pass-through nodes that exist solely to move funds, characterizing them by degree and volume ratio."
              delay={0.2}
            />
          </motion.div>
        </div>
      </section>

       {/* Stats Section */}
       <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                <StatItem value="99.9%" label="Accuracy" />
                <StatItem value="<50ms" label="Latency" />
                <StatItem value="24/7" label="Real-time" />
                <StatItem value="10B+" label="Nodes Scanned" />
            </div>
        </div>
       </section>


      {/* Footer */}
      {/* Framer-style Footer */}
      <footer className="bg-black text-white pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
            
            {/* Left Column: Brand & Newsletter */}
            <div className="md:col-span-5 lg:col-span-4 space-y-6">
               <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center">
                      <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-bold tracking-tight">GraphMule</span>
               </div>
               <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                  GraphMule – Uncovering hidden financial crime networks with advanced graph algorithms.
               </p>
               
               <div className="pt-4">
                  <h4 className="text-white font-medium mb-4">Join our newsletter</h4>
                  <div className="relative max-w-sm">
                    <input 
                      type="email" 
                      placeholder="name@email.com" 
                      className="w-full bg-[#111] border border-[#222] text-white rounded-lg pl-4 pr-32 py-3 focus:outline-none focus:border-[#814ac8] transition-colors"
                    />
                    <button className="absolute right-1 top-1 bottom-1 bg-[#814ac8] hover:bg-[#6d28d9] text-white px-4 rounded-md text-sm font-medium transition-colors">
                      Subscribe
                    </button>
                  </div>
               </div>
            </div>

            {/* Spacer */}
            <div className="hidden lg:block lg:col-span-2"></div>

            {/* Right Columns: Links */}
            <div className="md:col-span-7 lg:col-span-6 grid grid-cols-3 gap-8">
               {/* Links Column */}
               <div>
                  <h4 className="text-white font-medium mb-6">Product</h4>
                  <ul className="space-y-4 text-sm text-zinc-400">
                     <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Technology</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  </ul>
               </div>

               {/* Pages Column */}
               <div>
                  <h4 className="text-white font-medium mb-6">Company</h4>
                  <ul className="space-y-4 text-sm text-zinc-400">
                     <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  </ul>
               </div>

               {/* Socials Column */}
               <div>
                  <h4 className="text-white font-medium mb-6">Socials</h4>
                  <ul className="space-y-4 text-sm text-zinc-400 mb-6">
                     <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                  </ul>
                  <div className="flex gap-4">
                     <a href="#" className="w-10 h-10 rounded-full bg-[#111] hover:bg-[#814ac8] flex items-center justify-center transition-colors group">
                        <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                     </a>
                     <a href="#" className="w-10 h-10 rounded-full bg-[#111] hover:bg-[#814ac8] flex items-center justify-center transition-colors group">
                        <Twitter className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                     </a>
                     <a href="#" className="w-10 h-10 rounded-full bg-[#111] hover:bg-[#814ac8] flex items-center justify-center transition-colors group">
                        <Linkedin className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                     </a>
                     <a href="#" className="w-10 h-10 rounded-full bg-[#111] hover:bg-[#814ac8] flex items-center justify-center transition-colors group">
                        <Github className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                     </a>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, highlight = false }) {
  return (
    <motion.div 
      variants={fadeInUp}
      whileHover={{ y: -5 }}
      className={`p-8 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${
        highlight 
        ? 'bg-[#814ac8]/5 border-[#814ac8]/30 hover:bg-[#814ac8]/10' 
        : 'bg-[#0d0d0d] border-white/5 hover:border-white/10 hover:bg-[#121212]'
      }`}
    >
      {highlight && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#814ac8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${
          highlight ? 'bg-[#814ac8]/20' : 'bg-[#1a1a1a] group-hover:bg-[#222]'
      }`}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#df7afe] transition-colors">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  );
}

function StatItem({ value, label }) {
    return (
        <div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{value}</div>
            <div className="text-sm font-medium text-[#814ac8] uppercase tracking-widest">{label}</div>
        </div>
    )
}
