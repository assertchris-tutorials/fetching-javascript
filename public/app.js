// File: public/app.js

var $container = $(".container");

var seconds = 1000;
var username = "assertchris";
var password = "+bjz6oUyvj9qCd";

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
                <td>
                    <a class="ignore" data-issue="${items[i].id}">ignore</a>
                    ${items[i].title}
                </td>
            </tr>`)
        );
    }

    $container.append($table.append($tbody));
}

$container.on("click", ".ignore", function(e) {
    e.preventDefault();

    var $link = $(this);

    $.ajax({
        "url": "http://127.0.0.1:3000/issues/ignore",
        "method": "POST",
        "username": username,
        "password": password,
        "data": {
            "issue": $link.data("issue")
        },
        "success": function() {
            $link.parent().remove();
        }
    });
})

function fetch() {
    $.ajax({
        "url": "http://127.0.0.1:3000/issues",
        "method": "GET",
        "username": username,
        "password": password,
        "success": render,
        "complete": function() {
            setTimeout(fetch, seconds);
        }
    });
}

fetch();
