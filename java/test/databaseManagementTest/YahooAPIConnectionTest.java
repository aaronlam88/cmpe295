package databaseManagementTest;

import java.io.BufferedReader;

import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import databaseManagement.YahooAPIConnection;

public class YahooAPIConnectionTest {
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
		
	}
	
	@Test
	public void testGetData() throws Exception {
		YahooAPIConnection connection = new YahooAPIConnection("https://query1.finance.yahoo.com/v7/finance/download/%s?period1=%d&period2=%d&interval=1d&events=history&crumb=mKgl5VWkoUY");
		BufferedReader in = connection.getData("FB", 1519676503, 1522092103);
		Assert.assertNotNull(in);
	}
}
