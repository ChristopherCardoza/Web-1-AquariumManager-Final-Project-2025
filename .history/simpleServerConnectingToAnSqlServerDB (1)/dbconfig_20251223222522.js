// this is what the databse config looks like:
/*const config = {
    server,
    port,
    database,
    user,
    password,
    options: {
        encrypt: true
    }
};*/

// configuration to connect the Node.js Express
// server to a database that is on the same machine
const config = {
  user: "EditorUser",
  password: "Editor123",
  server: "localhost\\MSSQLSERVER1",
  database: "FishManager",
  options: {
    trustedConnection: false,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};
// if you would like to use the non-default port
//port:  61578

// This was Helen's config when she got the server
// working on azure (paid cloud provider)
/*
AZURE_SQL_SERVER="bixie.database.windows.net";
AZURE_SQL_DATABASE="bixi";
AZURE_SQL_PORT=1433;
AZURE_SQL_USER="hkatalifos@bixie";
AZURE_SQL_PASSWORD="EfHdUdq5B!XdTrD";

const server = AZURE_SQL_SERVER;
const database = AZURE_SQL_DATABASE;
const port = parseInt(AZURE_SQL_PORT);
const user = AZURE_SQL_USER;
const password = AZURE_SQL_PASSWORD;

const config = { user: AZURE_SQL_USER,
  password: AZURE_SQL_PASSWORD,
  server: AZURE_SQL_SERVER, 
  database: 'bixi',
  options: {
    encrypt: true,
    trustedconnection:  true,
      enableArithAbort:  true,
      trustServerCertificate: true,
      instancename:  "SQLSRV\\SQLEXPRESS"  // SQL Server instance name
    },
};
*/

module.exports = config;
