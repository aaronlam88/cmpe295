package database.management;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.Reader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

/**
 * This is a singleton class use to get connection with database
 * 
 * @author aaronlam
 * @version 0.0.1
 * @since 2018-03-26
 */
public class DatabaseConnection {
	private static Logger logger = LoggerFactory.getLogger(DatabaseConnection.class);
	private static Connection connection = null;

	/**
	 * This function will return the singleton connection Require a path to a json
	 * with values for key username, password, jdbc_prefix, host, port, database,
	 * jdbc_setting. Checkout DatabaseConfig
	 * 
	 * @param path_to_config_json: path to config.json file 
	 * @return java.sql.Connection 
	 * @exception FileNotFoundException or SQLException
	 * 
	 * @author aaronlam
	 * @version 0.0.1
	 * @since 2018-03-26
	 */
	public static Connection getDatabaseConnection(String path_to_config_json) {
		if (connection == null) {
			Gson gson = new Gson();
			Reader reader = null;
			try {
				reader = new FileReader(path_to_config_json);
			} catch (FileNotFoundException e) {
				logger.debug("FileNotFoundException: " + e.getMessage());
				return null;
			}
			DatabaseConfig config = gson.fromJson(reader, DatabaseConfig.class);
			logger.info("Connecting to database " + config.database + "...");
			String username = config.username;
			String password = config.password;
			String database = String.format("%s%s:%s/%s%s", config.jdbc_prefix, config.host, config.port,
					config.database, config.jdbc_setting);
			try {
				connection = DriverManager.getConnection(database, username, password);
				connection.setAutoCommit(false);
				logger.info("Connected to " + config.database);
			} catch (Exception e) {
				logger.debug("Cannot connect to database:'" + database + "' with error " + e.getMessage());
			}
		}
		return connection;
	}
	
	/**
	 * This function will return the singleton connection Require a path to a json
	 * with values for key username, password, jdbc_prefix, host, port, database,
	 * jdbc_setting. Checkout DatabaseConfig
	 * 
	 * @param path_to_config_json: path to config.json file 
	 * @return java.sql.Connection 
	 * @exception FileNotFoundException or SQLException
	 * 
	 * @author aaronlam
	 * @version 0.0.1
	 * @since 2018-03-26
	 */
	public static Connection getDatabaseConnection(String path_to_config_json, String schema) {
		if (connection == null) {
			Gson gson = new Gson();
			Reader reader = null;
			try {
				reader = new FileReader(path_to_config_json);
			} catch (FileNotFoundException e) {
				logger.debug("FileNotFoundException: " + e.getMessage());
				return null;
			}
			DatabaseConfig config = gson.fromJson(reader, DatabaseConfig.class);
			logger.info("Connecting to schema " + schema + "...");
			String username = config.username;
			String password = config.password;
			String database = String.format("%s%s:%s/%s%s", config.jdbc_prefix, config.host, config.port,
					schema, config.jdbc_setting);
			try {
				connection = DriverManager.getConnection(database, username, password);
				connection.setAutoCommit(false);
				logger.info("Connected to " + schema);
			} catch (Exception e) {
				logger.debug("Cannot connect to database:'" + schema + "' with error " + e.getMessage());
			}
		}
		return connection;
	}

	/**
	 * This function will close the singleton connection
	 * 
	 * @return void
	 * 
	 * @author aaronlam
	 * @version 0.0.1
	 * @since 2018-03-26
	 */
	public static void closeDatabaseConnection() {
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
