import java.util.Arrays;
import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class BenchmarkClient {

  private static final int NO_REQUESTS = 40;
  private static final int NO_THREADS = 1000;

  private static final String[] PARTIES = {
      "CSU", "AfD", "SPD", "FDP", "GR%C3%9CNE", "FREIE%20W%C3%84HLER"};

  public static final String[][] QUERIES = {
      {"http://localhost:5000/api/2018/gewinnerparteien"}, // Q1
      {"http://localhost:5000/api/2018/abgeordneten"}, // Q2
      {"http://localhost:5000/api/2018/stimmkreise/101/beteiligung",
          "http://localhost:5000/api/2018/stimmkreise/101/gewinner",
          "http://localhost:5000/api/2018/stimmkreise/101/parteiengesamt",
          "http://localhost:5000/api/vergleich/stimmkreise/101/parteiengesamt"}, // Q3
      {"http://localhost:5000/api/2018/stimmkreise/101/parteienerststimmen",
          "http://localhost:5000/api/2018/stimmkreise/101/parteienzweitstimmen"}, // Q4
      {"http://localhost:5000/api/2018/wahlkreise/901/gewinnerparteien"}, // Q5
      generateQ6URLs()// Q6
  };

  private static ExecutorService executor;

  public static int getNextQueryIndex() {
    Random r = new Random();
    int i = r.nextInt(100) + 1;
    if (i <= 25) {
      return 0;
    } else if (i <= 35) {
      return 1;
    } else if (i <= 60) {
      return 2;
    } else if (i <= 70) {
      return 3;
    } else if (i <= 80) {
      return 4;
    } else {
      return 5;
    }
  }

  private static String[] generateQ6URLs() {
    String[] closestWinners = Arrays.stream(PARTIES).map(p -> "http://localhost:5000/api/2018/parteien/" + p + "/knappstesieger").toArray(String[]::new);
    String[] closestLosers = Arrays.stream(PARTIES).map(p -> "http://localhost:5000/api/2018/parteien/" + p + "/knappsteverlierer").toArray(String[]::new);
    String[] result = new String[closestWinners.length + closestLosers.length];
    System.arraycopy(closestWinners, 0, result, 0, closestWinners.length);
    System.arraycopy(closestLosers, 0, result, closestWinners.length, closestWinners.length);
    return result;
  }

  private static Terminal[] startTerminals(int noTerminals, int meanWaitTime) {
    Terminal[] terminals = new Terminal[noTerminals];
    for (int i = 0; i < noTerminals; i++) {
      Terminal terminal = new Terminal(meanWaitTime, NO_REQUESTS);
      terminals[i] = terminal;
      executor.execute(terminal);
    }
    executor.shutdown();
    return terminals;
  }

  private static double[] computePerformance(Terminal[] terminals) throws InterruptedException {
    double[] result = new double[6];
    int[] noExecutedQueries = new int[6];

    executor.awaitTermination(30, TimeUnit.MINUTES);

    for (Terminal terminal : terminals) {
      int[] performanceResults = terminal.getPerformanceResults();
      int[] executedQueryIndexes = terminal.getExecutedQueryIndexes();
      for (int i = 0; i < performanceResults.length; i++) {
        int index = executedQueryIndexes[i];
        noExecutedQueries[index]++;
        result[index] += performanceResults[i];
      }
    }
    // Average time for calculating the closest winners and losers for a single party.
    result[5] /= PARTIES.length;
    for (int i = 0; i < result.length; i++) {
      result[i] /= noExecutedQueries[i];
    }
    return result;
  }

  private static void outputResults(double[] results, int noTerminals, int meanWaitTime) {
    System.out.println("---------------------------------------------");
    System.out.println("Number of terminals: " + noTerminals);
    System.out.println("Mean waiting time: " + meanWaitTime + " ms");
    System.out.println("Average performance per Query:");
    for (int i = 0; i < results.length; i++) {
      System.out.println("Query " + (i + 1) + ": " + results[i] + " ms");
    }
    System.out.println("---------------------------------------------");
  }

  private static void executeMeasurement(int noTerminals, int meanWaitTime) throws InterruptedException {
    executor = Executors.newFixedThreadPool(NO_THREADS);
    Terminal[] terminals = startTerminals(noTerminals, meanWaitTime);
    double[] result = computePerformance(terminals);
    outputResults(result, noTerminals, meanWaitTime);
  }

  public static void main(String[] args) throws InterruptedException {

    // Measurement 1:
    executeMeasurement(1, 10);

    // Measurement 2:
    executeMeasurement(10, 10);

    // Measurement 3:
    executeMeasurement(100, 10);

    // Measurement 4:
    executeMeasurement(1000, 10);

    // Measurement 5:
    executeMeasurement(1, 20);

    // Measurement 6:
    executeMeasurement(10, 20);

    // Measurement 7:
    executeMeasurement(100, 20);

    // Measurement 8:
    executeMeasurement(1000, 20);

  }

}
