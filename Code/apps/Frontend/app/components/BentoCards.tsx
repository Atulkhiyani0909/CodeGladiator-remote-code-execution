export const BentoCard = ({ children, className = "", title, icon: Icon, action }: any) => (
    <div className={`bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/5 p-5 rounded-2xl flex flex-col relative overflow-hidden group hover:border-orange-500/30 transition-all duration-300 ${className}`}>
        {title && (
            <div className="flex justify-between items-center mb-4 z-10">
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-orange-500 transition-colors">
                    {Icon && <Icon size={16} />}
                    <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
                </div>
                {action}
            </div>
        )}
        <div className="relative z-10 flex-1">{children}</div>
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
);
