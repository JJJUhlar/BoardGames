
const {selectCategories} = require('../_models/models')

exports.getCategories = (request, response, next) => {
    return selectCategories()
        .then((categories) => {
            response.status(200).send({"categories":categories})
        })
        .catch((error)=>{
            next(error)
        })
}