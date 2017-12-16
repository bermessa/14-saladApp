// Sets up Node
//==============================
var express = require("express");
var app = express();
var port = 8080;

// Sets up the Express app to handle data parsing
//==============================
var bodyParser = require("body-parser");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

// Sets up Express Engine Handlebars
//==============================
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Sets up MySQL
//==============================
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "salad_db"
});

connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("connected as id " + connection.threadId);
});

// Sets up routes
//==============================

app.get("/", function(req, res) {
    connection.query("SELECT * FROM salads;", function(err, data) {
        if (err) throw err;

        res.render("index", { salad: data });

    });
});

app.post("/", function(req, res) {

    connection.query("INSERT INTO salads (topping) VALUES (?)", [req.body.newTopping], function(err, result) {
        if (err) throw err;

        res.redirect("/");
    });
});

app.put("/:id", function(req, res) {
    connection.query("UPDATE salads SET devoured = true WHERE id = ?", [req.params.id], function(err, result) {

        if (err) {
            // If an error occurred, send a generic server faliure
            return res.status(500).end();
        }
        else if (result.changedRows == 0) {
            // If no rows were changed, then the ID must not exist, so 404
            return res.status(404).end();
        }
        else {
            res.status(200).end();
        }
    });
});

app.listen(port);
