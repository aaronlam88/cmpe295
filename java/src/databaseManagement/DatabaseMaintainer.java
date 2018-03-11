package databaseManagement;

public class DatabaseMaintainer {

	public static void main(String[] args) {
		String schema = "SP500"; // default schema
		
		// if a schema is supply by user, set use schema
		if (args.length == 1) {
			schema = args[1];
		}
		
		
	}

}
