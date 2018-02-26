package buildDB;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Statement;

public class ImportCSVs {

	private static Connection connection = null;

	private String src_dir;

	String createStmt = "CREATE TABLE IF NOT EXISTS `#TABLE` (`Date` datetime DEFAULT NULL, `Open` double DEFAULT NULL, `High` double DEFAULT NULL, `Low` double DEFAULT NULL, `Close` double DEFAULT NULL, `Adj Close` double DEFAULT NULL, `Volume` int(11) DEFAULT NULL);";

	String insertStmt = "INSERT INTO `#DATABASE`.`#TABLE` VALUES (?, ?, ?, ?, ?, ?, ?);";

	public ImportCSVs(String db, String src_dir) {
		if (connection == null) {
			connection = getDatabaseConnection(db);
		}
		this.setSrc_dir(src_dir);
		insertStmt = insertStmt.replace("#DATABASE", db);
	}

	private Connection getDatabaseConnection(String db) {
		String database = System.getenv("DATABASE") + db + "?autoReconnect=true&useSSL=false";
		System.out.println("Connecting to database " + db + "...");
		Connection connection = null;
		try {
			String username = System.getenv("DB_USERNAME");
			String password = System.getenv("DB_PASSWORD");
			connection = DriverManager.getConnection(database, username, password);
			connection.setAutoCommit(false);
		} catch (Exception e) {
			System.out.println("Cannot connect to database");
			System.out.println("Error message: " + e);
			System.exit(1);
		}
		if (connection == null) {
			System.exit(-1);
		}
		return connection;
	}

	public void Process() {
		File folder = new File(src_dir);

		if (folder.isFile()) {
			String filename = folder.getName();
			String tablename;
			if (filename.lastIndexOf('.') > 0) {
				tablename = filename.substring(0, filename.lastIndexOf('.'));
			} else {
				tablename = filename;
			}

			System.out.println("Processing file: " + src_dir);
			createTable(tablename);
			insert(tablename, folder);
			System.out.println("Done Processing file: " + src_dir);
			return;
		}

		File[] listOfFiles = folder.listFiles();

		for (int i = 0; i < listOfFiles.length; i++) {
			if (listOfFiles[i].isDirectory()) {
				// ignore directory
				continue;
			}
			String filename = listOfFiles[i].getName();

			String tablename;
			if (filename.lastIndexOf('.') > 0) {
				tablename = filename.substring(0, filename.lastIndexOf('.'));
			} else {
				tablename = filename;
			}

			System.out.println("Processing file: " + filename);
			createTable(tablename);
			insert(tablename, listOfFiles[i]);
			System.out.println("Done Processing file: " + filename);
		}
	}

	public void createTable(String tablename) {
		try {
			String query = createStmt.replace("#TABLE", tablename);
			Statement statement = connection.createStatement();
			statement.executeUpdate(query);

			query = "TRUNCATE TABLE `" + tablename + "`";
			statement.executeUpdate(query);
		} catch (Exception e) {
			System.out.println(e.getMessage());
		}
		System.out.println("Table " + tablename + " created");
	}

	public void insert(String tablename, File file) {
		System.out.println("Start insert data...");
		String line = null;
		try {
			String query = insertStmt.replace("#TABLE", tablename);
			PreparedStatement ps = connection.prepareStatement(query);
			ps.setFetchSize(50000);

			BufferedReader br = new BufferedReader(new FileReader(file));
			br.readLine();// ignore first line
			while ((line = br.readLine()) != null) {
				String tokens[] = line.split(",");
				Date date = Date.valueOf(tokens[0]);// converting string into sql date
				ps.setDate(1, date);
				for (int i = 1; i < tokens.length; ++i) {
					if (tokens[i] == null || tokens[i].isEmpty() || tokens[i].equals("null")) {
						ps.setDouble(i + 1, java.sql.Types.NULL);
					} else {
						ps.setDouble(i + 1, Double.parseDouble(tokens[i]));
					}
				}
				ps.addBatch();
				ps.clearParameters();
			}
			System.out.println("executeBatch");
			br.close();
			ps.executeBatch();
			ps.close();
			connection.commit();
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(line);
		}
		file.deleteOnExit();
		System.out.println("Done isnert");
	}

	public String getSrc_dir() {
		return src_dir;
	}

	public void setSrc_dir(String src_dir) {
		this.src_dir = src_dir;
	}

	public static void main(String[] args) {
		if (args.length != 2) {
			System.out.println("ImportCSVs database src_dir");
			System.exit(-1);
		}

		ImportCSVs test = new ImportCSVs(args[0], args[1]);
		test.Process();
	}

}
