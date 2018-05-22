const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const Errors = require('./models/Errors');
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

// Route to /api/v1/ The first version of the api
app.use('/api/v1', require('./routes/api_v1'));

// This endpoint will be accessed when no routes match with the users url.
app.all('*', (req, res) => {
    const error = Errors.notFound();
    res.status(error.code).json(error);
});

// process.env.PORT specifies the port that Heroku set for the api. Else config.port is used.
const port = process.env.PORT || config.port;
app.listen(port, () => {
    console.log(`The magic happens at localhost:${port}`);
});

module.exports = app;