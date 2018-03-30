package databaseManagement;

import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

public class DatabaseManager {
	protected static Logger logger = LoggerFactory.getLogger(DatabaseManager.class);

	private static int maxRun = 100;
	private static long currentDate = startOfDay();

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

	public ArrayList<Update> getMetaData() {
		try {
			String query = "SELECT * FROM StockDatabase.metaData WHERE lastUpdate < CURDATE() - 1;";
			Statement stmt = connection.createStatement();
			stmt.executeQuery(query);
			ResultSet result = stmt.getResultSet();
			ArrayList<Update> list = new ArrayList<>(maxRun);
			while (result.next() && maxRun > 0) {
				String tablename = result.getString(1);
				long lastUpdate = result.getLong(2);
				if (lastUpdate != 0) {
					lastUpdate = result.getDate(2).getTime();
				}
				boolean updateStatus = result.getBoolean(3);
				long updateDate = result.getLong(4);
				if (updateDate != 0) {
					updateDate = result.getDate(4).getTime() + 86400; // 86400 = 24 hours in seconds
				}
				Update update = new Update(tablename, lastUpdate, updateStatus, updateDate);
				if (update.shouldUpdate()) {
					list.add(update);
					--maxRun;
				}
			}
			return list;
		} catch (Exception e) {
			e.printStackTrace();
			logger.info(e.getMessage());
		}
		return null;
	}

	public void updateMetaDataTable(String table) {
		try {
			Timestamp time = new Timestamp(currentDate * 1000);
			String query = "UPDATE `StockDatabase`.`metaData` SET `lastUpdate`='" + time + "', `updateStatus`='" + 1
					+ "', `updateDate`='" + time + "' WHERE `Symbol`='" + table + "';\n";
			Statement stmt = connection.createStatement();
			stmt.executeUpdate(query);
			connection.commit();
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
	}

	/**
	 * create a table with table name
	 * 
	 * @param tablename
	 */
	public void createTable(String tablename) {
		try {
			String query = createTableStmt.replace("#TABLE", tablename);
			Statement statement = connection.createStatement();
			statement.executeUpdate(query);
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		logger.info("Table " + tablename + " created");
	}

	/**
	 * insert data in BufferedRead br into table id by tablename
	 * 
	 * @param tablename
	 * @param br
	 */
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

	/**
	 * get today start of the day epoch time in second
	 * 
	 * @return today start of the day in second
	 */
	public static long startOfDay() {
		return Instant.now().toEpochMilli() / 1000;
	}

	public static void main(String[] args) {
		logger.info("Start DatabaseManager");
		String schema = "StockDatabase"; // default schema
		String path_to_config_json = "../ignore/db_config.json";

		// if a schema and config path is supply by user, use them
		if (args.length >= 1) {
			schema = args[0];
		}
		if (args.length >= 2) {
			path_to_config_json = args[1];
		}

		insertStmt = insertStmt.replace("#DATABASE", schema);

		DatabaseManager manager = new DatabaseManager(path_to_config_json, schema);
		YahooAPIConnection yahooAPI = new YahooAPIConnection(manager.config.api);
		try {
			ArrayList<Update> list = manager.getMetaData();
			for (Update update : list) {
				manager.updateMetaDataTable(update.symbol);
			}
			for (Update update : list) {
				manager.createTable(update.symbol);
				BufferedReader br = yahooAPI.getData(update.symbol, update.lastUpdate, currentDate);
				manager.insert(update.symbol, br);
			}
		} catch (Exception e) {
			logger.debug(e.getMessage());
		}
		logger.info("End DatabaseManager");
	}

	class Update {
		public String symbol;
		public long lastUpdate;
		public boolean updateStatus;
		public long updateDate;
		public long currentDate;

		public Update(String symbol, long lastUpdate, boolean updateStatus, long updateDate) {
			this.symbol = symbol;
			this.lastUpdate = lastUpdate;
			this.updateStatus = updateStatus;
			this.updateDate = updateDate;
			this.currentDate = Instant.now().toEpochMilli() / 1000;
		}

		public boolean shouldUpdate() {
			int day = 24 * 60 * 60; // (day in second)
			return (updateStatus == false || (updateStatus == true && updateDate+day < currentDate));
		}
	}
}
