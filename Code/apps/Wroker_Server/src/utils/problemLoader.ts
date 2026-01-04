import fs from 'fs';
import path from 'path';

// Define where your 'problems' folder lives. 
// process.cwd() usually points to your project root where package.json is.
const PROBLEMS_DIR = path.join(process.cwd(), 'problems');

export const loadProblemData = (slug: string) => {
    const problemPath = path.join(PROBLEMS_DIR, slug);
    
    // 1. Sanity Check: Does this problem match a folder?
    if (!fs.existsSync(problemPath)) {
        throw new Error(`Problem '${slug}' not found on server.`);
    }

    const inputPath = path.join(problemPath, 'full_inputs.txt');
    const outputPath = path.join(problemPath, 'full_outputs.txt');

    // 2. Read the Batch Files (Synchronous is fine here, it's fast)
    try {
        const fullInputs = fs.readFileSync(inputPath, 'utf-8');
        const fullOutputs = fs.readFileSync(outputPath, 'utf-8');

        return { fullInputs, fullOutputs };
    } catch (error) {
        throw new Error(`Missing test files for problem '${slug}'.`);
    }
};