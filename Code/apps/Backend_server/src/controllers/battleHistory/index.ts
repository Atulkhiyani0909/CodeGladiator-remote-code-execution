import type { Request, Response } from "express";
import prisma from "../../DB/db.js";

export default class BattleHistory {
    getAllBattleHistory = async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            return res.status(404).json({ msg: "No user Id found " });
        }
        try {
            const data = await prisma.battle.findMany({
                where: {
                    OR: [
                        { playerAId: id },
                        { playerBId: id }
                    ]
                },
                orderBy: {
                    startTime: 'desc'
                },
                include: {
                    playerA: true,
                    playerB: true,
                    winner: true
                }
            });

            return res.status(200).json({ msg: "All Battles", data: data });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Internal Server Error" });
        }
    }
   

getLeaderboard = async (req: Request, res: Response) => {
    try {
       
        const topWinners = await prisma.battle.groupBy({
            by: ['winnerId'],
            _count: {
                winnerId: true
            },
            orderBy: {
                _count: {
                    winnerId: 'desc'
                }
            },
            take: 5,
            where: {
                winnerId: {
                    not: null
                }
            }
        });

     
        const userIds = topWinners.map(w => w.winnerId as string);
        const users = await prisma.user.findMany({
            where: {
                id: { in: userIds }
            },
            select: {
                id: true,
                name: true,
                email: true 
            }
        });

       
        const leaderboard = topWinners.map((entry, index) => {
            const user = users.find(u => u.id === entry.winnerId);
            return {
                rank: index + 1,
                id: entry.winnerId,
                name: user?.name || user?.email?.split('@')[0] || "Unknown Gladiator",
                wins: entry._count.winnerId
            };
        });

        return res.status(200).json({ msg: "Leaderboard", data: leaderboard });

    } catch (error) {
        console.error("Leaderboard Error:", error);
        return res.status(500).json({ msg: "Error fetching leaderboard" });
    }
}
}