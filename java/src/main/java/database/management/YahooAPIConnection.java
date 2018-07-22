package database.management;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class YahooAPIConnection {
	protected static Logger logger = LoggerFactory.getLogger(YahooAPIConnection.class);

	private String api;
	private String cookies;
	
	public YahooAPIConnection(String api, String cookies) {
		this.api = api;
		this.cookies = cookies;
	}
	
	public BufferedReader getData(String tableName, long startTime, long endTime) {
		if (tableName.startsWith("^")) {
			tableName = tableName.replace("^", "%5E");
		}
		try {
			String link = String.format(api, tableName, startTime, endTime);
			URL url = new URL(link);
			URLConnection urlConn = url.openConnection();
			urlConn.setRequestProperty("cookie", cookies);
			BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
			return in;
		} catch (Exception e) {
			logger.info("Cannot get data for [" + tableName + "] with error" + e.getMessage());
		}
		return null;
	}
}
