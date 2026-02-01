import sys
import json

DELIMITER = "$$$DELIMITER$$$"

def main():
    try:
        with open("/app/input.txt", "r") as f:
            input_data = f.read()
            
        test_cases = input_data.split(DELIMITER)
        sol = Solution()
        
        for test_case in test_cases:
            if not test_case.strip(): continue
            lines = [line.strip() for line in test_case.strip().split('\n') if line.strip()]
            
            raw_val = lines[0].strip()
            if raw_val.startswith("["):
                arg0 = json.loads(raw_val)
            else:
                arg0 = [int(x) for x in raw_val.replace(',',' ').split()]

            result = sol.containsDuplicate(arg0)
            
        
            
            print(json.dumps(result, separators=(',', ':')))
            print(DELIMITER)
            
    except Exception as e:
        sys.stderr.write(str(e))

if __name__ == "__main__":
    main()