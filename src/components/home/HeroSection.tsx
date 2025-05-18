
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export const HeroSection = () => {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center text-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-black via-black to-transparent z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-purple-900/20 to-orange-500/20 z-0" />
      </div>
      
      {/* Content */}
      <div className="z-10 max-w-4xl">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-white">build.</span>
          <span className="text-white">launch.</span>
          <span className="text-white">win.</span>
        </motion.h1>

        <motion.h2 
          className="text-5xl md:text-7xl font-bold mb-10 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          no code required.
        </motion.h2>

        <motion.p 
          className="text-xl text-zinc-300 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Lovable, Anthropic, Supabase, Sentry, EQT Ventures, and ElevenLabs
          are joining forces to help aspiring founders and builders turn their
          boldest ideas into reality - no coding required.
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 flex flex-col items-center cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        onClick={scrollToContent}
      >
        <span className="text-zinc-400 mb-2">Scroll to explore</span>
        <ArrowDown className="text-zinc-400 animate-bounce" />
      </motion.div>
    </section>
  );
};
