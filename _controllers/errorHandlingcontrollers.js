exports.handle404noPaths = (req, res, next) => {
    res.status(404).send({msg: "Not found! :'( "})
}

exports.handleCustomErrors = (err, req, res, next) =>{
    if (err.status && err.msg) {
        console.log(err, "<<< custom error")
        res.status(err.status).send({"msg": err.msg})
    } else if ( err.code === '22P02') {
        res.status(400).send({msg: 'Invalid Input: bad request'})
    } else {
        next(err)
    }
}

exports.handle500s = (err,req,res,next) => {
    console.log(err, "<<< 500 error message")
    res.status(500).send("internal server error")
};

// not an id/bad request