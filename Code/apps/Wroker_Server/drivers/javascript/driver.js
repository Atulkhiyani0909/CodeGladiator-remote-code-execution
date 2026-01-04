// --- DRIVER CODE START ---
const fs = require('fs'); // <--- CHANGED THIS LINE (Use require, not import)

const DELIMITER = '$$$DELIMITER$$$';

try {
    const input = fs.readFileSync('/app/input.txt', 'utf-8');
    const testCases = input.split(DELIMITER);

    testCases.forEach((testCase) => {
        if (!testCase.trim()) return; 

        // For simple problems (e.g. "10 20"), this works.
        // For array inputs (e.g. "[1,2]"), you might need JSON.parse() later.
        const args = testCase.trim().split(/\s+/).map(Number);
        
        if (typeof solve !== 'function') {
            console.error("Function 'solve' is not defined! Did you change the function name?");
            process.exit(1);
        }

        const result = solve(...args);

        console.log(result);
        console.log(DELIMITER);
    });

} catch (err) {
    console.error("Driver Error:", err.message);
    process.exit(1);
}
// --- DRIVER CODE END ---