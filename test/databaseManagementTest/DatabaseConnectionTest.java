package databaseManagementTest;

import org.junit.Test;

import databaseManagement.DatabaseConnection;

import static org.junit.Assert.assertNotNull;

import java.sql.Connection;

public class DatabaseConnectionTest {
	@Test
	public void testConnection() {
		Connection connection = DatabaseConnection.getInstance("./ignore/db_config.json", "new_SP500");
		assertNotNull(connection);
	}
}
