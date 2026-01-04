# --- DRIVER CODE START ---
import sys

DELIMITER = "$$$DELIMITER$$$"

try:
    with open("/app/input.txt", "r") as f:
        input_data = f.read()

    test_cases = input_data.split(DELIMITER)

    for test_case in test_cases:
        if not test_case.strip():
            continue

        # For simple problems (e.g. "10 20"), this works.
        # For array inputs (e.g. "[1,2]"), you may need eval() or json.loads() later.
        args = list(map(int, test_case.strip().split()))

        if "solve" not in globals() or not callable(solve):
            print("Function 'solve' is not defined! Did you change the function name?")
            sys.exit(1)

        result = solve(*args)

        print(result)
        print(DELIMITER)

except Exception as err:
    print("Driver Error:", str(err))
    sys.exit(1)

# --- DRIVER CODE END ---
