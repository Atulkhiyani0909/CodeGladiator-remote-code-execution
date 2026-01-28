'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { Trophy, Lock, CheckCircle2 } from 'lucide-react';

const MILESTONES = [0, 5, 10, 15, 30, 50, 100];

const RANKS = {
    0: 'Novice',
    5: 'Apprentice',
    10: 'Warrior',
    15: 'Gladiator',
    30: 'Veteren',
    50: 'Warlord',
    100: 'Legend'
};

export const JourneyWidget = () => {
    const { userId, getToken } = useAuth();
    const [wins, setWins] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!userId) return;
            try {
                const token = await getToken();
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/battle/history/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                const winCount = res.data.data.filter((b: any) => b.winnerId === userId).length;
                setWins(winCount);
            } catch (err) {
                console.error("Failed to fetch journey stats");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [userId, getToken]);

    const nextMilestone = MILESTONES.find(m => m > wins) || 100;
    const currentRankName = Object.entries(RANKS).reverse().find(([k]) => wins >= Number(k))?.[1] || 'Novice';
    const nextRankName = RANKS[nextMilestone as keyof typeof RANKS] || 'Max Rank';

    if (loading) return <div className="h-full flex items-center justify-center text-xs text-zinc-600 animate-pulse">Syncing Journey...</div>;

    
    const nextIndex = MILESTONES.findIndex(m => m > wins);
    const startIndex = Math.max(0, nextIndex - 2);
    const visibleMilestones = MILESTONES.slice(startIndex, startIndex + 5);

    return (
        <div className="relative h-full flex flex-col justify-center w-full px-4 overflow-hidden">
            
            <div className="flex justify-between items-end mb-6">
                <div>
                    <div className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mb-1">Current Rank</div>
                    <div className="text-xl font-black text-white flex items-center gap-2">
                        {currentRankName}
                        <span className="text-xs font-mono text-zinc-500 font-normal bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                            {wins} Wins
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Next Rank</div>
                    <div className="text-xs font-bold text-zinc-400">{nextRankName} <span className="text-zinc-600">({nextMilestone})</span></div>
                </div>
            </div>

            <div className="relative flex items-center justify-between mt-2">
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-900 -z-10"></div>
                <div 
                    className="absolute top-1/2 left-0 h-[2px] bg-orange-600/50 -z-10 transition-all duration-1000"
                    style={{ width: `${Math.min(100, (wins / nextMilestone) * 100)}%` }}
                ></div>

                {visibleMilestones.map((milestone, i) => {
                    const isCompleted = wins >= milestone;
                    const isCurrent = wins >= milestone && (MILESTONES[MILESTONES.indexOf(milestone) + 1]! > wins || milestone === 100);

                    return (
                        <div key={milestone} className="flex flex-col items-center gap-3 relative group">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10
                                ${isCurrent 
                                    ? 'bg-orange-500 border-orange-400 text-black shadow-[0_0_15px_rgba(249,115,22,0.5)] scale-110' 
                                    : isCompleted 
                                        ? 'bg-zinc-800 border-orange-500/30 text-orange-500' 
                                        : 'bg-[#050505] border-zinc-800 text-zinc-700'
                                }`}>
                                {isCurrent ? (
                                    <Trophy size={14} fill="currentColor" />
                                ) : isCompleted ? (
                                    <CheckCircle2 size={14} />
                                ) : (
                                    <Lock size={12} />
                                )}
                            </div>
                            
                            <div className={`absolute -bottom-8 flex flex-col items-center transition-all duration-300 ${isCurrent ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                                <span className={`text-[10px] font-bold ${isCurrent ? 'text-white' : 'text-zinc-600'}`}>
                                    {milestone}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};