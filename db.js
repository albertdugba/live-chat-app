const sql = require("mysql");
const connection = sql.createConnection({
  host: "localhost",
  user: "me",
  password: "secret",
  database: "chat_db",
});

connection.connect();

connection.query("SELECT 1 + 1 AS solution", function (error, results, fields) {
  if (error) throw error;
  console.log("The solution is: ", results[0].solution);
});

connection.end();

module.exports = connection;
