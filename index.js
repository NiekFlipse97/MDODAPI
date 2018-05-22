const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const Errors = require('./models/Errors');
const api = require('./routes/api');
const expressJWT = require('express-jwt');
const dbc = require('./db/databaseConnector');
const app = express();

// Returns middleware that only parses urlencode bodies.
app.use(bodyParser.urlencoded({
    extended: true
}));

// Returns middleware that only parses json,
// and only looks at requests where the Content-Type header matches the type option.
app.use(bodyParser.json({
    type: "application/json"
}));

// Require authentication for every request,
// unless the path is specified below.
app.use(expressJWT({
    secret: config.secretKey
}).unless({
    path: ['/api/login', '/api/register']
}));

// Route to /api
app.use("/api", api);

// This endpoint will be accessed when no routes match with the users url.
app.all('*', (req, res) => {
    const error = Errors.notFound();
    res.status(error.code).json(error);
});

// process.env.PORT specifies the port that Heroku set for the api. Else config.port is used.
const port = process.env.PORT || config.port;
app.listen(port, () => {
    console.log(`Listening on port:${port}...`);
});

module.exports = app;