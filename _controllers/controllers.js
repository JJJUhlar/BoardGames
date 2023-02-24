const {
    selectUsers,
    selectCategories,
    selectReviewsWithComCounts,
    selectReviewByID,
    selectReviewCommentsByID,
    checkReviewExists,
    insertCommentToReviewByID,
    checkUserExists,
    deleteSelectedComment
} = require('../_models/models')

exports.getCategories = (request, response, next) => {
    return selectCategories()
        .then((categories) => {
            response.status(200).send({"categories": categories})
        })
        .catch((error)=>{
            next(error)
        })
}

exports.getReviews = (req,res,next) => {
    return selectReviewsWithComCounts()
        .then((reviews)=>{
            res.status(200).send({"reviews": reviews})
        })
        .catch((err)=>{
            next(err);
        })
}

exports.getReviewByID = (req, res, next) => {
    const { review_id } = req.params;

    return selectReviewByID(review_id)
        .then((result)=>{
            if (result.comment_count) {
                result.comment_count = Number(result.comment_count)
            }
            res.status(200).send({"review": result});
        })
        .catch((err)=>{
            next(err);
        })
}

exports.getReviewCommentsByID = (req,res,next) => {
    const { review_id } = req.params;
    const id_check_promise = checkReviewExists(review_id)
    const review_comments_promise = selectReviewCommentsByID(review_id)

    Promise.all([review_comments_promise, id_check_promise])
        .then((result) => {
            res.status(200).send({"reviewComments": result[0]})
        })
        .catch((err)=>{
            next(err);
        })
}

exports.postCommentToReviewByID = (req,res,next) => {
    const { review_id } = req.params
    const { username, body } = req.body

    if (username === undefined | body === undefined) {
        next({status: 400, msg: "Invalid Input: missing values"})
    }

    const check_user_exists_promise = checkUserExists(username)
    const review_id_check_promise = checkReviewExists(review_id)
    const insert_post_promise = insertCommentToReviewByID(review_id, username, body)

    Promise.all([insert_post_promise, review_id_check_promise, check_user_exists_promise])
        .then((result) => {
            res.status(201).send({"postedComment": result[0]})
        })
        .catch((err)=>{
            next(err)
        })   
}

exports.getUsers = (req,res,next) => {
    return selectUsers()
        .then((usersList)=>{
            res.status(200).send({"users": usersList})
        })
        .catch((err)=>{
            next(err)
        })
}

exports.getEndPoints = (req,res,next) => {
    const endpoints =  {
        "GET": "/api/categories",
        "GET": "/api/reviews",
        "GET": "/api/reviews/:review_id",
        "GET": "/api/reviews/:review_id/comments",
        "POST": "/api/reviews/:review_id/comments",
        "DELETE": "/api/comments/:comment_id",
        "PATCH": "/api/reviews/:review_id",
        "GET": "/api/users"
    }
    res.status(200).json(endpoints)
} 

exports.deleteComment = (req,res,next) => {
    const { comment_id } = req.params

    return deleteSelectedComment(comment_id)
        .then(()=>{
            res.status(204).send()
        })
        .catch((err)=>{
            next(err)
        })
}