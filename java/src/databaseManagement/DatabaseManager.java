package databaseManagement;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.LinkedList;

public class DatabaseManager {
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
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
