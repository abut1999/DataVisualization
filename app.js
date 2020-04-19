const router = require('./router')

const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');

require('dotenv').config();
const hostname = process.env.HOST;
const port = process.env.PORT;

async function createApp() {

    app.use(session({
        secret: 'AQ',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000
        },
    }));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    if (app.use != ('/')) {
        app.use('/', router);
    }

    app.listen(port, hostname, () => {
        console.log(`${hostname}:${port}`);
    });
}

async function main() {
    await createApp();
}

main();