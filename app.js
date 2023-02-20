const express = require('express')
const db = require('./db/connection')
// require controllers
const {getCategories} = require('./_controllers/controllers')
const {handle404s, handle500s} = require('./_controllers/errorHandlingcontrollers')

const app = express()
// add app.use json here

app.use(express.json())

app.get("/api/categories", getCategories)

// end points here to come


// error handlers
app.use(handle404s);

app.use(handle500s);


module.exports = app;