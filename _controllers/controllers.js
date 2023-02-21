
const {selectCategories} = require('../_models/models')

exports.getCategories = (request, response, next) => {
    return selectCategories()
        .then((categories) => {
            response.status(200).send({"categories":categories})
        })
        .catch((error)=>{
            response.send(error)
        })
}

exports.getReviews = (req,res,next) => {
    return db.query(`   SELECT * FROM reviews
                        ORDER BY created_at
                        RETURNING *;`)
        .then(({rows})=>{
            console.log(">>> reviews >>>", rows)
            return rows
        })
        .then((reviews)=>{
            res.status(200).send({"reviews": reviews})
        })
        .catch((err)=>{
            next(err);
        })
        
}