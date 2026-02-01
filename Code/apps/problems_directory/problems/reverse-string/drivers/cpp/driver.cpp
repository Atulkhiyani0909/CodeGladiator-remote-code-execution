#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>
#include <fstream> 

using namespace std;

// USER CODE WILL BE INJECTED HERE
string reverseString(string);

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
        cout << "\"" << val << "\"";
    } else {
        cout << val;
    }
}

int main() {
    const string DELIMITER = "$$$DELIMITER$$$";
    
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
        
        testCase.erase(0, testCase.find_first_not_of(" \n\r\t"));
        testCase.erase(testCase.find_last_not_of(" \n\r\t") + 1);

        if (!testCase.empty()) {
            stringstream ss(testCase);
            string arg0; getline(ss, arg0); 
        if(!arg0.empty() && arg0.front() == '"') arg0.erase(0,1);
        if(!arg0.empty() && arg0.back() == '"') arg0.pop_back();
            
            auto result = reverseString(arg0);
            
          

            printResult(result);
            cout << endl << DELIMITER << endl;
        }

        if (pos == string::npos) break;
        prev = pos + DELIMITER.length();
    }
    return 0;
}