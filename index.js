const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
var mysql = require("mysql");

app.use(express.static("public"));

//För postman
let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({ secret: "my-secret", resave: false, saveUninitialized: true })
);

//Databas connection
var connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "bobby",
  password: "bobby",
  database: "express_demo",
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

//Letar efter statiska filer i public mappen
app.use(express.static("public"));

//Default port 3000
app.get("/", (req, res) => {
  res.send("Hello World! TEST TEST");
});

//Protected

//Logged-in
app.get("/logged-in", (req, res) => {
  if (req.session.authenticated) {
    res.sendFile(__dirname + "/views/logged-in.html");
  } else {
    res.redirect("/login");
  }
});

//Skapar en route till INDEX.HTML
app.get("/random", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

//API
app.get("/api/getuser", (req, res) => {
  res.json('{"name": "Dany"}')
});

//Lyssnar
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//Post
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log(email);
  // console.log(password);

  connection.query(
    `SELECT * FROM users WHERE email ='${email}' AND password='${password}'`,
    function (error, results, fields) {
      if (error) throw error;

      if (results.length > 0) {
        // res.send("Found " + results.length + "users");
        req.session.authenticated = true;
        res.redirect("/logged-in");
      } else {
        res.send("Found no users");
      }
      console.log(results);
    }
  );
});

//GET (ROUTE TILL LOGIN.HTML)
app.get("/login", (req, res) => {
  console.log(req.body);
  res.sendFile(__dirname + "/views/login.html");
});
