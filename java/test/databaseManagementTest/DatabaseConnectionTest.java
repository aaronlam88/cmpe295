package databaseManagementTest;

import java.sql.Connection;

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
		Connection connection = DatabaseConnection.getDatabaseConnection();
		System.out.println(connection);
		Assert.assertNotNull(connection);
	}
	
	@Test
	public void testCloseConnection() {
		DatabaseConnection.closeDatabaseConnection();
		DatabaseConnection.getDatabaseConnection();
		DatabaseConnection.closeDatabaseConnection();
	}
}
