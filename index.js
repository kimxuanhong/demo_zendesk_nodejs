var express = require("express");

var app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(3000);


var zendesk = require('node-zendesk');

const email = '110115021@sv.tvu.edu.vn';
const zendeskSubdomain = 'https://hongkim.zendesk.com/api/v2';
const zendeskAdminToken = '9db6gA9PyX8kmoThYWdCrQZgBJKDAE0g2e7NNAjV';

var client = zendesk.createClient({
    username:  email,
    token:     zendeskAdminToken,
    remoteUri: zendeskSubdomain,

});


var ticket = {
    "ticket":
        {
            "subject":"My printer is on fire!",
            "comment": {
                "body": "The smoke is very colorful."
            }
        }
};

client.tickets.create(ticket,  function(err, req, result) {
    if (err) return handleError(err);
    //console.log(JSON.stringify(result, null, 2, true));
});

function handleError(err) {
    console.log(err);
    process.exit(-1);
}

client.tickets.list(function (err, statusList, body, responseList, resultList) {
    if (err) {
        console.log(err);
        return;
    }
    //console.log(JSON.stringify(body, null, 2, true));//will display all tickets
});

app.get("/", function(request, response)   {
    let body = client.tickets.list(function (err, statusList, body, responseList, resultList) {
        if (err) {
            console.log(err);
            return;
        }
        //console.log(JSON.stringify(body, null, 2, true));//will display all tickets
    });
    console.log(body)
    let render = response.render("home");
});

