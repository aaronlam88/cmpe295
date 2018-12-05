package databaseManagementTest;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;

import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import databaseManagement.DatabaseConnection;

public class DatabaseConnectionTest {
	
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
		
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
