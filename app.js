const express = require('express')
const db = require('./db/connection')
// require controllers


const app = express()
// add app.use json here

app.get("/api/categories", (request, response, next) => {
    return db.query('SELECT * FROM categories')
        .then(({rows}) => {
            console.log(rows)
            return rows
        })
        .then((categories) => {
            response.status(200).send({"categories":categories})
        })
        .catch((error)=>{
            next(error)
        })

})

// end points here to come


// error handlers
app.use((err,request,response,next) => {
    console.log("error >>>", err)
    next(err)
})


module.exports = app;