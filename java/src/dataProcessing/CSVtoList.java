package dataProcessing;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;

public class CSVtoList {
	private ArrayList<String[]> list = new ArrayList<>();
	
	public CSVtoList (File file, boolean hasDataHeader) {
		this.createList1(file, hasDataHeader);
	}

	private void createList1(File file, boolean hasDataHeader) {
		try {
			FileReader fileReader = new FileReader(file);
			BufferedReader bufferedReader = new BufferedReader(fileReader);
			String line;
			if (hasDataHeader) {
				bufferedReader.readLine(); 
			}
			while ((line = bufferedReader.readLine()) != null) {
				list.add(line.split(","));
			}
			fileReader.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public ArrayList<String[]> getList() {
		return list;
	}
}
