const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require("dotenv");
const cors = require("cors");
const _auth = require("./middlewares/__auth");

// routes 
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const four_oh_four = require("./utils/404");


const app = express();
dotenv.config();

app.use(logger('dev'));

// >> parse incoming requests of Content-Type: application/json
// this will allow the app parse JSON payloads in incoming API calls
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// >> if you would like to use CORS in your app, uncomment this line.
// app.use(cors());

// >> enable pre-flight requests for API calls. More security at the risk of developer dissatisfaction.
// uncomment the line below
// app.options("*", cors());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', _auth(), usersRouter);


/* This block must be kept below ALL of your routes */
// >> handle 404s
app.use("*", four_oh_four);

module.exports = app;