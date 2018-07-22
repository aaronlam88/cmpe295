package database.management;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import org.junit.Assert;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

public class DatabaseConnectionTest {
	
	@BeforeClass
	public static void setUpBeforeClass() {
		
	}

	@AfterClass
	public static void tearDownAfterClass() {
		
	}
	
	@Test
	public void testGetConnection() {
		Connection connection = DatabaseConnection.getDatabaseConnection("../ignore/db_config.json");
		Assert.assertNotNull(connection);
	}
	
	@Test
	public void testQuery() throws Exception {
		Connection connection = DatabaseConnection.getDatabaseConnection("../ignore/db_config.json");
		Statement stm = connection.createStatement();
		stm.executeQuery("SELECT * FROM `4update`;");
		ResultSet resultSet = stm.getResultSet();
		Assert.assertNotNull(resultSet);
	}
}
