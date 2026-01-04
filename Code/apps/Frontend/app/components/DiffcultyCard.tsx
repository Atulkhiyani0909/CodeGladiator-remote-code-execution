export const DifficultyCard = ({ type, selected, onClick }: any) => {
  const Icon = type.icon;
  const isSelected = selected === type.id;

  return (
    <button
      onClick={() => onClick(type.id)}
      className={`relative group p-4 rounded-xl border text-left transition-all duration-300
      ${isSelected 
        ? 'bg-[#1a1a1a] border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)]' 
        : 'bg-[#0a0a0a] border-white/5 hover:border-white/20 hover:bg-[#111]'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg ${isSelected ? 'bg-orange-500/10' : 'bg-[#151515]'} transition-colors`}>
          <Icon size={20} className={isSelected ? 'text-orange-500' : 'text-gray-400'} />
        </div>
        {isSelected && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
      </div>
      <h3 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>{type.label}</h3>
      <p className="text-[10px] text-gray-500 mt-1">{type.desc}</p>
    </button>
  );
};