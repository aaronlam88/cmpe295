package databaseManagement;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.logging.Level;
import java.util.logging.Logger;

import com.google.gson.Gson;

public class DatabaseInit {
	private static final Logger LOGGER = Logger.getLogger(DatabaseInit.class.getName());

	private static String createStmt = "CREATE TABLE IF NOT EXISTS `#TABLE` (\n" + "    `Date` datetime NOT NULL, \n"
			+ "    `Open` double DEFAULT NULL, \n" + "    `High` double DEFAULT NULL, \n"
			+ "    `Low` double DEFAULT NULL, \n" + "    `Close` double DEFAULT NULL, \n"
			+ "    `Adj Close` double DEFAULT NULL, \n" + "    `Volume` int(11) DEFAULT NULL,\n"
			+ "    PRIMARY KEY (`Date`)\n" + ") ENGINE=InnoDB DEFAULT CHARSET=utf8;";

	private static String insertStmt = "INSERT INTO `#DATABASE`.`#TABLE` VALUES (?, ?, ?, ?, ?, ?, ?);";

	public DatabaseConfig getConfig(String configFile) {
		try {
			Gson gson = new Gson();
			DatabaseConfig config = gson.fromJson(new FileReader(configFile), DatabaseConfig.class);
			LOGGER.log(Level.INFO, "get config");
			return config;
		} catch (Exception e) {
			LOGGER.log(Level.SEVERE, "Fail to create DatabaseConfig obj from " + configFile);
			LOGGER.log(Level.SEVERE, e.getMessage());
		}
		return null;
	}

	public Connection getConnection(String configFile, String database) {
		return DatabaseConnection.getInstance(configFile, database);
	}


	public void buildDatabase(DatabaseConfig config, Connection conn) {
		for (String table : config.getTables()) {
			try {
				/**************************
				 *  Create Table
				 **************************/
				String query = createStmt.replace("#TABLE", table);
				Statement statement = conn.createStatement();
				statement.executeUpdate(query);

				query = "TRUNCATE TABLE `" + table + "`";
				statement.executeUpdate(query);
				
				/**************************
				 * Insert data into table
				 **************************/
				// get data from Yahoo API
				URL url = new URL(config.getApi().replace("#TABLE", table));
				HttpURLConnection httpconn = (HttpURLConnection) url.openConnection();
				httpconn.setRequestProperty("cookie", config.getCookies());
				httpconn.connect();
				if (httpconn.getResponseCode() != 200) {
					LOGGER.log(Level.SEVERE, "buildDatabase fail to create table: " + table);
					continue;
				}

				// create a PreparedStatement
				query = insertStmt.replace("#TABLE", table);
				PreparedStatement ps = conn.prepareStatement(query);
				int currBatch = 0;
				int batchSize = 10000;

				BufferedReader in = new BufferedReader(new InputStreamReader(httpconn.getInputStream()));
				// skip first line
				in.readLine();

				// read the result line by line
				String inputLine = in.readLine();
				while (inputLine != null) {
					// split the csv line into data
					String[] tokens = inputLine.split(",");
					// clear PreparedStatement Parameters
					ps.clearParameters();
					// converting string into sql date
					Date date = Date.valueOf(tokens[0]);
					ps.setDate(1, date);
					for (int i = 1; i < tokens.length; ++i) {
						if (tokens[i] == null || tokens[i].isEmpty()) {
							ps.setDouble(i + 1, java.sql.Types.NULL);
						} else {
							ps.setDouble(i + 1, Double.parseDouble(tokens[i]));
						}
					}
					ps.addBatch();

					if (currBatch == batchSize) {
						ps.executeBatch();
						currBatch = 0;
					} else {
						++currBatch;
					}
				}

				// close BufferedReader after we done with it
				in.close();
			} catch (Exception e) {
				LOGGER.log(Level.SEVERE, "buildDatabase fail with message\n" + e.getMessage());
			}

		}

	}

	public static void main(String[] args) {
		if (args.length != 2) {
			System.out.println("DatabaseInit configFile database");
			System.exit(-1);
		}
		String configFile = args[0];
		String database = args[1];

		DatabaseInit init = new DatabaseInit();
		DatabaseConfig config = init.getConfig(configFile);
		Connection conn = init.getConnection(configFile, database);
		init.buildDatabase(config, conn);
	}

}
