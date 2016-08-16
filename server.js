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

var https = require("https");

app.get("/issues", function (req, res) {
    var options = {
        "hostname": "api.github.com",
        "port": 443,
        "path": "/repos/assertchris/functional/issues",
        "method": "GET",
        "headers": {
            "Accept": "application/vnd.github.squirrel-girl-preview",
            "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)"
        }
    };

    var issueReq = https.request(options, function(issueRes) {
        var text = "";

        issueRes.on("data", function(data) {
            text += data.toString("utf-8");
        });

        issueRes.on("end", function() {
            var data = JSON.parse(text);
            var items = [];

            for (var i = 0; i < data.length; i++) {
                items.push({
                    "title": data[i].title,
                    "reactions": data[i].reactions
                });
            }

            res.json(items);
        });
    });

    issueReq.end();
});

app.listen(3000, function () {
    console.log("Application running at http://127.0.0.1:3000");
});
