export const JourneyWidget = () => (
  <div className="relative h-full flex items-center justify-between px-2">
   
    <div className="absolute top-1/2 left-0 w-full h-1 bg-[#1a1a1a] -z-10"></div>
    
    {[
      { lvl: 1, active: true },
      { lvl: 5, active: true },
      { lvl: 10, active: false },
    ].map((step, i) => (
      <div key={i} className="flex flex-col items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all
          ${step.active ? 'bg-orange-500 border-black text-white' : 'bg-[#111] border-[#222] text-gray-700'}`}>
          <span className="text-[10px] font-bold">{step.lvl}</span>
        </div>
        <span className="text-[10px] uppercase text-gray-500 tracking-wider">Lvl {step.lvl}</span>
      </div>
    ))}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0a] px-2 text-xs text-gray-500 font-mono">
      NEXT: WARLORD
    </div>
  </div>
);