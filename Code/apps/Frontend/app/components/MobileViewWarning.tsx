import { 
  
  MonitorX

} from 'lucide-react';

export const MobileWarningOverlay = () => (
  <div className="fixed inset-0 z-[999] bg-[#050505] flex flex-col items-center justify-center p-8 text-center lg:hidden">
    <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mb-8 border border-orange-500/20 animate-pulse">
      <MonitorX className="w-12 h-12 text-orange-500" />
    </div>
    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
      DESKTOP REQUIRED
    </h2>
    <p className="text-gray-400 max-w-xs mx-auto leading-relaxed text-sm font-medium">
      ⚔️ This battle is best fought on a wide screen. Switch to a laptop or desktop to enter the arena.
    </p>
    <div className="mt-8 px-6 py-3 bg-[#111] border border-white/10 rounded-xl text-gray-500 text-xs font-mono">
      Screen Width &lt; 1024px
    </div>
  </div>
);