import express from 'express'
import { createClient } from 'redis';
import { loadProblemData } from './utils/problemLoader.js';
import { executeDocker } from './utils/dockerRunner.js';

const client = createClient();

console.log(client);


const app = express();



async function main() {
    await client.connect();

    while (1) {
        const submission = await client.brPop('Execution', 0);

        //@ts-ignore
        const resposne = JSON.parse(submission?.element);
        console.log(resposne);

        const result = await loadProblemData(resposne.problem.slug);

        console.log(result);

        try {
            // 1. LOAD TEST CASES (Using the Slug)
            // This goes to /problems/simple-sum/full_inputs.txt
            const { fullInputs, fullOutputs } = loadProblemData(resposne.problem.slug);

            // 2. EXECUTE DOCKER
            // We pass the LOADED inputs to Docker
            const result = await executeDocker(resposne.id, resposne.code, fullInputs, resposne.language.name);

            console.log("---------------------------------");
            console.log("🤖 Docker Exit Success:", result.success);
            console.log("📤 User Output (Raw):", JSON.stringify(result.output));
            console.log("📄 Expected Output:  ", JSON.stringify(fullOutputs.trim()));
            console.log("---------------------------------");

            if (result.success) {
                const DELIMITER = "$$$DELIMITER$$$";

                // 1. Get raw strings
                let userOutput = (result.output || "").trim();
                const expectedOutput = fullOutputs.trim();

                // 2. FIX: Remove the trailing delimiter from the User Output if it exists
                // The driver adds it after the last test case, but we don't need it.
                if (userOutput.endsWith(DELIMITER)) {
                    userOutput = userOutput.slice(0, -DELIMITER.length).trim();
                }

                // 3. Log Debugging (Optional)
                console.log("---------------------------------");
                console.log("User (Final):", JSON.stringify(userOutput));
                console.log("Exp. (Final):", JSON.stringify(expectedOutput));
                console.log("Match?", userOutput === expectedOutput);
                console.log("---------------------------------");

                if (userOutput === expectedOutput) {
                    console.log(`✅ Job Passed!`);
                    // TODO: Update Redis/DB status to "Success"
                } else {
                    console.log(`❌ Job Failed (Wrong Answer)`);
                    // TODO: Update Redis/DB status to "Failed"
                }
            }



        } catch (err: any) {
            console.error(`System Error for Job ${resposne.id}:`, err.message);
        }

    }
}

main();


app.listen(3000, () => {
    console.log('Worker running on the port 4000');
})