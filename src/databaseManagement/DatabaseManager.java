package databaseManagement;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.logging.Level;
import java.util.logging.Logger;

public class DatabaseManager {
	private static final Logger LOGGER = Logger.getLogger(DatabaseManager.class.getName());

	LinkedList<String> tablenames = new LinkedList<>();
	HashMap<String, LinkedList<String>> workerMap = new HashMap<>();

	public static void main(String[] args) {
		DatabaseManager manager = new DatabaseManager();
		Connection connection = DatabaseConnection.getInstance("./ignore/db_config.json", "new_SP500");
		String query = "SELECT table_name FROM information_schema.tables where table_schema='SP500';";
		try {
			ResultSet resultSet = connection.prepareCall(query).executeQuery();
			while(resultSet.next()) {
				manager.tablenames.add(resultSet.getString(1));
			}
			LOGGER.log(Level.INFO, "number of tables: " + manager.tablenames.size() );
			for(String table : manager.tablenames) {
				query = "SELECT MAX(Date) FROM `SP500`.`" + table +"`";
				resultSet = connection.prepareCall(query).executeQuery();
				if(resultSet.next()) {
					query = "INSERT INTO `SP500`.`4update` VALUES (?, ?);";
					PreparedStatement stmt = connection.prepareStatement(query);
					stmt.setString(1, table);
					stmt.setDate(2, resultSet.getDate(1));
					stmt.execute();
					LOGGER.log(Level.INFO, stmt.toString());
				}
			}
			connection.commit();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}

}
