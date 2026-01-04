'use client'

import { Swords } from "lucide-react";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();

  return (
    <>
      <nav className="bg-black/50 backdrop-blur-md py-4 px-6 fixed w-full z-50 border-b border-orange-900/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 text-white font-black text-2xl tracking-tighter  **hover:cursor-pointer**" onClick={() => {
            router.push('/')
          }}>
            <div className="bg-orange-500 p-1.5 rounded-lg">
              <Swords size={20} className="text-black" />
            </div>
            <span>CODE<span className="text-orange-500">GLADIATOR</span></span>
          </div>
        </div>
      </nav>
    </>
  );
};