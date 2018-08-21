USE INFORMATION_SCHEMA;
SELECT 
CONCAT("UPDATE `StockDatabase`.`4update` SET `lastUpdate` = (SELECT MAX(Date) FROM `", TABLE_SCHEMA,"`.`", TABLE_NAME, "`), `updateStatus` = 0 WHERE Symbol = '", TABLE_NAME, "';") 
AS MySQLCMD FROM TABLES 
WHERE TABLE_SCHEMA = "StockDatabase";