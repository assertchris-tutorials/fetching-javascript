// File: server.js

var express = require("express");
var app = express();

var consolidate = require("consolidate");
app.engine("html", consolidate.nunjucks);

app.set("views", __dirname + "/views");
app.set("view engine", "html");

app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
    res.render("index");
});

var store = require("./store.js");

app.get("/issues", function (req, res) {
    res.json(store.items());
});

app.listen(3000, function () {
    store.start();

    console.log("Application running at http://127.0.0.1:3000");
});
