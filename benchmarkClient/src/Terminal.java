import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.concurrent.ExecutorService;

public class Terminal implements Runnable {

  private int meanWaitTime; // in Milliseconds
  private int noRequests;
  private volatile int[] performanceResults;
  private volatile int[] executedQueryIndexes;

  public Terminal(int meanWaitTime, int noRequests) {
    this.meanWaitTime = meanWaitTime;
    this.noRequests = noRequests;
    performanceResults = new int[noRequests];
    executedQueryIndexes = new int[noRequests];
  }

  private int computeWaitTime() {
    double minimum = meanWaitTime * 0.8;
    double maximum = meanWaitTime * 1.2;
    return (int) (Math.random() * (maximum - minimum) + minimum);
  }

  @Override
  public void run() {
    for (int i = 0; i < noRequests; i++) {
      int queryIndex = BenchmarkClient.getNextQueryIndex();
      executedQueryIndexes[i] = queryIndex;
      String[] urls = BenchmarkClient.QUERIES[queryIndex];


      try {
        long startTime = System.currentTimeMillis();
        for (String url : urls) {
          URL _url = new URL(url);
          //InputStream inputStream = new URL(url).openStream();
          HttpURLConnection connection = (HttpURLConnection) _url.openConnection();
          if (connection.getResponseCode() != 200) {
            System.out.println(url);
            System.out.println(connection.getResponseCode());
            BufferedReader in = new BufferedReader(
                new InputStreamReader(connection.getInputStream()));
            String inputLine;
            while ((inputLine = in.readLine()) != null)
              System.out.println(inputLine);
            in.close();
          }
        }
        int duration = (int) (System.currentTimeMillis() - startTime);
        performanceResults[i] = duration;
      } catch (IOException e) {
        e.printStackTrace();
      }

      int waitTime = computeWaitTime();
      try {
        Thread.sleep(waitTime);
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }
  }

  public int[] getPerformanceResults() {
    return performanceResults;
  }

  public int[] getExecutedQueryIndexes() {
    return executedQueryIndexes;
  }
}
