// run: npm install express ejs

var express = require("express");

var app = express();
app.use(express.static("public"));

var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.set("view engine", "ejs");
app.set("views", "./views");

app.listen(3000);

const YOUR_ZENDESK_EMAIL = '110115021@sv.tvu.edu.vn';
const YOUR_ZENDESK_URL = 'https://hongkim.zendesk.com';
const YOUR_ZENDESK_API_TOKEN = '9db6gA9PyX8kmoThYWdCrQZgBJKDAE0g2e7NNAjV';

// install package: npm install zendesk-node-api
const Zendesk = require('zendesk-node-api');

const zendesk = new Zendesk({
    url: YOUR_ZENDESK_URL,
    email: YOUR_ZENDESK_EMAIL,
    token: YOUR_ZENDESK_API_TOKEN
});

async function getDetail(id) {
    return await zendesk.tickets.show(id);
}

async function getList(filter) {
    return await zendesk.tickets.list(filter);
}

async function createTicket(ticket) {
    return await zendesk.tickets.create(ticket).catch(function (err) {
        console.log(err);
    });
}

async function updateTicket(id, ticket) {
    return await zendesk.tickets.update(id, ticket).catch(function (err) {
        console.log(err);
    });
}

app.get("/", function (request, response) {
    response.render("home");
});

app.get("/detail/:id", function (request, response) {
    getDetail(request.params.id).then(function (data) {
        console.log(data);
        response.status(200).json(data);
    });
});

app.post('/create', urlencodedParser, function (request, response) {
    const ticket = {
        subject: request.body.subject,
        comment: {
            body: request.body.description
        }
    };

    createTicket(ticket).then(function (data) {
        console.log(data);
        response.status(200).json(data);
    });
});

app.post("/update/:id", urlencodedParser, function (request, response) {
    const ticket = {
        subject: request.body.subject,
        comment: {
            body: request.body.description
        }
    };

    updateTicket(request.params.id, ticket).then(function (data) {
        console.log(data);
        response.status(200).json(data);
    });
});

app.get("/list", function (request, response) {
    getList('sort_by=status&sort_order=desc').then(function (data) {
        console.log(data);
        response.status(200).json(data);
    });
});

