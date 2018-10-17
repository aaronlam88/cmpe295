package database.management;

import java.io.BufferedReader;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;

import com.google.gson.Gson;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DatabaseManager {
    private static Logger logger = LoggerFactory.getLogger(DatabaseManager.class);

    private static int maxRun = 500;
    private static int BATCHSIZE = 50 * 1000;
    private static java.util.Date currentDate = new java.util.Date();

    private static String insertStmt = "INSERT INTO `#DATABASE`.`#TABLE` VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `Open` = ?,`High` = ?, `Low` = ?, `Close` = ?,`Adj Close`=?,`Volume`=?;";

    private Connection connection;
    private DatabaseConfig config;

    private DatabaseManager(String path_to_config_json, String schema) {
        connection = null;
        this.connection = DatabaseConnection.getDatabaseConnection(path_to_config_json, schema);

        Gson gson = new Gson();
        config = null;
        try {
            this.connection.setAutoCommit(false);
            this.config = gson.fromJson(new FileReader(path_to_config_json), DatabaseConfig.class);
        } catch (Exception e) {
            logger.error("[DatabaseManager ERROR] ", e);
        }
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
            if (list == null) {
                throw new AssertionError();
            }
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

    /**
     * getMetaData to know which table should be update (distributed system)
     */
    private ArrayList<Update> getMetaData() {
        try {
            String query = "SELECT * FROM `4update` WHERE lastUpdate <= CURDATE() AND updateStatus = 0 ORDER BY lastUpdate ASC;";
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
                list.add(update);
                --maxRun;
            }
            return list;
        } catch (Exception e) {
            logger.error("[getMetaData ERROR] ", e.getLocalizedMessage());
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
        } catch (Exception e) {
            logger.error("[updateMetaDataTable ERROR] ", e);
        }
    }

    /**
     * create a table with table name
     *
     * @param tablename
     */
    private void createTable(String tablename) {
        try {
            String createTableStmt = "CREATE TABLE IF NOT EXISTS `#TABLE` (\n" + "  `Date` DATETIME NOT NULL,\n"
                    + "  `Open` DOUBLE NULL,\n" + "  `High` DOUBLE NULL,\n" + "  `Low` DOUBLE NULL,\n"
                    + "  `Close` DOUBLE NULL,\n" + "  `Adj Close` DOUBLE NULL,\n" + "  `Volume` DOUBLE NULL,\n"
                    + "  PRIMARY KEY (`Date`));";
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
     * @param tablename, br, lastUpdate
     */
    private void insert(String tablename, BufferedReader br, long lastUpdate) {
        // if we reach the API limit, we may get br == null, nothing we can do here
        if (br == null) {
            logger.error("NULL BufferedReader");
            return;
        }

        logger.info("Start insert data...");
        String line;
        try {
            String query = insertStmt.replace("#TABLE", tablename);
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setFetchSize(BATCHSIZE);
            int batchSize = BATCHSIZE;

            br.readLine();// ignore first line
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
                if (date == null) {
                    continue;
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
                        ps.setDouble(i + 7, Double.parseDouble(tokens[i]));
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
                    batchSize = BATCHSIZE;
                }
            }
            // close buffered reader
            br.close();
            // execute the last batch
            ps.executeBatch();
            // close prepared statement
            ps.close();
            // commit all the changes
            connection.commit();
        } catch (Exception e) {
            logger.error("insert ERROR", e);
        }

        logger.info("Done insert for table " + tablename);
    }

    class Update {
        long DATEMILLISECOND = 24 * 60 * 60 * 1000; // 1 days in millisecond
        String symbol;
        long lastUpdate;
        boolean updateStatus;
        long currentDate;

        Update(String symbol, long lastUpdate, boolean updateStatus) {
            this.symbol = symbol;
            this.lastUpdate = lastUpdate;
            this.updateStatus = updateStatus;
            this.currentDate = new java.util.Date().getTime();
        }

        @Override
        public String toString() {
            return symbol + " | " + lastUpdate + " | " + updateStatus + "\n";
        }
    }
}
