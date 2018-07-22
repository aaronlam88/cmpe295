# CONFIG
All config such as username, password, or host should be in ignore folder in current directory.
Please ask your project manager for this folder or set it up yourself so you can run the project.
## config file
path should be (./ignore/db_config.json)
```javascript
{
	"username": "****",
	"password": "****",
	"host": "****",
	"port": "****",
	"database": "****",
	"jdbc_prefix": "****",
	"jdbc_setting": "****",
	"api": "****",
	"cookies": "****",
}
# Java Database Manager
```
# Webapp
To run webapp, you will need node and npm installed
```
cd javascript/webapp
npm install
npm install -g webpack webpack-cli
npm start
```
# Server
To run server, you will need node and npm installed
```
cd javascript/server
npm install
node app.js
```
