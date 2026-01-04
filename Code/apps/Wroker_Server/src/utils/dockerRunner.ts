import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { LANGUAGE_CONFIG } from '../utils/languageConfig.js'; // Ensure this path is correct based on your folder structure

// --- CONFIGURATION ---
const TEMP_DIR = path.join(process.cwd(), 'temp');
const DRIVERS_DIR = path.join(process.cwd(), 'drivers'); // Folder where you keep driver.js, driver.py, etc.
const TIMEOUT_MS = 5000; // 5 Seconds hard limit for execution

// Ensure Temp Directory exists
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

interface ExecutionResult {
    success: boolean;
    output?: string;
    error?: string;
}

/**
 * SPOWNS A DOCKER CONTAINER TO RUN USER CODE SECURELY
 * @param jobId - Unique ID for the submission
 * @param userCode - The raw code written by the user
 * @param fullInputs - The massive batch input string (already loaded from file store)
 * @param language - The language slug (e.g., 'javascript', 'python')
 */
export const executeDocker = async (
    jobId: string,
    userCode: string,
    fullInputs: string,
    language: string
): Promise<ExecutionResult> => {

    return new Promise(async (resolve, reject) => {
        // 1. VALIDATE LANGUAGE
        const config = LANGUAGE_CONFIG[language];
        if (!config) {
            return resolve({ success: false, error: `Language '${language}' not supported.` });
        }

        const uniqueId = `job_${jobId}`;
        const codeFilename = config.fileName; // e.g., "run.js"
        const codeFilePath = path.join(TEMP_DIR, `${uniqueId}_${codeFilename}`);
        const inputFilePath = path.join(TEMP_DIR, `${uniqueId}.txt`);

        try {
            // 2. PREPARE CODE (MERGE DRIVER + USER CODE)
            // We read the "Universal Driver" for this language to wrap the user's function
            const driverPath = path.join(DRIVERS_DIR, language, `driver.${getExtension(language)}`);

            let finalCode = userCode;

            if (fs.existsSync(driverPath)) {
                const driverCode = fs.readFileSync(driverPath, 'utf-8');
                // We append the driver. The Driver is responsible for calling the user's function.
                finalCode = `${userCode}\n\n${driverCode}`;
            } else {
                console.warn(`⚠️ Driver not found for ${language} at ${driverPath}. Running raw code.`);
            }

            // 3. WRITE FILES TO DISK (So Docker can see them)
            fs.writeFileSync(codeFilePath, finalCode);
            fs.writeFileSync(inputFilePath, fullInputs);

            // 4. CONSTRUCT DOCKER COMMAND
            const dockerArgs = [
                'run',
                '--rm',               // Delete container after run
                '--network', 'none',  // 🔒 Security: No Internet access
                '--memory', '128m',   // 🔒 Security: Limit RAM to 128MB
                '--cpus', '0.5',      // 🔒 Security: Limit CPU usage

                // VOLUME MOUNTS (-v host_path:container_path)
                '-v', `${codeFilePath}:/app/${codeFilename}`,
                '-v', `${inputFilePath}:/app/input.txt`,

                '-i',                 // Keep stdin open for piping
                config.image,         // Dynamic Image (e.g. node:18-alpine)

                // The Command: Run the code and pipe input.txt into it
                'sh', '-c', `${config.runCommand(`/app/${codeFilename}`)} < /app/input.txt`
            ];

            // 5. SPAWN PROCESS
            console.log(`🐳 Spawning Docker: ${language} for Job ${jobId}`);
            const dockerProcess = spawn('docker', dockerArgs);
           
            
            // 6. HANDLE STREAMS & TIMEOUT
            let stdoutData = '';
            let stderrData = '';
            let isTimedOut = false;

            console.log(stderrData, stdoutData);

            // Safety Timer: Kill process if it takes too long (Infinite Loops)
            const timer = setTimeout(() => {
                isTimedOut = true;
                console.error(`⏱️ Job ${jobId} Timed Out! Killing container...`);
                dockerProcess.kill();
                resolve({ success: false, error: 'Time Limit Exceeded (5s)' });
            }, TIMEOUT_MS);

            dockerProcess.stdout.on('data', (data) => {
                stdoutData += data.toString();
                // TODO: If you want real-time logs in frontend, publish to Redis here!
                // redisPublisher.publish(`logs:${jobId}`, data.toString());
            });

            dockerProcess.stderr.on('data', (data) => {
                stderrData += data.toString();
            });

            dockerProcess.on('close', (code) => {
                clearTimeout(timer); // Stop the timer if it finished successfully
                if (isTimedOut) return; // Already handled by timeout logic

                // Cleanup: Delete temporary files
                cleanupFiles(codeFilePath, inputFilePath);

                if (code === 0) {
                    resolve({ success: true, output: stdoutData });
                } else {
                    // Non-zero exit code means runtime error or compilation error
                    resolve({ success: false, error: stderrData || 'Unknown Runtime Error' });
                }
            });

            dockerProcess.on('error', (err) => {
                clearTimeout(timer);
                cleanupFiles(codeFilePath, inputFilePath);
                resolve({ success: false, error: `Docker Spawn Error: ${err.message}` });
            });

        } catch (error: any) {
            resolve({ success: false, error: `System Error: ${error.message}` });
        }
    });
};

// --- HELPER FUNCTIONS ---

const getExtension = (lang: string) => {
    switch (lang) {
        case 'javascript': return 'js';
        case 'python': return 'py';
        case 'cpp': return 'cpp';
        case 'java': return 'java';
        default: return 'txt';
    }
}

const cleanupFiles = (...paths: string[]) => {
    paths.forEach(p => {
        try {
            if (fs.existsSync(p)) fs.unlinkSync(p);
        } catch (e) {
            console.error(`Failed to delete temp file: ${p}`);
        }
    });
}