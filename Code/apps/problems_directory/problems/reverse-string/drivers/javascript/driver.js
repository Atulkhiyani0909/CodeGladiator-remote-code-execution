const fs = require('fs');
const DELIMITER = '$$$DELIMITER$$$';

try {
    const inputData = fs.readFileSync('/app/input.txt', 'utf-8');
    // Split by delimiter and filter empty entries
    const testCases = inputData.split(DELIMITER).map(tc => tc.trim()).filter(tc => tc !== '');

    testCases.forEach((testCase) => {
        const lines = testCase.split('\n').map(l => l.trim()).filter(l => l !== '');
        
        let arg0 = lines[0].trim();
        if (arg0.startsWith('"') && arg0.endsWith('"')) {
            arg0 = arg0.slice(1, -1);
        }

        const result = reverseString(arg0);
        
        // Output JSON stringified result
        console.log(JSON.stringify(result));
        console.log(DELIMITER);
    });
} catch (err) {
    console.error(err);
}