import java.io.*;
import java.nio.file.*;
import java.util.*;

public class Run {

    //_USER_CODE_HERE_

    // Parse a line like [1, 2, 3] or []
    private static List<Integer> parseList(String line) {
        line = line.trim();
        if (line.startsWith("[") && line.endsWith("]")) {
            line = line.substring(1, line.length() - 1);
        }

        List<Integer> list = new ArrayList<>();
        if (line.isEmpty()) return list;

        // Split by comma and optional spaces
        for (String s : line.split(",\\s*")) {
            list.add(Integer.parseInt(s));
        }
        return list;
    }

    public static void main(String[] args) {
        final String DELIMITER = "$$$DELIMITER$$$";
        final String INPUT_FILE = "/app/input.txt";

        String content;
        try {
            content = Files.readString(Paths.get(INPUT_FILE));
        } catch (IOException e) {
            System.err.println("Input file not found");
            return;
        }

        int prev = 0;
        int pos;

        while (true) {
            pos = content.indexOf(DELIMITER, prev);
            String testCase = (pos != -1)
                    ? content.substring(prev, pos)
                    : content.substring(prev);

            if (!testCase.trim().isEmpty()) {
                Scanner scanner = new Scanner(testCase.trim());

                // Read two lines for the two lists
                String line1 = scanner.hasNextLine() ? scanner.nextLine() : "[]";
                String line2 = scanner.hasNextLine() ? scanner.nextLine() : "[]";

                List<Integer> arg0 = parseList(line1);
                List<Integer> arg1 = parseList(line2);

                var result = intersection(arg0, arg1);
                System.out.println(result);
                System.out.println(DELIMITER);

                scanner.close();
            }

            if (pos == -1) break;
            prev = pos + DELIMITER.length();
        }
    }
}
