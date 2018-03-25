package databaseManagement;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.Reader;
import java.sql.Connection;
import java.sql.DriverManager;

import com.google.gson.Gson;


public class DatabaseConnection {
	private static Connection connection = null;
	
	private Connection getDatabaseConnection() {
		Gson gson =  new Gson();
		Reader reader = null;
		try {
			reader = new FileReader("../../../ignore/db_config.json");
		} catch (FileNotFoundException e1) {
			System.exit(404);
		}
		DatabaseConfig config = gson.fromJson(reader, DatabaseConfig.class);
		System.out.println("Connecting to database " + config.database + "...");
		Connection connection = null;
		try {
			String username = config.username;
			String password = config.password;
			String database = config.database;
			connection = DriverManager.getConnection(database, username, password);
			connection.setAutoCommit(false);
		} catch (Exception e) {
			System.out.println("Cannot connect to database");
			System.out.println("Error message: " + e);
			System.exit(1);
		}
		if (connection == null) {
			System.exit(-1);
		}
		return connection;
	}
	
	
	
}
