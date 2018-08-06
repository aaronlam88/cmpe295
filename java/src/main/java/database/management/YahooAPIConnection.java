package database.management;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * This class contain functions to interact with Yahoo Finance API
 */
public class YahooAPIConnection {
	protected static Logger logger = LoggerFactory.getLogger(YahooAPIConnection.class);

	private String api;
	private String cookies;
	
	public YahooAPIConnection(String api, String cookies) {
		this.api = api;
		this.cookies = cookies;
	}
	
	/**
	 * get data from Yahoo Finance API and return it as a BufferedReader
	 * 
	 * @return BufferedReader contain data in csv
	 * @param tableName: stock symbol - required by Yahoo API
	 * @param startTime: get data from this time - required by Yahoo API
	 * @param endTime: get data to this time - required by Yahoo API
	 */
	public BufferedReader getData(String tableName, long startTime, long endTime) {
		// http link encode string, since we only need to encode the ^ char, no need to use extra functions
		if (tableName.startsWith("^")) {
			tableName = tableName.replace("^", "%5E");
		}

		// make connection to Yahoo API
		try {
			String link = String.format(api, tableName, startTime, endTime);
			URL url = new URL(link);
			URLConnection urlConn = url.openConnection();
			urlConn.setRequestProperty("cookie", cookies);
			BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
			return in;
		} catch (Exception e) {
			logger.error("Cannot get data for [" + tableName + "] with error" + e.getMessage());
		}
		return null;
	}

	/**
	 * Check to see if the US stock market is currently open
	 * @return true/false [US markets is open/close]
	 */
	public static boolean isMarketOpen() {
		try {
			Document doc = Jsoup.connect("https://finance.yahoo.com/").get();
			Elements content = doc.getElementById("Lead-2-FinanceHeader-Proxy").getElementsByAttributeValue("data-reactid", "8");
			for(Element element : content) {
				if(element.text().equalsIgnoreCase("U.S. Markets closed")) {
					return false;
				}
			}
		} catch (IOException e) {
			logger.error("IOException " + e.getLocalizedMessage());
		}
		return true;
	}
}
