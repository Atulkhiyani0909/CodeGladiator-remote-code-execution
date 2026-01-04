export const LANGUAGE_CONFIG: any = {
    "javascript": {
        image: "node:18-alpine",
        fileName: "run.js",
        runCommand: (filePath: string) => `node ${filePath}`
    },
    "python": {
        image: "python:3.9-slim",
        fileName: "run.py",
        runCommand: (filePath: string) => `python3 -u ${filePath}`
    },
    "cpp": {
        image: "gcc:latest",
        fileName: "run.cpp",
        runCommand: (filePath: string) => `g++ -o /app/a.out ${filePath} && /app/a.out`
    }
};