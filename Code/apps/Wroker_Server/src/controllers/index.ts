import type { Request, Response } from "express"
import fs from 'fs';
import path from 'path';
import client from "../Redis/index.js";



const PROBLEM_DIR = path.join(process.cwd(), 'problems');

export default class BoilerPlate {
    getBoilerPlate = async (req: Request, res: Response) => {
        const { slug, language } = req.params;



        if (!slug || !language) {
            return res.status(400).json({ msg: "Slug or Language  is not found " });
        }



        const cachedCode = await client.get(`code:${slug}-${language}`);
        if (cachedCode) {
            return res.status(200).json({ msg: "Boilerplat Code", code: JSON.parse(cachedCode) });
        }


        if (!fs.existsSync(PROBLEM_DIR)) {
            return res.status(400).json({ msg: "Problem Folder not found " });
        }

        const boilerplatePart = path.join(PROBLEM_DIR, slug, 'boilerplate', `function.${getExtension(language)}`);

        if (!boilerplatePart) {
            return res.status(400).json({ msg: "Boilerplate File is  not Found " });
        }

        const boilerPlateCode = fs.readFileSync(boilerplatePart, 'utf-8');

        if (!boilerPlateCode) {
            return res.status(400).json({ msg: "BoilerPlate Code is not found " });
        }

        await client.set(`code:${slug}-${language}`,JSON.stringify(boilerPlateCode));
        await client.expire(`code:${slug}-${language}`,3600);

        return res.status(200).json({ msg: "Boilerplat Code", code: boilerPlateCode });
    }
}

const getExtension = (lang: string) => {
    switch (lang) {
        case 'javascript': return 'js';
        case 'python': return 'py';
        case 'cpp': return 'cpp';
        case 'java': return 'java';
        default: return 'txt';
    }
}