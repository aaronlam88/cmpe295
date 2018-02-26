package databaseManagement;

import java.sql.DriverManager;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.gson.Gson;

import java.io.FileReader;
import java.sql.Connection;

public class DatabaseConnection {
	private static final Logger LOGGER = Logger.getLogger(DatabaseConnection.class.getName());
	private static Connection connection = null;

	private DatabaseConnection() {

	}

	/*
	 * This function gets the singleton the singleton connection
	 * 
	 * @param no require parameters, but ENV_VAR: DB_USERNAME, DB_PASSWORD, HOST
	 * need to be set up before use
	 * 
	 * @return return a java.sql.Connection
	 */
	public static Connection getInstance(String configFile, String database) {
		if (connection == null) {
			try {
				Gson gson = new Gson();
				DatabaseConfig config = gson.fromJson(new FileReader(configFile), DatabaseConfig.class);
				connection = DriverManager.getConnection(config.getHost() + database + config.getSetting(), // host
						config.getUsername(), config.getPassword());
				connection.setAutoCommit(false);
				LOGGER.log(Level.INFO, "Connect successfully to " + database);
			} catch (Exception e) {
				LOGGER.log(Level.SEVERE, "Cannot connect to " + database);
				LOGGER.log(Level.SEVERE, e.getMessage());
			}
		}
		return connection;
	}

}
