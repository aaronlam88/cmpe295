package database.management;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DatabaseManager {
    private static Logger logger = LoggerFactory.getLogger(DatabaseManager.class);

    private static int maxRun = 100;
    private static java.util.Date currentDate = new java.util.Date();

    private static String insertStmt = "INSERT INTO `#DATABASE`.`#TABLE` VALUES (?, ?, ?, ?, ?, ?, ?);";

    private Connection connection;
    private DatabaseConfig config;

    private DatabaseManager(String path_to_config_json, String schema) {
        this.connection = DatabaseConnection.getDatabaseConnection(path_to_config_json, schema);

        Gson gson = new Gson();
        try {
            this.connection.setAutoCommit(false);
            this.config = gson.fromJson(new FileReader(path_to_config_json), DatabaseConfig.class);
        } catch (SQLException e) {
            logger.error("SQLException " + e.getLocalizedMessage());
        } catch (JsonSyntaxException e) {
            logger.error("JsonSyntaxException " + e.getLocalizedMessage());
        } catch (JsonIOException e) {
            logger.error("JsonIOException " + e.getLocalizedMessage());
        } catch (FileNotFoundException e) {
            logger.error("FileNotFoundException " + e.getLocalizedMessage());
        }
    }

    public static void main(String[] args) {
        //check if market is currently in session, DO NOT UPDATE, reason: incompleted
        if (!YahooAPIConnection.isMarketOpen()) {
            logger.info("STOP: market is open, I don't want to get incompleted data");
            return;
        }

        logger.info("Start DatabaseManager");
        String schema = "StockDatabase"; // default schema
        String path_to_config_json = "../ignore/db_config.json"; // default db_config.json path

        // if a schema or config path are supplied by user, use them
        if (args.length >= 1) {
            schema = args[0];
        }
        if (args.length >= 2) {
            path_to_config_json = args[1];
        }
        // create insert statement according to schema
        insertStmt = insertStmt.replace("#DATABASE", schema);

        // create needed objects
        DatabaseManager manager = new DatabaseManager(path_to_config_json, schema);
        YahooAPIConnection yahooAPI = new YahooAPIConnection(manager.config.api, manager.config.cookies);

        try {
            ArrayList<Update> list = manager.getMetaData();
            if (list == null) {
                logger.debug("Update list is NULL");
            }
            for (Update update : list) {
                manager.updateMetaDataTable(update.symbol);
            }
            for (Update update : list) {
                manager.createTable(update.symbol);
                BufferedReader bufferedReader = yahooAPI.getData(update.symbol, (update.lastUpdate + update.milliSecondInADay) / 1000,
                        currentDate.getTime() / 1000);
                manager.insert(update.symbol, bufferedReader, update.lastUpdate);
            }
            manager.connection.close();
        } catch (SQLException e) {
            logger.error("SQLException " + e.getLocalizedMessage());
        }
        logger.info("End DatabaseManager");
    }

    /**
     * getMetaData to know which table should be update (distributed system)
     */
    private ArrayList<Update> getMetaData() {
        try {
            String query = "SELECT * FROM `4update` WHERE lastUpdate < CURDATE() + 2 OR updateStatus = 0 ORDER BY lastUpdate ASC;";
            Statement stmt = connection.createStatement();
            stmt.executeQuery(query);
            ResultSet result = stmt.getResultSet();
            ArrayList<Update> list = new ArrayList<>(maxRun);
            while (result.next() && maxRun > 0) {
                String tableName = result.getString(1);
                long lastUpdate = result.getLong(2);
                if (lastUpdate != 0) {
                    lastUpdate = result.getDate(2).getTime();
                }
                boolean updateStatus = result.getBoolean(3);
                Update update = new Update(tableName, lastUpdate, updateStatus);
                if (update.shouldUpdate()) {
                    list.add(update);
                    --maxRun;
                }
            }
            return list;
        } catch (SQLException e) {
            logger.error("SQLException " + e.getLocalizedMessage());
        }
        return null;
    }

    private void updateMetaDataTable(String table) {
        try {
            Timestamp time = new Timestamp(currentDate.getTime());
            String query = "UPDATE `4update` SET `lastUpdate`='" + time + "', `updateStatus`='1' WHERE `Symbol`='"
                    + table + "';\n";
            Statement stmt = connection.createStatement();
            stmt.executeUpdate(query);
            connection.commit();
        } catch (SQLException e) {
            logger.error("SQLException" + e.getLocalizedMessage());
        }
    }

    /**
     * create a table with table name
     *
     * @param tableName
     */
    private void createTable(String tableName) {
        try {
            String createTableStmt = "CREATE TABLE IF NOT EXISTS `#TABLE` (\n" + "  `Date` DATETIME NOT NULL,\n"
                    + "  `Open` DOUBLE NULL,\n" + "  `High` DOUBLE NULL,\n" + "  `Low` DOUBLE NULL,\n"
                    + "  `Close` DOUBLE NULL,\n" + "  `Adj Close` DOUBLE NULL,\n" + "  `Volume` DOUBLE NULL,\n"
                    + "  PRIMARY KEY (`Date`));";
            String query = createTableStmt.replace("#TABLE", tableName);
            Statement statement = connection.createStatement();
            statement.executeUpdate(query);
        } catch (SQLException e) {
            logger.error("SQLException " + e.getLocalizedMessage());
        }
        logger.info("Table " + tableName + " created");
    }

    /**
     * validate all fields before add to batch insert
     */
    private boolean isValidateTokens(String tokens[]) {
        // if not enough field
        if (tokens.length != 7) {
            return false;
        }
        // if a field is empty
        for (String token : tokens) {
            if (token == null || token.isEmpty() || token.compareTo("null") == 0 || token.compareTo("0") == 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * insert data in BufferedRead bufferedReader into table id by tableName
     *
     * @param tableName name of table where the data should be inserted
     * @param bufferedReader where data can be read line by line
     * @param lastUpdate the current max date in table tableName (max key)
     */
    private void insert(String tableName, BufferedReader bufferedReader, long lastUpdate) {
        // if we reach the API limit, we may get bufferedReader == null, nothing we can do here
        if (bufferedReader == null) {
            logger.error("BufferedReader == NULL");
            return;
        }

        logger.info("Start insert data ...");
        try {
            String query = insertStmt.replace("#TABLE", tableName);
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setFetchSize(10000);
            int batchSize = 10000;

            bufferedReader.readLine();// ignore first line
            Date lastDate = new Date(lastUpdate); // lastDate use to avoid duplicated Date -> dup key error
            // read file line by line
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                // make sure the preparedStatement parameters are clear out
                preparedStatement.clearParameters();

                // split the line into 7 fields
                String tokens[] = line.split(",");

                // error checking, if not valid tokens, skip
                if (!isValidateTokens(tokens)) {
                    continue;
                }

                // try to convert string into sql date
                Date date = Date.valueOf(tokens[0]);
                if (date == null || date.equals(lastDate)) {
                    // wrong data format
                    continue;
                } else {
                    // duplicated date
                    lastDate = date;
                }
                preparedStatement.setDate(1, date);

                // covert other fields to double
                for (int i = 1; i < tokens.length; ++i) {
                    preparedStatement.setDouble(i + 1, Double.parseDouble(tokens[i]));
                }

                // add preparedStatement to batch, waiting to execute and commit
                preparedStatement.addBatch();
                --batchSize;

                // execute batch if the we have enough
                if (batchSize <= 0) {
                    preparedStatement.executeBatch();
                    // reset batchSize
                    batchSize = 10000;
                }
            }
            // done reading data

            // execute the last batch
            preparedStatement.executeBatch();
            // commit all before leaving
            connection.commit();

            // do clean up
            bufferedReader.close();
            preparedStatement.close();
        } catch (IOException e) {
            logger.error("IOException " + e.getLocalizedMessage());
        } catch (SQLException e) {
			logger.error("SQLException " + e.getLocalizedMessage());
		}

        logger.info("Done insert for " + tableName);
    }

    class Update {
        String symbol;
        long lastUpdate;
        boolean updateStatus;

        int milliSecondInADay = 24 * 60 * 60 * 1000;
        // calender object to be used to get datetime info
        Calendar calendar = Calendar.getInstance();
        // if the is a gap between current date and lastUpdate date >= maxDateGap, should try to update
        int maxDateGap = 2;

        Update(String symbol, long lastUpdate, boolean updateStatus) {
            this.symbol = symbol;
            this.lastUpdate = lastUpdate;
            this.updateStatus = updateStatus;
        }

        /**
         * if isBigDayGap update (more than maxDateGap days)
         * else if weekday, update; if weekend, only update if lastUpdate is not Friday
         */
        boolean shouldUpdate() {
            // check date gap
            if(isBigDayGap()) {
                logger.debug("shouldUpdate: isBigDayGap");
                return true;
            }
            
            // get lastUpdateDayOfWeek
            calendar.setTime(new java.util.Date(lastUpdate));
            int lastUpdateDayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
            // get currentDateDayOfWeek
            calendar.setTime(new java.util.Date());
            int currentDateDayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);

            // if last update was on LAST Friday AND NOW is WEEKEND, do no update, reason: market closed during weekend
            if (lastUpdateDayOfWeek == Calendar.FRIDAY
                    && (currentDateDayOfWeek == Calendar.SATURDAY || currentDateDayOfWeek == Calendar.SUNDAY)) {
                logger.debug("NO UPDATE: weekend - lastUpdate on Friday");
                return false;
            }
            logger.debug("shouldUpdate: weekday");
            return true;
        }

        @Override
        public String toString() {
            return symbol + " | " + lastUpdate + " | " + updateStatus + "\n";
        }

        private boolean isBigDayGap() {
            int dateGap = (int) ((LocalDate.now().toEpochDay() - lastUpdate) / milliSecondInADay);
            if (dateGap > maxDateGap) {
                return true;
            } else {
                return false;
            }
        }
    }
}
