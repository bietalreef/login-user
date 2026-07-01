import { motion } from 'motion/react';
import { Brain, Glasses, Building2, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const floatingAnimation = {
  y: [0, -10, 0],
  rotate: [0, 0.5, 0],
};

const floatingTransition = {
  duration: 8,
  repeat: Infinity,
  ease: 'easeInOut',
};

export function FloatingCards() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* AI Card - Top Left */}
      <motion.div
        className="absolute top-[10%] left-[8%] w-[280px]"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0, ...floatingAnimation }}
        transition={{ ...floatingTransition, delay: 0.3 }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="backdrop-blur-xl bg-white/40 rounded-[20px] p-5 shadow-2xl border border-white/50"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.2)',
          }}
          whileHover={{ scale: 1.05, rotateY: 5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-[#D4AF37]/20 to-[#C8A86A]/20 rounded-xl">
              <Brain className="w-5 h-5 text-[#B8940E]" />
            </div>
            <span className="text-amber-900/80">AI Blueprint Generator</span>
          </div>
          <div className="relative h-[140px] rounded-xl overflow-hidden mb-3">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1742415106102-77bbfe14b872?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwYmx1ZXByaW50JTIwcGxhbnxlbnwxfHx8fDE3NjI5OTIwOTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="AI Blueprint"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-900/60">Generating plans...</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* VR/AR Card - Top Right */}
      <motion.div
        className="absolute top-[15%] right-[6%] w-[300px]"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0, ...floatingAnimation }}
        transition={{ ...floatingTransition, delay: 0.5 }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="backdrop-blur-xl bg-white/35 rounded-[20px] p-5 shadow-2xl border border-white/50"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.2)',
          }}
          whileHover={{ scale: 1.05, rotateY: -5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-gold-400/20 to-yellow-500/20 rounded-xl">
              <Glasses className="w-5 h-5 text-yellow-700" />
            </div>
            <span className="text-amber-900/80">VR Design Experience</span>
          </div>
          <div className="relative h-[160px] rounded-xl overflow-hidden mb-3">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1459550532302-ba13832edcdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWUiUyMHZpcnR1YWwlMjByZWFsaXR5JTIwYXJjaGl0ZWN0fGVufDF8fHx8MTc2Mjk5MjA5MXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="VR Experience"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {/* Floating 3D elements overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg border border-white/40"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-amber-900/60">Immersive 3D visualization</p>
        </motion.div>
      </motion.div>

      {/* 3D Model Card - Bottom Left */}
      <motion.div
        className="absolute bottom-[12%] left-[6%] w-[320px]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0, ...floatingAnimation }}
        transition={{ ...floatingTransition, delay: 0.7 }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="backdrop-blur-xl bg-white/45 rounded-[20px] p-5 shadow-2xl border border-white/50"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.25)',
          }}
          whileHover={{ scale: 1.05, rotateX: 5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-xl">
              <Building2 className="w-5 h-5 text-amber-700" />
            </div>
            <span className="text-amber-900/80">3D Building Model</span>
          </div>
          <div className="relative h-[180px] rounded-xl overflow-hidden bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1759090889049-9c5603272569?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3aGl0ZSUyMGFyY2hpdGVjdHVyZSUyMGJ1aWxkaW5nJTIwbW9kZWx8ZW58MXx8fHwxNzYyOTkyMDkwfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="3D Model"
              className="w-full h-full object-cover"
            />
            <motion.div
              className="absolute bottom-2 right-2 px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-xs text-white"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Rendering...
            </motion.div>
          </div>
          <div className="mt-3 flex justify-between text-xs text-amber-900/60">
            <span>Villa Model A-102</span>
            <span>450 m²</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Company Card - Bottom Right */}
      <motion.div
        className="absolute bottom-[15%] right-[7%] w-[340px]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0, ...floatingAnimation }}
        transition={{ ...floatingTransition, delay: 0.9 }}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="backdrop-blur-xl bg-white/40 rounded-[20px] p-5 shadow-2xl border border-white/50"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.2)',
          }}
          whileHover={{ scale: 1.05, rotateX: -5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8940E] rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-amber-900/90 mb-1">Al Manara Construction</h4>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="text-xs text-amber-900/60 ml-1">5.0</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-[100px] rounded-xl overflow-hidden mb-3">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1636414722386-a73bd3fc368c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBjb21wYW55JTIwdGVhbXxlbnwxfHx8fDE3NjI5OTIwOTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Company Project"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-2 left-2 text-white text-xs">
              Latest Project: Dubai Creek Tower
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-900/60">127 Projects Completed</span>
            <motion.button
              className="px-3 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B8940E] text-white rounded-lg pointer-events-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Profile
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}