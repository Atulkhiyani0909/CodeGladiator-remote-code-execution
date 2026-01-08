import React from 'react'



export function ProblemSection() {
    
    return (
        <div className="w-1/2 px-12 py-20 flex flex-col justify-center">
                <h1 className="text-5xl font-extrabold leading-tight">
                    Code like the Best. <br />
                    <span className="text-orange-500">Become a Gladiator.</span>
                </h1>

                <p className="mt-6 text-gray-400 max-w-lg">
                    Enter the ultimate competitive coding arena. Solve timed challenges,
                    climb the leaderboard, and prove your logic in real-time battles.
                </p>

                <div className="mt-10 flex gap-4">
                    <button className="bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-lg font-semibold shadow-lg">
                        Enter the Arena
                    </button>

                    <button className="border border-orange-500 text-orange-400 px-6 py-3 rounded-lg hover:bg-orange-500 hover:text-black transition">
                        View Leaderboard
                    </button>
                </div>
            </div>
    )
}

export default ProblemSection
