// File: store.js

(function() {

    var items = [];
    var seconds = 1000;
    var handle = null;

    var https = require("https");

    require("dotenv").config();

    function fetch() {
        var options = {
            "hostname": "api.github.com",
            "port": 443,
            "path": "/repos/assertchris/fetching-javascript/issues",
            "method": "GET",
            "headers": {
                "Accept": "application/vnd.github.squirrel-girl-preview",
                "User-Agent": "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)",
                "Authorization": "token " + process.env.GITHUB_TOKEN
            }
        };

        var issueReq = https.request(options, function(issueRes) {
            var text = "";

            issueRes.on("data", function(data) {
                text += data.toString("utf-8");
            });

            issueRes.on("end", function() {
                var parsed = JSON.parse(text);

                if (!parsed.map) {
                    return;
                }

                items = parsed.map(function(item) {
                    return {
                        "title": item.title,
                        "reactions": item.reactions
                    }
                });

                start();
            });
        });

        issueReq.end();
    }

    function start(interval) {
        if (interval) {
            seconds = interval;
        }

        handle = setTimeout(fetch, seconds);
    }

    function stop() {
        clearTimeout(handle);
    }

    module.exports = {
        "items": function() { return items; },
        "start": start,
        "stop": stop
    };

})();
