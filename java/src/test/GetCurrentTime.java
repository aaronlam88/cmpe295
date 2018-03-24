package test;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

public class GetCurrentTime {
	
	public static Long startOfDay() {
		return Instant.now().truncatedTo(ChronoUnit.DAYS).toEpochMilli()/1000;
	}

	public static void main(String[] args) {
		System.out.println(startOfDay().toString());
	}

}
