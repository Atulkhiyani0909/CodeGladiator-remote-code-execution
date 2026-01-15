import type { Request, Response } from "express";
import prisma from "../../DB/db.js";

export default class Submission {
    getSubmissionStatus = async (req: Request, res: Response) => {
        const { userId } = req.body;
        const { problemId } = req.params;

        if (!userId || !problemId) {
            return res.status(404).json({ msg: "No found any User Id" })
        }
        const result = await prisma.submission.findMany({
            where: {
                userId: userId,
                problemId: problemId
            },
            include: {
                language: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return res.status(200).json({ msg: "Your Submission", data: result });
    }
    getSubmissionByID = async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "No ID was found" });
        }

        try {
            const submission = await prisma.submission.findUnique({
                where: {
                    id: id
                }
            })

            console.log(submission);


            return res.status(200).json({msg:"",code:submission});
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ msg: "Server error" });
        }
    }
}