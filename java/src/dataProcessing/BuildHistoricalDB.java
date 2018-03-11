package dataProcessing;

import java.io.File;
import java.util.ArrayList;

public class BuildHistoricalDB {

	public static void main(String[] args) {
		if (args.length < 1) System.exit(-1);
		
		File file = new File (args[0]);
		boolean hasDataHeader = args.length < 2 || args[1].equals("yes");
		CSVtoList genList = new CSVtoList(file, hasDataHeader);
		ArrayList<String[]> list = genList.getList();
		
		GetDataFromWeb getData = new GetDataFromWeb("http://download.macrotrends.net/assets/php/stock_data_export.php");
		for(String[] array : list) {
			System.out.println("Processing " + array[2]);
			getData.saveDateToFile(array[2]);
			System.out.println("Done!");
		}
	}

}
