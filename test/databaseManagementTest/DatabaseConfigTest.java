package databaseManagementTest;

import org.junit.Test;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

import databaseManagement.DatabaseConfig;
import java.io.FileNotFoundException;
import java.io.FileReader;

public class DatabaseConfigTest {
	@Test
	public void test() {
		try {
			String configFile = "./ignore/db_config.json";
			Gson gson = new Gson();
			DatabaseConfig config = gson.fromJson(new FileReader(configFile), DatabaseConfig.class);
			config.getApi();
			config.getCookies();
			config.getHost();
			config.getPassword();
			config.getSetting();
			config.getTables();
			config.getUsername();
		} catch (JsonSyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonIOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
