import java.io.*;
import java.util.*;
import java.util.stream.*;
import java.nio.file.*;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Run {

    //_USER_CODE_HERE_

    public static void main(String[] args) {
        final String DELIMITER = "$$$DELIMITER$$$";
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
                
                String raw0 = scanner.hasNextLine() ? scanner.nextLine().trim() : "";
                List<Integer> arg0 = parseIntegerList(raw0);

                // Call user function
                var result = containsDuplicate(arg0);
                
               

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
        
        String[] parts = raw.split("[,\\s]+");
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
            System.out.print("\"" + result + "\"");
        } else {
            System.out.print(result);
        }
    }
}