const express = require('express')
const db = require('./db/connection')
// require controllers
const {getCategories} = require('./_controllers/controllers')


const app = express()
// add app.use json here

app.get("/api/categories", getCategories)

// end points here to come


// error handlers
app.use((err,request,response,next) => {
    console.log(err, "Caught an error")
    if(err.status === 404) {
        response.status(404).send({msg: "not found"})
    } else {
        response.status(err.status).send({msg: err.status})
    }    
})



module.exports = app;