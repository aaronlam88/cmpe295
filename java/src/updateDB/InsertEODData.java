package updateDB;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

public class InsertEODData {
	private static String[] symbol = { "AAPL", "MSFT", "AMZN", "FB", "JPM", "JNJ", "XOM", "GOOG", "GOOGL",
			"BAC", "WFC", "T", "CVX", "HD", "UNH", "V", "PG", "PFE", "INTC", "VZ", "CSCO", "C", "BA", "CMCSA", "ABBV",
			"KO", "DWDP", "PEP", "PM", "DIS", "MRK", "MA", "WMT", "ORCL", "MMM", "NVDA", "IBM", "MCD", "AMGN", "GE",
			"MO", "HON", "NFLX", "MDT", "BMY", "GILD", "UNP", "ABT", "TXN", "UTX", "SLB", "AVGO", "ACN", "QCOM", "ADBE",
			"PCLN", "CAT", "GS", "LMT", "USB", "NKE", "PYPL", "TMO", "LOW", "COST", "SBUX", "UPS", "TWX", "MS", "LLY",
			"CELG", "CVS", "CRM", "PNC", "NEE", "CHTR", "BIIB", "CB", "MDLZ", "COP", "AXP", "BLK", "CL", "ANTM", "WBA",
			"FDX", "SCHW", "EOG", "AET", "RTN", "AMT", "GD", "DHR", "NOC", "BDX", "AGN", "BK", "AIG", "OXY", "GM",
			"MON", "CME", "DUK", "ATVI", "DE", "AMAT", "ITW", "ADP", "SYK", "SPG", "TJX", "D", "MET", "CI", "MU", "CSX",
			"SPGI", "COF", "CTSH", "PRU", "SO", "EMR", "ISRG", "KHC", "CCI", "ESRX", "HAL", "PX", "MAR", "MMC", "F",
			"BBT", "EBAY", "KMB", "NSC", "PSX", "ICE", "TGT", "VLO", "VRTX", "HUM", "INTU", "TRV", "STT", "FOXA", "STZ",
			"EA", "ZTS", "ETN", "EXC", "BSX", "LYB", "JCI", "AON", "DAL", "TEL", "ECL", "APD", "HPQ", "AFL", "ALL",
			"KMI", "EQIX", "SHW", "WM", "MCK", "STI", "BAX", "APC", "AEP", "PLD", "FIS", "GIS", "MPC", "LUV", "ILMN",
			"ADI", "PGR", "EL", "ROST", "PXD", "PPG", "FISV", "HCA", "SYY", "CCL", "PSA", "MTB", "DFS", "ROP", "LRCX",
			"SYF", "CMI", "EW", "DXC", "APH", "VFC", "SRE", "YUM", "MNST", "WY", "MCO", "REGN", "GLW", "TROW", "DG",
			"KR", "ALXN", "HPE", "DLTR", "APTV", "WDC", "PEG", "ADM", "WMB", "PCAR", "SWK", "ED", "ZBH", "FCX", "PH",
			"IP", "ROK", "ADSK", "AMP", "RHT", "OKE", "IR", "TSN", "FITB", "KEY", "COL", "XEL", "ORLY", "DPS", "AVB",
			"FTV", "MYL", "RCL", "AAL", "CAH", "A", "RF", "CFG", "CXO", "NTRS", "WLTW", "DLR", "HCN", "EQR", "PPL",
			"PAYX", "AZO", "PCG", "NEM", "CERN", "NUE", "SBAC", "HIG", "EIX", "CBS", "WEC", "MCHP", "DVN", "SWKS",
			"VTR", "HRS", "OMC", "DTE", "ES", "BBY", "MGM", "CNC", "BXP", "LH", "AME", "K", "UAL", "CLX", "LNC", "HBAN",
			"PFG", "MHK", "GPN", "HLT", "MSI", "VMC", "INFO", "ALGN", "SYMC", "XLNX", "CMA", "CTL", "MTD", "WRK", "LLL",
			"KLAC", "WAT", "ABC", "EXPE", "NTAP", "DHI", "DOV", "FOX", "FAST", "IDXX", "TXT", "INCY", "CAG", "RSG",
			"VRSK", "ESS", "APA", "GPC", "TDG", "ANDV", "IQV", "HST", "STX", "TAP", "EMN", "TPR", "HSY", "EFX", "URI",
			"WYNN", "AWK", "FE", "GGP", "TSS", "NWL", "GWW", "BLL", "ETFC", "O", "SJM", "DGX", "MLM", "XRAY", "MRO",
			"IVZ", "MAS", "ETR", "CTAS", "FTI", "CHRW", "L", "ANSS", "XYL", "AEE", "CBOE", "RMD", "CBG", "BEN",
			"NBL", "SNPS", "NOV", "WHR", "ULTA", "CTXS", "CHD", "MKC", "KMX", "LEN", "WYN", "LB", "CMS", "LKQ", "BHGE",
			"ALB", "ADS", "AJG", "VIAB", "PVH", "HES", "VNO", "DRI", "EQT", "NLSN", "HSIC", "DVA", "PRGO", "RJF", "PNR",
			"KSU", "XL", "ARE", "HAS", "UNM", "CNP", "COG", "HOLX", "EXPD", "AKAM", "IFF", "COO", "FMC", "KSS", "VAR",
			"CDNS", "CINF", "IT", "PKG", "HCP", "BWA", "ARNC", "HII", "CA", "ZION", "UHS", "AMG", "TIF", "JBHT", "DISH",
			"RE", "NCLH", "AVY", "QRVO", "MAA", "EXR", "FBHS", "COTY", "VRSN", "XEC", "JNPR", "SLG", "KORS", "AMD",
			"SNA", "TMK", "FFIV", "AOS", "NDAQ", "WU", "TSCO", "DRE", "UDR", "CPB", "CF", "HRL", "IRM", "LNT", "IPG",
			"MOS", "HOG", "PNW", "REG", "SNI", "AAP", "LUK", "ALK", "FRT", "PHM", "GT", "PKI", "SEE", "NI", "JEC",
			"FLR", "NRG", "M", "ALLE", "HBI", "GRMN", "GPS", "HP", "RHI", "CMG", "AES", "PBCT", "MAC", "XRX", "FLIR",
			"AYI", "SRCL", "AIV", "LEG", "NWSA", "KIM", "RL", "FL", "BHF", "JWN", "MAT", "FLS", "HRB", "NFX", "CSRA",
			"SCG", "PWR", "AIZ", "DISCK", "TRIP", "EVHC", "NAVI", "DISCA", "SIG", "RRC", "PDCO", "CHK", "UAA", "UA",
			"NWS" };
	private static String api = "https://query1.finance.yahoo.com/v7/finance/download/#TABLE?period1=#TIME&period2=#TIME&interval=1d&events=history&crumb=mKgl5VWkoUY";
	private static Connection connection = null;
	private static String insertStmt = "INSERT INTO `#DATABASE`.`#TABLE` VALUES (?, ?, ?, ?, ?, ?);";

	public InsertEODData(String db) {
		if (connection == null) {
			connection = getDatabaseConnection(db);
		}
		insertStmt = insertStmt.replace("#DATABASE", db);
		api = api.replace("#TIME", this.startOfDay().toString());
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

	private void Process() {
		for (String tablename : symbol) {
			insert(tablename);
		}
	}

	private void insert(String tablename) {
		try {
			URL url = new URL(api.replace("#TABLE", tablename));
			URLConnection urlConn = url.openConnection();
			urlConn.setRequestProperty("cookie", "B=dcdfouhd4vdkt&b=3&s=n3; PRF=t%3D%255EGSPC%252BAAPL%252BAMD");
			BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
			// skip first line
			in.readLine();
			String inputLine = in.readLine();
			// break 2nd line
			String[] tokens = inputLine.split(",");
			// since we don't need Adj Close at [5], we remove it
			tokens[5] = tokens[6];
			Date date = Date.valueOf(tokens[0]);// converting string into sql date

			String query = insertStmt.replace("#TABLE", tablename);
			PreparedStatement ps = connection.prepareStatement(query);
			ps.setDate(1, date);
			for (int i = 1; i < tokens.length - 1; ++i) {
				if (tokens[i] == null || tokens[i].isEmpty()) {
					ps.setDouble(i + 1, java.sql.Types.NULL);
				} else {
					ps.setDouble(i + 1, Double.parseDouble(tokens[i]));
				}
			}
			System.out.println(ps.toString());
			ps.execute();
			in.close();
		} catch (Exception e) {
			System.out.println("[ERROR] cannot new get data for [" + tablename + "] with error" + e.getMessage());
		}
	}
	
	// return today time in epoch time (second)
	public Long startOfDay() {
		return Instant.now().truncatedTo(ChronoUnit.DAYS).toEpochMilli()/1000 - 86400 + 28800;
	}

	public static void main(String[] args) {
		if (args.length != 1) {
			System.out.println("InsertEODData database");
			System.exit(-1);
		}

		InsertEODData run = new InsertEODData(args[0]);
		run.Process();
	}

}
