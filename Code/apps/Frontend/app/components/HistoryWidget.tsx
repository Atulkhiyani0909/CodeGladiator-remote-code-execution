export const HistoryWidget = () => (
    <div className="space-y-3 mt-10">
        {[
            { res: 'WIN', time: '12m ago', opp: 'CyberNinja', score: '+25' },
            { res: 'LOSS', time: '2h ago', opp: 'AlgoMaster', score: '-18' },
            { res: 'WIN', time: '5h ago', opp: 'DevKiller', score: '+30' },
        ].map((match, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border-l-2 border-transparent hover:border-orange-500">
                <div className="flex flex-col">
                    <span className={`text-xs font-bold ${match.res === 'WIN' ? 'text-green-500' : 'text-red-500'}`}>{match.res}</span>
                    <span className="text-[10px] text-gray-500">{match.time}</span>
                </div>
                <div className="text-right">
                    <div className="text-sm font-medium text-gray-300">{match.opp}</div>
                    <div className="text-xs text-gray-500">{match.score} LP</div>
                </div>
            </div>
        ))}
    </div>
);