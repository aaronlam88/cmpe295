package databaseManagement;

import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

public class DatabaseManager {
	protected static Logger logger = LoggerFactory.getLogger(DatabaseManager.class);
	private static int maxRun = 100;
	private static String createTableStmt = "CREATE TABLE `StockDatabase`.`#TABLE` (\n"
			+ "  `Date` DATETIME NOT NULL,\n" + "  `Open` DOUBLE NULL,\n" + "  `High` DOUBLE NULL,\n"
			+ "  `Low` DOUBLE NULL,\n" + "  `Close` DOUBLE NULL,\n" + "  `Adj Close` DOUBLE NULL,\n"
			+ "  `Volume` DOUBLE NULL,\n" + "  PRIMARY KEY (`Date`));";
	
	private static String insertStmt = "INSERT INTO `#DATABASE`.`#TABLE` VALUES (?, ?, ?, ?, ?, ?, ?);";

	Connection connection = null;
	ResultSet metaData = null;
	DatabaseConfig config = null;

	public DatabaseManager(String path_to_config_json, String schema) {
		this.connection = DatabaseConnection.getDatabaseConnection(path_to_config_json, schema);

		Gson gson = new Gson();
		try {
			this.connection.setAutoCommit(false);
			this.config = gson.fromJson(new FileReader(path_to_config_json), DatabaseConfig.class);
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
	}

	public ResultSet getMetaData() {
		if (this.metaData == null) {
			try {
				String query = "SELECT * FROM StockDatabase.metaData;";
				Statement stmt = connection.createStatement();
				stmt.executeQuery(query);
				connection.commit();
				this.metaData = stmt.getResultSet();
			} catch (Exception e) {
				logger.debug(e.getMessage());
			}
		}
		return this.metaData;
	}

	public void updateMetaDataTable(String table, long currentTime) {
		try {
			String query = "UPDATE `StockDatabase`.`metaData` SET `lastUpdate`='" + currentTime + "', `updateStatus`='"
					+ currentTime + "', `updateDate`='" + currentTime + "' WHERE `Symbol`='" + table + "';\n";
			Statement stmt = connection.createStatement();
			stmt.executeQuery(query);
			connection.commit();
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
	}

	public void createTable(String tablename) {
		try {
			String query = createTableStmt.replace("#TABLE", tablename);
			Statement statement = connection.createStatement();
			statement.executeUpdate(query);

			query = "TRUNCATE TABLE `" + tablename + "`";
			statement.executeUpdate(query);
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		logger.info("Table " + tablename + " created");
	}

	public void insert(String tablename, BufferedReader br) {
		logger.info("Start insert data...");
		String line = null;
		try {
			String query = insertStmt.replace("#TABLE", tablename);
			PreparedStatement ps = connection.prepareStatement(query);
			ps.setFetchSize(10000);
			int batchSize = 10000;
			br.readLine();// ignore first line
			while ((line = br.readLine()) != null) {
				String tokens[] = line.split(",");
				Date date = Date.valueOf(tokens[0]);// converting string into sql date
				ps.setDate(1, date);
				for (int i = 1; i < tokens.length; ++i) {
					if (tokens[i] == null || tokens[i].isEmpty()) {
						ps.setDouble(i + 1, java.sql.Types.NULL);
					} else {
						ps.setDouble(i + 1, Double.parseDouble(tokens[i]));
					}
				}
				ps.addBatch();
				ps.clearParameters();
				if (batchSize <= 0) {
					ps.executeBatch();
					batchSize = 10000;
				}
				--batchSize;
			}
			br.close();
			ps.executeBatch();
			ps.close();
			connection.commit();
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		logger.info("Done insert for table " + tablename);
	}

	public long startOfDay() {
		return Instant.now().truncatedTo(ChronoUnit.DAYS).toEpochMilli() / 1000;
	}

	public static void main(String[] args) {
		logger.info("Start DatabaseManager");
		String schema = "StockDatabase"; // default schema
		String path_to_config_json = "../ignore/db_config.json";

		// if a schema and config path is supply by user, use them
		if (args.length >= 1) {
			schema = args[1];
		}
		if (args.length >= 2) {
			path_to_config_json = args[2];
		}
		
		insertStmt = insertStmt.replace("#DATABASE", schema);

		DatabaseManager manager = new DatabaseManager(path_to_config_json, schema);
		long currentDate = manager.startOfDay();
		try {
			ResultSet metaData = manager.getMetaData();
			while (metaData.next() && maxRun > 0) {
				String tablename = metaData.getString(1);
				long lastUpdate = metaData.getLong(2);
				boolean updateStatus = metaData.getBoolean(3);
				long updateDate = metaData.getLong(4) + 86400; // 86400 = 24 hours in seconds

				if (updateStatus == false || updateDate < currentDate) {
					--maxRun;
					manager.createTable(tablename);
					YahooAPIConnection yahooAPI = new YahooAPIConnection(manager.config.api);
					BufferedReader br = yahooAPI.getData(tablename, lastUpdate, currentDate);
					manager.insert(tablename, br);
					manager.updateMetaDataTable(tablename, currentDate);
				}
			}
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		logger.info("End DatabaseManager");
	}

}
