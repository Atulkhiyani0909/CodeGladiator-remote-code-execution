import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// --- FIX FOR ES MODULES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// --------------------------

// 1. CONFIGURATION
const PROBLEM_SLUG = "simple-sum";



// The input is two space-separated numbers
const TEST_CASES = [
    { input: "1000 2",     output: "1002" },
    { input: "10 50",   output: "60" },
    { input: "-5 5",    output: "0" },
    { input: "100 200", output: "300" }
];

// The starting code the user sees
const BOILERPLATE_JS = `
/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function solve(a, b) {
  // Write your code here
  return 0;
}
`;

function createProblem() {
    // Define Paths
    const baseDir = path.join(__dirname, "problems", PROBLEM_SLUG);
    const inputDir = path.join(baseDir, "inputs");
    const outputDir = path.join(baseDir, "outputs");
    const boilerplateDir = path.join(baseDir, "boilerplate");

    // 1. Cleanup & Create Directories
    if (fs.existsSync(baseDir)) {
        console.log(`⚠️  Problem '${PROBLEM_SLUG}' exists. Overwriting...`);
        fs.rmSync(baseDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(inputDir, { recursive: true });
    fs.mkdirSync(outputDir, { recursive: true });
    fs.mkdirSync(boilerplateDir, { recursive: true });

    // 2. Generate Files
    let fullInput = "";
    let fullOutput = "";
    const DELIMITER = "\n$$$DELIMITER$$$\n";

    TEST_CASES.forEach((tc, index) => {
        const i = index + 1;
        
        // Save Individual Files (Useful for debugging)
        fs.writeFileSync(path.join(inputDir, `${i}.in`), tc.input);
        fs.writeFileSync(path.join(outputDir, `${i}.out`), tc.output);

        // Append to Batch String
        fullInput += tc.input + DELIMITER;
        fullOutput += tc.output + DELIMITER;
    });

    // 3. Save Batch Files (Trim trailing delimiter)
    // The slice removes the last "\n$$$DELIMITER$$$\n" so we don't have an empty test case at the end
    const trimmedInput = fullInput.slice(0, -DELIMITER.length);
    const trimmedOutput = fullOutput.slice(0, -DELIMITER.length);

    fs.writeFileSync(path.join(baseDir, "full_inputs.txt"), trimmedInput);
    fs.writeFileSync(path.join(baseDir, "full_outputs.txt"), trimmedOutput);

    // 4. Save Boilerplate
    fs.writeFileSync(path.join(boilerplateDir, "function.js"), BOILERPLATE_JS.trim());

    console.log(`✅ Problem '${PROBLEM_SLUG}' created at /problems/${PROBLEM_SLUG}`);
    console.log(`   - 📂 Inputs: ${TEST_CASES.length} test cases generated.`);
    console.log(`   - 📄 Batch Input Size: ${trimmedInput.length} bytes`);
}

createProblem();