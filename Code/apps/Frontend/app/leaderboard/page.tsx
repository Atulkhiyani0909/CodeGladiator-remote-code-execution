'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Medal, Crown, Loader2, AlertCircle, Shield, Users, Trophy } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';

const Page = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/battle/leaderboard`
        );
        setLeaderboard(res.data.data);
      } catch (err) {
        console.error("Failed to fetch public leaderboard:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500/20" />;
      case 2: return <Medal className="w-6 h-6 text-zinc-300 fill-zinc-300/20" />;
      case 3: return <Medal className="w-6 h-6 text-orange-700 fill-orange-700/20" />;
      default: return <span className="text-zinc-500 font-mono font-bold text-lg">#{rank}</span>;
    }
  };

  const getRowStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/30 hover:border-yellow-500/50";
    if (rank === 2) return "bg-zinc-300/5 border-zinc-300/10 hover:bg-zinc-300/10";
    if (rank === 3) return "bg-orange-900/10 border-orange-500/10 hover:bg-orange-500/10";
    return "bg-[#0f0f0f] border-white/5 hover:border-white/10 hover:bg-[#141414]";
  };

  return (
    <section className="min-h-screen py-24 px-4 md:px-6 relative z-10 bg-[#050505]">
      
      
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-orange-900/10 to-transparent pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <SectionHeader
          title="Global <span class='text-orange-500'>Rankings</span>"
          subtitle="The complete roster of gladiators fighting for code supremacy."
        />

       
        {!loading && !error && (
            <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase tracking-widest">
                    <Users size={14} />
                    <span>Total Warriors: {leaderboard.length}</span>
                </div>
                <div className="flex items-center gap-2 text-orange-500/50 text-xs font-mono uppercase tracking-widest">
                    <Trophy size={14} />
                    <span>Season 1</span>
                </div>
            </div>
        )}

        <div className="relative">
          
      
          <div className="sticky top-0 z-20 backdrop-blur-md bg-[#050505]/80 border-b border-white/10 grid grid-cols-12 gap-4 px-6 py-4 text-xs font-bold tracking-widest text-zinc-500 uppercase rounded-t-xl">
            <div className="col-span-2 md:col-span-2 text-center">Rank</div>
            <div className="col-span-7 md:col-span-8">Gladiator</div>
            <div className="col-span-3 md:col-span-2 text-right">Victories</div>
          </div>

          <div className="space-y-2 mt-2 pb-20">
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-b-xl bg-[#0a0a0a]/50">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
                <p className="text-zinc-500 text-sm font-mono animate-pulse">SYNCING_DATABASE...</p>
              </div>
            ) : error ? (
              <div className="h-64 flex flex-col items-center justify-center border border-red-500/20 rounded-b-xl bg-red-500/5 text-red-500">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p className="text-sm">Unable to retrieve rankings</p>
              </div>
            ) : leaderboard.length === 0 ? (
               <div className="h-64 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-b-xl bg-[#0a0a0a] text-zinc-500">
                <Shield className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No Gladiators have risen yet.</p>
              </div>
            ) : (
              leaderboard.map((player: any, index: number) => {
                const rank = index + 1;
                return (
                  <div 
                    key={player.id} 
                    className={`grid grid-cols-12 gap-4 px-6 py-6 rounded-xl border items-center transition-all duration-300 group ${getRowStyle(rank)}`}
                  >
                    
                
                    <div className="col-span-2 md:col-span-2 flex justify-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${rank <= 3 ? 'bg-black/40 shadow-lg' : ''}`}>
                        {getRankIcon(rank)}
                      </div>
                    </div>

                 
                    <div className="col-span-7 md:col-span-8 flex items-center gap-4">
                
                      <div className={`w-12 h-12 rounded-xl hidden md:flex items-center justify-center text-lg font-bold shadow-inner
                        ${rank === 1 ? 'bg-yellow-500 text-black shadow-yellow-500/20' : 
                          rank === 2 ? 'bg-zinc-300 text-black shadow-zinc-300/20' :
                          rank === 3 ? 'bg-orange-700 text-white shadow-orange-700/20' :
                          'bg-[#1a1a1a] text-zinc-500 border border-white/5'}`}>
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex flex-col">
                        <div className={`font-bold text-base md:text-lg transition-colors ${rank === 1 ? 'text-yellow-500' : 'text-zinc-200 group-hover:text-white'}`}>
                          {player.name}
                        </div>
                        {rank === 1 && <div className="text-[10px] text-yellow-500/60 font-mono tracking-wider">REIGNING CHAMPION</div>}
                        {rank === 2 && <div className="text-[10px] text-zinc-500 font-mono tracking-wider">GRANDMASTER</div>}
                        {rank === 3 && <div className="text-[10px] text-orange-700/60 font-mono tracking-wider">ELITE WARRIOR</div>}
                      </div>
                    </div>

               
                    <div className="col-span-3 md:col-span-2 text-right">
                      <span className={`font-mono font-black text-xl ${rank === 1 ? 'text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'text-zinc-400 group-hover:text-white'}`}>
                        {player.wins}
                      </span>
                      <span className="text-xs text-zinc-600 ml-1 font-bold">WINS</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Page;