exports.handle404noPaths = (req, res, next) => {
    res.status(404).send({msg: "Not found! :'( "})
}

exports.handleCustomErrors = (err, req, res, next) =>{
    console.log(err, "<<<<<<<<<<<<<<<<<<,")
    if (err.status && err.msg) {
        res.status(err.status).send({"msg": err.msg})
    } else if ( err.code === '22P02') {
        res.status(400).send({msg: 'Invalid Input: bad request'})
    } else if (err.code === '22003') {
        res.status(404).send({msg: `No review found with this id`})
    } else {
        next(err)
    }
}

exports.handle500s = (err,req,res,next) => {
    res.status(500).send("internal server error")
};

