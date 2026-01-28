"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Swords, Ghost, Code2, Trophy, History, Flame, Map, Zap, Terminal, Quote, ChevronRight, Brain, Loader2
} from 'lucide-react';
import { GridBackground } from '../components/GridBackground';
import { HistoryWidget } from '../components/HistoryWidget';
import { BentoCard } from '../components/BentoCards';
import { MotivationWidget } from '../components/MotivationWidget';
import { JourneyWidget } from '../components/JourneryWidget';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@clerk/nextjs';
import { useSocket } from '../store';

const BattleDashboard = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const { socket } = useSocket();
  const { userId, getToken } = useAuth();

  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  const handleAnonymousClick = async () => {
    router.push('/anonymous/battle');
  }

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/login');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = await getToken();
      
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/battle/leaderboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setLeaderboard(res.data.data);
      } catch (err) {
        console.error("Leaderboard fetch failed", err);
      } finally {
        setLoadingLeaderboard(false);
      }
    };

    if (isSignedIn) {
      fetchLeaderboard();
    }
  }, [isSignedIn, getToken]);

  const userRank = (leaderboard:any) =>{
        const user =  leaderboard.find((e:any)=>e.id==userId);
   
        if(user){
          return user?.rank;
        }else{
          return 'No Rank'
        }
  }

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col gap-4 items-center justify-center text-orange-500 font-mono">
        <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
        <div className="animate-pulse tracking-widest uppercase text-xs">
          {isLoaded ? "Redirecting to Login..." : "Authenticating..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-gray-200 relative flex items-center justify-center p-4 lg:p-8">
      <GridBackground />

      <div className="mt-6 md:mt-12 relative z-10 w-full max-w-9xl flex flex-col md:grid md:grid-cols-12 gap-4 h-auto md:h-[650px]">

        <div className="order-3 md:order-1 md:col-span-3 flex flex-col gap-4 h-full">
          <BentoCard title="Recent Battles" icon={History} className="h-auto md:h-2/3 min-h-[300px]">
            <HistoryWidget />
          </BentoCard>

          <BentoCard title="Daily Wisdom" icon={Flame} className="h-auto md:h-1/3 min-h-[150px] bg-gradient-to-br from-orange-900/10 to-[#0a0a0a]">
            <MotivationWidget />
          </BentoCard>
        </div>

        <div className="order-1 md:order-2 md:col-span-6 flex flex-col gap-4 h-full">
          
          <div className="flex flex-col items-center justify-center py-4">
            <br />
            <h1 className="text-4xl font-black text-white tracking-tighter mb-1">
              CODE<span className="text-orange-500">GLADIATOR</span>
            </h1>
            <p className="text-xs text-gray-500 tracking-[0.2em] uppercase">The Arena Awaits</p>
          </div>

          <div className="grid grid-cols-2 gap-4 h-40 md:h-48"> 
            <button 
              className="group relative bg-[#111] border border-white/5 rounded-2xl p-4 md:p-6 text-left hover:border-orange-500 transition-all overflow-hidden flex flex-col justify-end" 
              onClick={() => router.push('/codeBattle')}
            >
              <div className="absolute top-4 right-4 p-2 md:p-3 bg-[#1a1a1a] rounded-xl text-gray-400 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                <Code2 size={20} className="md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">Create Battle</h3>
              <p className="text-[10px] md:text-xs text-gray-500">Host private room</p>
            </button>

            <button onClick={handleAnonymousClick} className="group relative bg-orange-600 rounded-2xl p-4 md:p-6 text-left hover:bg-orange-500 transition-all overflow-hidden flex flex-col justify-end shadow-lg shadow-orange-900/20">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              <div className="absolute top-4 right-4 p-2 md:p-3 bg-white/10 rounded-xl text-white">
                <Ghost size={20} className="md:w-6 md:h-6" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-white mb-1 relative z-10 group-hover:translate-x-1 transition-transform">Anonymous</h3>
              <p className="text-[10px] md:text-xs text-orange-100 relative z-10">Instant 1v1 Queue</p>
            </button>
          </div>

          <button 
            className="group relative w-full bg-[#111] border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-orange-500/50 hover:bg-[#161616] transition-all"
            onClick={() => router.push('/all-problems')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <Brain size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">Training Ground</h3>
                <p className="text-xs text-gray-500">Solve DSA Problems & Master Algorithms</p>
              </div>
            </div>
            <div className="bg-[#1a1a1a] p-2 rounded-full text-gray-500 group-hover:text-white transition-colors">
              <ChevronRight size={20} />
            </div>
          </button>

          <BentoCard title="Gladiator Journey" icon={Map} className="flex-1 min-h-[120px]">
            <JourneyWidget />
          </BentoCard>
        </div>

        <div className="order-2 md:order-3 md:col-span-3 flex flex-col gap-4 h-full">
          <BentoCard title="Global Status" icon={Trophy} className="h-full min-h-[300px]">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/20">
                <div className="text-xs text-orange-400 font-bold uppercase mb-1">Your Rank</div>
                
                <div className="text-3xl font-black text-white"># {userRank(leaderboard)}</div>
                <div className="text-[10px] text-gray-400">Battle to rise up</div>
              </div>

              <div className="space-y-2 mt-6">
                <div className="text-xs text-gray-500 font-bold uppercase px-1 mb-2">Top Gladiators</div>
                
                {loadingLeaderboard ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin text-orange-500" />
                  </div>
                ) : (
                  leaderboard.length > 0 ? (
                    leaderboard.map((player: any, i) => (
                      <div key={player.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-mono font-bold w-4 ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-700' : 'text-gray-600'}`}>
                            0{i + 1}
                          </span>
                          <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                             i === 0 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-[#222] text-gray-400'
                          }`}>
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                          <span className={`text-sm ${player.id === userId ? 'text-orange-400 font-bold' : 'text-gray-300 group-hover:text-white'}`}>
                            {player.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">{player.wins} W</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-xs text-gray-500 py-4">No champions yet.</div>
                  )
                )}
              </div>
            </div>
          </BentoCard>
        </div>

      </div>
    </div>
  );
};

export default BattleDashboard;