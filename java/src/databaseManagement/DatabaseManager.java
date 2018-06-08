package databaseManagement;

import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;

public class DatabaseManager {
	protected static Logger logger = LoggerFactory.getLogger(DatabaseManager.class);

	private static int maxRun = 100;
	private static java.util.Date currentDate = new java.util.Date();

	private static String createTableStmt = "CREATE TABLE IF NOT EXISTS `#TABLE` (\n" + "  `Date` DATETIME NOT NULL,\n"
			+ "  `Open` DOUBLE NULL,\n" + "  `High` DOUBLE NULL,\n" + "  `Low` DOUBLE NULL,\n"
			+ "  `Close` DOUBLE NULL,\n" + "  `Adj Close` DOUBLE NULL,\n" + "  `Volume` DOUBLE NULL,\n"
			+ "  PRIMARY KEY (`Date`));";

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
			logger.error("[DatabaseManager ERROR] ", e);
		}
	}

	/**
	 * getMetaData to know which table should be update (distributed system)
	 */
	public ArrayList<Update> getMetaData() {
		try {
			String query = "SELECT * FROM `4update` WHERE lastUpdate < CURDATE() + 2 AND updateStatus = 0 ORDER BY lastUpdate ASC;";
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
				Update update = new Update(tablename, lastUpdate, updateStatus);
				if (update.shouldUpdate()) {
					list.add(update);
					--maxRun;
				}
			}
			return list;
		} catch (Exception e) {
			logger.error("[getMetaData ERROR] ", e);
		}
		return null;
	}

	public void updateMetaDataTable(String table) {
		try {
			Timestamp time = new Timestamp(currentDate.getTime());
			String query = "UPDATE `4update` SET `lastUpdate`='" + time + "', `updateStatus`='1' WHERE `Symbol`='"
					+ table + "';\n";
			Statement stmt = connection.createStatement();
			stmt.executeUpdate(query);
			connection.commit();
		} catch (Exception e) {
			logger.error("[updateMetaDataTable ERROR] ", e);
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
			logger.error("[createTable ERROR] ", e);
		}
		logger.info("Table " + tablename + " created");
	}

	/**
	 * insert data in BufferedRead br into table id by tablename
	 * 
	 * @param tablename
	 * @param br
	 */
	public void insert(String tablename, BufferedReader br, long lastUpdate) {
		// if we reach the API limit, we may get br == null, nothing we can do here
		if (br == null) {
			logger.error("NULL BufferedReader");
			return;
		}

		logger.info("Start insert data...");
		String line = null;
		try {
			String query = insertStmt.replace("#TABLE", tablename);
			PreparedStatement ps = connection.prepareStatement(query);
			ps.setFetchSize(10000);
			int batchSize = 10000;

			br.readLine();// ignore first line
			Date lastDate = new Date(lastUpdate); // lastDate use to avoid duplicated Date -> dup key error
			// read file line by line
			while ((line = br.readLine()) != null) {
				boolean error = false;
				ps.clearParameters();
				// split the line into 7 fields
				String tokens[] = line.split(",");
				// error check
				if (tokens.length != 7) {
					continue;
				}
				// convert string into sql date
				Date date = Date.valueOf(tokens[0]);
				if (date == null || date.equals(lastDate)) {
					continue;
				} else {
					lastDate = date;
				}
				ps.setDate(1, date);
				// covert other fields to double
				for (int i = 1; i < tokens.length; ++i) {
					// check for error in each field
					if (tokens[i] == null || tokens[i].isEmpty() || tokens[i].compareTo("null") == 0
							|| tokens[i].compareTo("0") == 0) {
						error = true;
						break;
					} else {
						ps.setDouble(i + 1, Double.parseDouble(tokens[i]));
					}
				}
				// do not add insert statement with error to batch
				if (error) {
					continue;
				}
				ps.addBatch();
				--batchSize;
				// execute batch if the we have enough
				if (batchSize <= 0) {
					ps.executeBatch();
					batchSize = 10000;
				}
			}
			br.close();
			ps.executeBatch();
			ps.close();
			connection.commit();
		} catch (Exception e) {
			logger.error("insert ERROR", e);
		}

		logger.info("Done insert for table " + tablename);
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
		YahooAPIConnection yahooAPI = new YahooAPIConnection(manager.config.api, manager.config.cookies);
		try {
			ArrayList<Update> list = manager.getMetaData();
			for (Update update : list) {
				manager.updateMetaDataTable(update.symbol);
			}
			for (Update update : list) {
				manager.createTable(update.symbol);
				BufferedReader br = yahooAPI.getData(update.symbol, (update.lastUpdate + update.DATEMILLISECOND) / 1000,
						currentDate.getTime() / 1000);
				manager.insert(update.symbol, br, update.lastUpdate);
			}
		} catch (Exception e) {
			logger.error("[main ERROR] ", e);
		}
		logger.info("End DatabaseManager");
	}

	class Update {
		public long DATEMILLISECOND = 24 * 60 * 60 * 1000; // 1 days in millisecond
		public String symbol;
		public long lastUpdate;
		public boolean updateStatus;
		public long currentDate;

		public Update(String symbol, long lastUpdate, boolean updateStatus) {
			this.symbol = symbol;
			this.lastUpdate = lastUpdate;
			this.updateStatus = updateStatus;
			this.currentDate = new java.util.Date().getTime();
		}

		public boolean shouldUpdate() {
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(new java.util.Date(lastUpdate));
			int lastUpdateDayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
			calendar.setTime(new java.util.Date());
			int currentDateDayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
			long dateGap = currentDate - lastUpdate;
			if (lastUpdateDayOfWeek == Calendar.FRIDAY && (currentDateDayOfWeek == Calendar.SATURDAY || currentDateDayOfWeek == Calendar.SUNDAY)) {
				if (dateGap > 2 * DATEMILLISECOND) {
					return true;
				} else {
					return false;
				}
			} else {
				if (updateStatus == false) {
					return true;
				} else {
					return dateGap > 2 * DATEMILLISECOND;
				}
			}
		}

		public String toString() {
			return symbol + " | " + lastUpdate + " | " + updateStatus + "\n";
		}
	}
}
