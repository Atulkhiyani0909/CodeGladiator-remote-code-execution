import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// --- CONFIGURATION ---
const CONFIG_FILE = "problem_config.json";
const DELIMITER = "$$$DELIMITER$$$";

// --- TYPE MAPPING ---
const TYPE_MAP = {
    "int": { py: "int", js: "number", cpp: "int", java: "int" },
    "float": { py: "float", js: "number", cpp: "float", java: "double" },
    "string": { py: "str", js: "string", cpp: "string", java: "String" },
    "bool": { py: "bool", js: "boolean", cpp: "bool", java: "boolean" },
    "List<int>": { py: "List[int]", js: "number[]", cpp: "vector<int>", java: "List<Integer>" },
    "List<string>": { py: "List[str]", js: "string[]", cpp: "vector<string>", java: "List<String>" },
    "void": { py: "None", js: "void", cpp: "void", java: "void" }
};

// Helper: Default Return Values
function getDefaultReturn(type, lang) {
    if (type === "void") return "";
    if (type === "int" || type === "float") return "return 0;";
    if (type === "bool") return "return false;";
    if (lang === 'cpp') {
        if (type === "string") return 'return "";';
        if (type.includes("List") || type.includes("vector")) return 'return {};';
    }
    if (lang === 'java') {
        if (type === "string") return 'return "";';
        if (type.includes("List")) return 'return new ArrayList<>();';
    }
    return "return 0;";
}

// ==========================================
// 1. JAVASCRIPT DRIVER
// ==========================================
function getJsDriver(functionName, inputs) {
    const argParsingLogic = inputs.map((input, index) => {
        if (input.type.includes("List")) {
            return `        let arg${index};
        const raw${index} = lines[${index}].trim();
        if (raw${index}.startsWith('[')) {
            arg${index} = JSON.parse(raw${index});
        } else {
            arg${index} = raw${index}.split(/[\\s,]+/).map(Number);
        }`;
        } else if (input.type === "int" || input.type === "float") {
            return `        const arg${index} = Number(lines[${index}]);`;
        } else {
            return `        let arg${index} = lines[${index}].trim();
        if (arg${index}.startsWith('"') && arg${index}.endsWith('"')) {
            arg${index} = arg${index}.slice(1, -1);
        }`;
        }
    }).join("\n");

    const argsList = inputs.map((_, i) => `arg${i}`).join(", ");

    return `
const fs = require('fs');
const DELIMITER = '${DELIMITER}';

try {
    const inputData = fs.readFileSync('/app/input.txt', 'utf-8');
    // Split by delimiter and filter empty entries
    const testCases = inputData.split(DELIMITER).map(tc => tc.trim()).filter(tc => tc !== '');

    testCases.forEach((testCase) => {
        const lines = testCase.split('\\n').map(l => l.trim()).filter(l => l !== '');
        
${argParsingLogic}

        const result = ${functionName}(${argsList});
        
        // Output JSON stringified result
        console.log(JSON.stringify(result));
        console.log(DELIMITER);
    });
} catch (err) {
    console.error(err);
}
`;
}

// ==========================================
// 2. PYTHON DRIVER
// ==========================================
function getPyDriver(functionName, inputs, outputType) {
    const argParsingLogic = inputs.map((input, index) => {
        if (input.type.includes("List")) {
            return `            raw_val = lines[${index}].strip()
            if raw_val.startswith("["):
                arg${index} = json.loads(raw_val)
            else:
                arg${index} = [int(x) for x in raw_val.replace(',',' ').split()]`;
        } else if (input.type === "int") {
            return `            arg${index} = int(lines[${index}])`;
        } else if (input.type === "float") {
            return `            arg${index} = float(lines[${index}])`;
        } else {
            return `            arg${index} = lines[${index}].strip().strip('"')`;
        }
    }).join("\n");

    const argsList = inputs.map((_, i) => `arg${i}`).join(", ");
    
   

    return `
import sys
import json

DELIMITER = "${DELIMITER}"

def main():
    try:
        with open("/app/input.txt", "r") as f:
            input_data = f.read()
            
        test_cases = input_data.split(DELIMITER)
        sol = Solution()
        
        for test_case in test_cases:
            if not test_case.strip(): continue
            lines = [line.strip() for line in test_case.strip().split('\\n') if line.strip()]
            
${argParsingLogic}

            result = sol.${functionName}(${argsList})
            
        
            
            print(json.dumps(result, separators=(',', ':')))
            print(DELIMITER)
            
    except Exception as e:
        sys.stderr.write(str(e))

if __name__ == "__main__":
    main()
`;
}

// ==========================================
// 3. C++ DRIVER
// ==========================================
function getCppDriver(problem) { 
    const inputParsing = problem.inputs.map((inp, i) => {
        if (inp.type.includes("List") || inp.type.includes("vector")) {
            return `
        vector<int> arg${i};
        string line${i};
        getline(ss, line${i});
        // Handle [1, 2, 3] format or 1 2 3 format
        size_t start = line${i}.find('[');
        size_t end = line${i}.find(']');
        if (start != string::npos && end != string::npos) {
            string inner = line${i}.substr(start + 1, end - start - 1);
            for(size_t k=0; k<inner.length(); k++) if(inner[k]==',') inner[k]=' ';
            stringstream ss_line(inner);
            int temp; while(ss_line >> temp) arg${i}.push_back(temp);
        } else {
            stringstream ss_line(line${i});
            int temp; while(ss_line >> temp) arg${i}.push_back(temp);
        }`;
        } else if (inp.type === "int") {
            return `int arg${i}; ss >> arg${i};`;
        } else {
            return `string arg${i}; getline(ss, arg${i}); 
        if(!arg${i}.empty() && arg${i}.front() == '"') arg${i}.erase(0,1);
        if(!arg${i}.empty() && arg${i}.back() == '"') arg${i}.pop_back();`;
        }
    }).join("\n        ");

    const argsCall = problem.inputs.map((_, i) => `arg${i}`).join(", ");
    const paramTypes = problem.inputs.map(inp => TYPE_MAP[inp.type]?.cpp || "int").join(", ");

   
    return `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <fstream> 

using namespace std;

// USER CODE WILL BE INJECTED HERE
${TYPE_MAP[problem.outputType]?.cpp || "int"} ${problem.functionName}(${paramTypes});

template <typename T>
void printResult(const vector<T>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); ++i) {
        cout << v[i];
        if (i < v.size() - 1) cout << ",";
    }
    cout << "]";
}

template <typename T>
void printResult(const T& val) {
    if constexpr (is_same_v<T, bool>) {
        cout << (val ? "true" : "false");
    } else if constexpr (is_same_v<T, string>) {
        cout << "\\"" << val << "\\"";
    } else {
        cout << val;
    }
}

int main() {
    const string DELIMITER = "${DELIMITER}";
    
    stringstream buffer;
    buffer << cin.rdbuf(); 
    string content = buffer.str();

    if (content.empty()) {
        ifstream t("/app/input.txt");
        if(t.is_open()) {
            stringstream fbuffer;
            fbuffer << t.rdbuf();
            content = fbuffer.str();
        }
    }

    size_t prev = 0;
    while (true) {
        size_t pos = content.find(DELIMITER, prev);
        string testCase = (pos != string::npos) ? content.substr(prev, pos - prev) : content.substr(prev);
        
        testCase.erase(0, testCase.find_first_not_of(" \\n\\r\\t"));
        testCase.erase(testCase.find_last_not_of(" \\n\\r\\t") + 1);

        if (!testCase.empty()) {
            stringstream ss(testCase);
            ${inputParsing}
            
            auto result = ${problem.functionName}(${argsCall});
            
          

            printResult(result);
            cout << endl << DELIMITER << endl;
        }

        if (pos == string::npos) break;
        prev = pos + DELIMITER.length();
    }
    return 0;
}
`;
}

// ==========================================
// 4. JAVA DRIVER (FIXED & ROBUST)
// ==========================================
function getJavaDriver(problem) { 
    // Dynamically generate input parsing logic
    const inputParsing = problem.inputs.map((inp, i) => {
        const varName = `arg${i}`;
        const readLine = `String raw${i} = scanner.hasNextLine() ? scanner.nextLine().trim() : "";`;

        if (inp.type.includes("List")) {
            return `
                ${readLine}
                List<Integer> ${varName} = parseIntegerList(raw${i});`;
        } else if (inp.type === "int") {
            return `
                ${readLine}
                int ${varName} = 0;
                try { if(!raw${i}.isEmpty()) ${varName} = Integer.parseInt(raw${i}); } catch(Exception e) {}`;
        } else {
            return `
                ${readLine}
                String ${varName} = raw${i};
                if (${varName}.length() >= 2 && ${varName}.startsWith("\\"") && ${varName}.endsWith("\\"")) {
                    ${varName} = ${varName}.substring(1, ${varName}.length() - 1);
                }`;
        }
    }).join("\n");

    const argsCall = problem.inputs.map((_, i) => `arg${i}`).join(", ");

   

    return `
import java.io.*;
import java.util.*;
import java.util.stream.*;
import java.nio.file.*;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Run {

    //_USER_CODE_HERE_

    public static void main(String[] args) {
        final String DELIMITER = "${DELIMITER}";
        final String INPUT_FILE = "/app/input.txt";

        String content = "";
        try {
            content = Files.readString(Paths.get(INPUT_FILE));
        } catch (IOException e) { return; }

        String[] testCases = content.split(java.util.regex.Pattern.quote(DELIMITER));

        for (String testCase : testCases) {
            if (testCase.trim().isEmpty()) continue;

            Scanner scanner = new Scanner(testCase.trim());
            try {
                ${inputParsing}

                // Call user function
                var result = ${problem.functionName}(${argsCall});
                
               

                printResult(result);
                System.out.println();
                System.out.println(DELIMITER);

            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                scanner.close();
            }
        }
    }

    private static List<Integer> parseIntegerList(String raw) {
        if (raw == null || raw.isEmpty()) return new ArrayList<>();
        if (raw.startsWith("[")) raw = raw.substring(1);
        if (raw.endsWith("]")) raw = raw.substring(0, raw.length() - 1);
        
        raw = raw.trim();
        if (raw.isEmpty()) return new ArrayList<>();
        
        String[] parts = raw.split("[,\\\\s]+");
        List<Integer> list = new ArrayList<>();
        for (String part : parts) {
            if (!part.isEmpty()) {
                try { list.add(Integer.parseInt(part.trim())); } catch(Exception e) {}
            }
        }
        return list;
    }

    private static void printResult(Object result) {
        if (result instanceof List) {
            List<?> list = (List<?>) result;
            System.out.print("[");
            for (int i = 0; i < list.size(); i++) {
                System.out.print(list.get(i));
                if (i < list.size() - 1) System.out.print(",");
            }
            System.out.print("]");
        } else if (result instanceof String) {
            System.out.print("\\"" + result + "\\"");
        } else {
            System.out.print(result);
        }
    }
}
`;
}

// ==========================================
// 5. BOILERPLATE & MAIN
// ==========================================
function generateBoilerplate(config) {
    const { functionName, inputs, outputType } = config;

    // --- JAVASCRIPT ---
    const jsParams = inputs.map(i => i.name).join(", ");
    const jsCode = `
/**
 * @param {${TYPE_MAP[inputs[0].type]?.js || "any"}} ${jsParams}
 * @return {${TYPE_MAP[outputType]?.js || "any"}}
 */
function ${functionName}(${jsParams}) {
  // Write your code here
  return 0;
}
`;

    // --- PYTHON ---
    const pyParams = inputs.map(i => `${i.name}: ${TYPE_MAP[i.type]?.py || "Any"}`).join(", ");
    const pyCode = `
from typing import List
import json

class Solution:
    def ${functionName}(self, ${pyParams}) -> ${TYPE_MAP[outputType]?.py || "Any"}:
        # Write your code here
        return 0
`;

    // --- C++ ---
    const cppParams = inputs.map(i => `${TYPE_MAP[i.type]?.cpp || "int"} ${i.name}`).join(", ");
    const cppReturn = TYPE_MAP[outputType]?.cpp || "void";
    const cppDefault = getDefaultReturn(outputType, 'cpp');
    const cppCode = `
#include <bits/stdc++.h>
using namespace std;

${cppReturn} ${functionName}(${cppParams}) {
    // Write your code here
    ${cppDefault}
}
`;

    // --- JAVA ---
    const javaParams = inputs.map(i => `${TYPE_MAP[i.type]?.java || "int"} ${i.name}`).join(", ");
    const javaReturn = TYPE_MAP[outputType]?.java || "void";
    const javaDefault = getDefaultReturn(outputType, 'java');
    const javaCode = `
public static ${javaReturn} ${functionName}(${javaParams}) {
    // Write your code here
    ${javaDefault}
}
`;

    return { py: pyCode.trim(), js: jsCode.trim(), cpp: cppCode.trim(), java: javaCode.trim() };
}

// ==========================================
// 6. MAIN FUNCTION
// ==========================================
function createProblems() {
    const configPath = path.join(__dirname, CONFIG_FILE);
    if (!fs.existsSync(configPath)) {
        console.error(`❌ Config file not found: ${CONFIG_FILE}`);
        return;
    }
    
    // Read Config and Parse (Handle both Array and Object)
    let configs = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (!Array.isArray(configs)) {
        configs = [configs];
    }

    console.log(`🚀 Found ${configs.length} problems. Generating...`);

    configs.forEach(config => {
        console.log(`   👉 Processing: ${config.name} (${config.slug})`);

        const baseDir = path.join(__dirname, "problems", config.slug);
        const boilerplateDir = path.join(baseDir, "boilerplate");
        const inputDir = path.join(baseDir, "input");
        const outputDir = path.join(baseDir, "output");
        const driversDir = path.join(baseDir, "drivers");

        // Clean & Recreate Directories
        if (fs.existsSync(baseDir)) fs.rmSync(baseDir, { recursive: true, force: true });
        [boilerplateDir, inputDir, outputDir, driversDir].forEach(d => fs.mkdirSync(d, { recursive: true }));
        ['python', 'javascript', 'java', 'cpp'].forEach(lang => fs.mkdirSync(path.join(driversDir, lang), { recursive: true }));

        // Generate Input/Output Files
        let fullInputRaw = "";
        let fullOutputRaw = "";
        
        config.testCases.forEach((tc, index) => {
            const i = index + 1;
            
            // Format Input: Handle object input for multiple params
            let inputContent = "";
            if (typeof tc.input === 'object' && !Array.isArray(tc.input)) {
                // Iterate over config inputs to ensure correct order
                config.inputs.forEach(inp => {
                    const val = tc.input[inp.name];
                    inputContent += (typeof val === 'object' ? JSON.stringify(val) : JSON.stringify(val)) + "\n";
                });
            } else {
                inputContent = (typeof tc.input === 'object' ? JSON.stringify(tc.input) : JSON.stringify(tc.input)) + "\n";
            }
            
            // Format Output: ALWAYS STRINGIFY to match Driver Output (e.g. "olleh")
            let outputContent = JSON.stringify(tc.output);

            fs.writeFileSync(path.join(inputDir, `${i}.txt`), inputContent.trim());
            fs.writeFileSync(path.join(outputDir, `${i}.txt`), outputContent);
            
            // Delimiter strictly on new line
            fullInputRaw += inputContent.trim() + "\n" + DELIMITER + "\n";
            fullOutputRaw += outputContent + "\n" + DELIMITER + "\n";
        });

        fs.writeFileSync(path.join(inputDir, "mount_data.txt"), fullInputRaw);
        fs.writeFileSync(path.join(outputDir, "expected_data.txt"), fullOutputRaw);

        // Generate Boilerplate & Drivers
        const code = generateBoilerplate(config);
        fs.writeFileSync(path.join(boilerplateDir, "function.py"), code.py);
        fs.writeFileSync(path.join(boilerplateDir, "function.js"), code.js);
        fs.writeFileSync(path.join(boilerplateDir, "function.cpp"), code.cpp);
        fs.writeFileSync(path.join(boilerplateDir, "function.java"), code.java);

        const pyDriver = getPyDriver(config.functionName, config.inputs, config.outputType);
        fs.writeFileSync(path.join(driversDir, "python", "driver.py"), pyDriver.trim());

        const jsDriver = getJsDriver(config.functionName, config.inputs);
        fs.writeFileSync(path.join(driversDir, "javascript", "driver.js"), jsDriver.trim());

        const javaDriver = getJavaDriver(config); 
        fs.writeFileSync(path.join(driversDir, "java", "Run.java"), javaDriver.trim());

        const cppDriver = getCppDriver(config);
        fs.writeFileSync(path.join(driversDir, "cpp", "driver.cpp"), cppDriver.trim());

        // Metadata
        const metadata = {
            slug: config.slug,
            name: config.name,
            params: config.inputs,
            returnType: config.outputType,
            totalTestCases: config.testCases.length
        };
        fs.writeFileSync(path.join(baseDir, "problem.json"), JSON.stringify(metadata, null, 2));
    });

    console.log(`✅ Success! All problems generated.`);
}

createProblems();