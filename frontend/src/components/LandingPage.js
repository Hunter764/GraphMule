import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Shield, Activity, Share2, Play, CheckCircle2, Menu, 
  Zap, Lock, Globe, ChevronRight, BarChart3, Search, Fingerprint,
  Twitter, Instagram, Linkedin, Github, Facebook,
  Cpu, Server, Database, Network, Code2, Terminal, Layers, Cloud, Box
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

const WaterGradientBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep Dark Base */}
      <div className="absolute inset-0 bg-[#050505]" />
      
      {/* Static Liquid Flow PNG (Optmized) */}
      <img
        src="/background-flow.png"
        alt="Background Flow"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      
      {/* Gradient Vignette for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
    </div>
  );
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
              {['About', 'Capabilities', 'Solutions', 'Technology'].map((item) => (
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
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex flex-col justify-center" id="about">
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

          {/* Redesigned Metrics Section - Planet Theme */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-32 relative mx-auto max-w-4xl"
          >
             {/* Planet Background Effect */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none">
                <div className="absolute inset-0 bg-[#814ac8]/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-[#df7afe]/5 rounded-full blur-[80px]" />
             </div>

             {/* Floating Card Container */}
             <motion.div
               animate={{ y: [-15, 15, -15] }}
               transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
               className="relative z-10"
             >
                <div className="relative bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-1 shadow-2xl ring-1 ring-white/5">
                   {/* Inner Gradient Border */}
                   <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                   
                   <div className="bg-[#050505]/80 rounded-[20px] p-8 md:p-10 relative overflow-hidden">
                      {/* Subtle Grid Background */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
                      
                      <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
                         {/* Icon Circle */}
                         <div className="relative group">
                            <div className="absolute inset-0 bg-[#df7afe]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                               <Shield className="w-10 h-10 text-[#df7afe] drop-shadow-[0_0_10px_rgba(223,122,254,0.5)]" />
                            </div>
                            
                            {/* Orbiting Dot */}
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-[-10px] rounded-full"
                            >
                               <div className="w-2 h-2 bg-[#814ac8] rounded-full shadow-[0_0_10px_#814ac8]" />
                            </motion.div>
                         </div>

                         {/* Content */}
                         <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center md:items-baseline gap-4 mb-4">
                               <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Suspicious Activity Detected</h3>
                               <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-xs font-bold uppercase tracking-wider animate-pulse">
                                  Critical Alert
                               </span>
                            </div>
                            
                            <p className="text-zinc-400 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                               Anomalous layering pattern detected across <span className="text-white font-medium">12 linked accounts</span> with high-velocity transactions matching known smurfing typologies.
                            </p>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-white/5 pt-6">
                               <div>
                                  <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Confidence</div>
                                  <div className="text-2xl font-bold text-white">99.8%</div>
                               </div>
                               <div>
                                  <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Risk Score</div>
                                  <div className="text-2xl font-bold text-[#df7afe]">High</div>
                               </div>
                               <div>
                                  <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Time to Detect</div>
                                  <div className="text-2xl font-bold text-white">12ms</div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>

             {/* Background Stars / Particles */}
             {[...Array(5)].map((_, i) => (
                <motion.div
                   key={i}
                   className="absolute w-1 h-1 bg-white rounded-full"
                   style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5 + 0.2
                   }}
                   animate={{ 
                      scale: [1, 1.5, 1], 
                      opacity: [0.3, 0.8, 0.3] 
                   }}
                   transition={{ 
                      duration: 2 + Math.random() * 3, 
                      repeat: Infinity,
                      delay: Math.random() * 2 
                   }}
                />
             ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Grid (Capabilities) */}
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
              icon={<Lock className="w-6 h-6 text-[#814ac8]" />}
              title="Shell Accounts"
              description="Pinpoint dormant or pass-through nodes that exist solely to move funds, characterizing them by degree and volume ratio."
              delay={0.2}
            />
          </motion.div>
        </div>
      </section>

      <div className="relative">
        <WaterGradientBackground />

        {/* Solutions Section - NEW */}
        <section className="py-32 relative z-10" id="solutions">
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <h2 className="text-sm font-bold text-[#df7afe] uppercase tracking-widest mb-3">Solutions</h2>
              <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Enterprise-Grade Defense</h3>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                 { title: "AML Compliance", desc: "Automated monitoring for regulatory reporting and audit trails." },
                 { title: "Payment Fraud", desc: "Real-time blocking of suspicious transactions before settlement." },
                 { title: "Identity Theft", desc: "Detect synthetic identities through network link analysis." },
                 { title: "Merchant Risk", desc: "Assess risk profiles of new and existing merchant accounts." },
                 { title: "Crypto Tracing", desc: "Track illicit funds across blockchain hops and mixers." },
                 { title: "Internal Audit", desc: "Identify employee collusion and embezzlement schemes." }
               ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group p-8 bg-[#0a0a0a]/40 backdrop-blur-sm border border-white/5 hover:border-[#814ac8]/50 rounded-3xl transition-all duration-500 cursor-default relative overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-[#814ac8]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#814ac8]/20 blur-[50px] group-hover:bg-[#814ac8]/30 transition-all duration-500 rounded-full pointer-events-none" />
                     
                     <div className="relative z-10">
                        <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5 group-hover:border-[#814ac8]/30">
                           <CheckCircle2 className="w-6 h-6 text-zinc-500 group-hover:text-[#df7afe] transition-colors duration-300" />
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[#df7afe] transition-colors duration-300">{item.title}</h4>
                        <p className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">{item.desc}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Technology Section - REDESIGNED */}
      <section className="py-32 relative z-10 overflow-hidden" id="technology">

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-center max-w-3xl mx-auto mb-20"
            >
               <h2 className="text-sm font-bold text-[#814ac8] uppercase tracking-widest mb-3">Technology</h2>
               <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#df7afe] to-[#814ac8]">Hyperscale</span> Intelligence
               </h3>
               <p className="text-lg text-zinc-400">
                  A modern stack designed for low-latency decisioning on billion-node graphs.
               </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
               {/* Card 1: Hyperscale Engine (Large Left) */}
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.01 }}
                  className="md:col-span-7 bg-[#0d0d0d] border border-white/5 rounded-3xl p-8 relative overflow-hidden group"
               >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#814ac8]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                     <div className="w-12 h-12 rounded-xl bg-[#814ac8]/10 flex items-center justify-center mb-6">
                        <Cpu className="w-6 h-6 text-[#df7afe]" />
                     </div>
                     <h4 className="text-2xl font-bold text-white mb-2">Graph Neural Engine</h4>
                     <p className="text-zinc-400 mb-8 max-w-sm">
                        Proprietary Rust-based runtime executing complex traversals in microseconds.
                     </p>
                     
                     {/* Visual: Simulated Code/Terminal */}
                     <div className="bg-[#151515] rounded-xl border border-white/5 p-4 font-mono text-xs text-zinc-300 shadow-2xl">
                        <div className="flex gap-1.5 mb-3">
                           <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                           <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                           <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                        </div>
                        <div className="space-y-1">
                           <p><span className="text-[#df7afe]">fn</span> <span className="text-zinc-300">detect_cycle</span>(graph: &Graph) -{'>'} Result {'{'}</p>
                           <p className="pl-4 text-zinc-500">// efficient DFS with path pruning</p>
                           <p className="pl-4"><span className="text-[#814ac8]">let</span> nodes = graph.scan_edges(Target::HighRisk);</p>
                           <p className="pl-4"><span className="text-[#df7afe]">await</span> engine.process(nodes);</p>
                           <p>{'}'}</p>
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* Right Column Stack */}
               <div className="md:col-span-5 flex flex-col gap-6 h-full">
                  {/* Card 2: Real-time Ingestion */}
                  <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.1 }}
                     whileHover={{ scale: 1.02 }}
                     className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-8 relative overflow-hidden group flex-1 flex flex-col justify-center"
                  >
                     <div className="absolute right-0 top-0 w-32 h-32 bg-[#df7afe]/10 rounded-full blur-[50px] pointer-events-none" />
                     <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-[#df7afe]/10 flex items-center justify-center mb-4">
                           <Zap className="w-6 h-6 text-[#df7afe]" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Real-time Ingestion</h4>
                        <p className="text-zinc-400 text-sm">
                           Connect via gRPC, Kafka, or REST. <span className="text-white">100k+ events/sec</span> throughput.
                        </p>
                     </div>
                  </motion.div>
                  
                  {/* Card 3: Security */}
                  <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.2 }}
                     whileHover={{ scale: 1.02 }}
                     className="bg-[#0d0d0d] border border-white/5 rounded-3xl p-8 relative overflow-hidden group flex-1 flex flex-col justify-center"
                  >
                     <div className="absolute right-0 top-0 w-32 h-32 bg-[#df7afe]/10 rounded-full blur-[50px] pointer-events-none" />
                     <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-[#df7afe]/10 flex items-center justify-center mb-4">
                           <Lock className="w-6 h-6 text-[#df7afe]" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">Enterprise Security</h4>
                        <p className="text-zinc-400 text-sm">
                           SOC2 Type II ready. End-to-end encryption and granular RBAC.
                        </p>
                     </div>
                  </motion.div>
               </div>
            </div>

            {/* Bottom Row: Integration Ticker */}
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="mt-6 bg-[#0d0d0d] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 h-full"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#814ac8]/10 flex items-center justify-center">
                     <Network className="w-6 h-6 text-[#df7afe]" />
                  </div>
                  <div>
                     <h4 className="text-lg font-bold text-white">Seamless Integration</h4>
                     <p className="text-zinc-400 text-sm">Works with your existing stack.</p>
                  </div>
               </div>
               
               <div className="flex gap-6 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                   <div className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl border-2 border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors bg-black/40">
                         <Cloud className="w-6 h-6 text-white stroke-[1.5]" />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300">AWS</span>
                   </div>
                   <div className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl border-2 border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors bg-black/40">
                         <Database className="w-6 h-6 text-white stroke-[1.5]" />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300">GCP</span>
                   </div>
                   <div className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl border-2 border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors bg-black/40">
                         <Server className="w-6 h-6 text-white stroke-[1.5]" />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300">Azure</span>
                   </div>
                   <div className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl border-2 border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors bg-black/40">
                         <Layers className="w-6 h-6 text-white stroke-[1.5]" />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300">Snowflake</span>
                   </div>
                   <div className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl border-2 border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors bg-black/40">
                         <Box className="w-6 h-6 text-white stroke-[1.5]" />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider group-hover:text-zinc-300">Databricks</span>
                   </div>
               </div>
            </motion.div>
         </div>
      </section>

      </div>

       {/* Trusted By Section - REPLACEMENT */}
       <section className="py-10 border-y border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Trusted by security teams at</span>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
               {['Revolut', 'Monzo', 'Checkout.com', 'Fireblocks', 'Chainalysis'].map((brand, i) => (
                  <span key={i} className="text-lg font-bold text-white/40 hover:text-white transition-colors cursor-default">{brand}</span>
               ))}
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
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center p-4"
        >
            <div className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                {value}
            </div>
            <div className="text-sm font-bold text-[#814ac8] uppercase tracking-widest">{label}</div>
        </motion.div>
    )
}
