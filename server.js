// File: server.js

var express = require("express");
var app = express();

var consolidate = require("consolidate");
app.engine("html", consolidate.nunjucks);

app.set("views", __dirname + "/views");
app.set("view engine", "html");

app.use(express.static(__dirname + "/public"));

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
    "extended": true
}));

var basicAuth = require("basic-auth");

var auth = function (req, res, next) {
    function unauthorized(res) {
        res.set("WWW-Authenticate", "Basic realm=Authorization Required");
        return res.sendStatus(401);
    };

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };

    if (user.name !== "assertchris" && user.pass !== "+bjz6oUyvj9qCd") {
        return unauthorized(res);
    }

    return next();
};

app.get("/", function (req, res) {
    res.render("index");
});

var store = require("./store.js");

app.get("/issues", auth, function (req, res) {
    res.json(store.items());
});

app.post("/issues/ignore", auth, function (req, res) {
    store.ignore(req.body.issue);

    res.json({});
});

app.listen(3000, function () {
    store.start();

    console.log("Application running at http://127.0.0.1:3000");
});
