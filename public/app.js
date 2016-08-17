// File: public/app.js

var $container = $(".container");

var seconds = 1000;

function render(items) {
    $container.empty();

    var $table = $("<table class='table' />");
    var $tbody = $("<tbody />");

    for (var i = 0; i < items.length; i++) {
        var className = "";
        var reactions = items[i].reactions;

        if (reactions["+1"] > reactions["-1"]) {
            className = "success";
        }

        if (reactions["+1"] < reactions["-1"]) {
            className = "danger";
        }

        $tbody.append(
            $(`<tr class="${className}">
                <td>${items[i].title}</td>
            </tr>`)
        );
    }

    $container.append($table.append($tbody));
}

function fetch() {
    $.ajax({
        "url": "http://127.0.0.1:3000/issues",
        "method": "GET",
        "success": render,
        "complete": function() {
            setTimeout(fetch, seconds);
        }
    });
}

fetch();
