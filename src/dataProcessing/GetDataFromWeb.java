package dataProcessing;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.HashSet;

import org.apache.commons.io.FileUtils;

public class GetDataFromWeb {
	private String link;
	private HashSet<String> nameSet;
	public GetDataFromWeb (String link) {
		this.link = link;
		
		File folder = new File ("./data");
		String[] nameList = folder.list();
		nameSet = new HashSet<>(nameList.length);
		for (String str : nameList) {
			nameSet.add(str);
		}
	}
	
	public void saveDateToFile (String getParam) {
		saveDateToFile (getParam, getParam);
	}
	
	public void saveDateToFile (String getParam, String filename) {
		if (nameSet.contains(getParam) || nameSet.contains(filename)) {
			return;
		} else {
			File file = new File ("./data/" + filename);
			try {
				// save file get from url to data/filename
				URL url = new URL(link + "?t=" + getParam);
				FileUtils.copyURLToFile(url, file);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
