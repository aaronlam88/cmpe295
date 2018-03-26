package databaseManagement;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.Reader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

public class DatabaseConnection {
	protected static Logger logger = LoggerFactory.getLogger(DatabaseConnection.class);
	private static Connection connection = null;

	public static Connection getDatabaseConnection() {
		if (connection == null) {
			Gson gson = new Gson();
			Reader reader = null;
			try {
				reader = new FileReader("../ignore/db_config.json");
			} catch (FileNotFoundException e) {
				logger.info("FileNotFoundException: " + e.getMessage());
				return null;
			}
			DatabaseConfig config = gson.fromJson(reader, DatabaseConfig.class);
			logger.info("Connecting to database " + config.database + "...");
			String username = config.username;
			String password = config.password;
			String database = "jdbc:mysql://cmpe295.cxswepygqy9j.us-west-1.rds.amazonaws.com:3306/" + config.jdbc_setting;
			try {
				connection = DriverManager.getConnection(database, username, password);
				connection.setAutoCommit(false);
				logger.info("Connected");
			} catch (Exception e) {
				logger.info("Cannot connect to database:'" + database + "' with error " + e.getMessage());
			}
		}
		return connection;
	}
	
	public static void closeDatabaseConnection () {
		if (connection != null) {
			try {
				connection.close();
			} catch (SQLException e) {
				logger.debug("Cannot close connection! " + e.getMessage());
			}
		} else {
			return;
		}
	}
}
