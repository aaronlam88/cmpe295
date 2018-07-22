package database.management;

import java.io.BufferedReader;

import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

public class YahooAPIConnectionTest {
	@BeforeClass
	public static void setUpBeforeClass() {
		
	}

	@AfterClass
	public static void tearDownAfterClass() {
		
	}
	
	@Test
	public void testGetData() {
		YahooAPIConnection connection = new YahooAPIConnection("https://query1.finance.yahoo.com/v7/finance/download/%s?period1=%d&period2=%d&interval=1d&events=history&crumb=/PvdUIZE/35", "B=5750brtdcfphc&b=3&s=ts");
		BufferedReader in = connection.getData("FB", 1519676503, 1522092103);
		Assert.assertNotNull(in);
	}
}
