package databaseManagement;

public class DatabaseConfig {
	private String username;
	private String password;
	private String host;
	private String database;
	private String setting;
	private String api;
	private String cookies;
	private String[] tables;
	
	public String getApi() {
		return api;
	}

	public String getCookies() {
		return cookies;
	}

	public String[] getTables() {
		return tables;
	}

	public String getUsername() {
		return username;
	}

	public String getPassword() {
		return password;
	}

	public String getHost() {
		return host;
	}

	public String getSetting() {
		return setting;
	}

	public String getDatabase() {
		return database;
	}
}
