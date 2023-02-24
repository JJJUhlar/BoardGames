const db = require('../db/connection')
const fs = require('fs/promises')

exports.selectCategories = () => { 
    return db.query('SELECT * FROM categories;')
        .then(({rows}) => {
            return rows
    })
}

exports.selectReviewsWithComCounts = () => {
    return db.query(`
                    SELECT reviews.review_id, reviews.owner, reviews.title, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer,  COUNT(comments.body) AS comment_count
                    FROM comments
                    RIGHT JOIN reviews
                    ON comments.review_id = reviews.review_id
                    GROUP BY reviews.review_id
                    ORDER BY reviews.created_at DESC;
                    `)
        .then(({rows})=>{
            rows.forEach((row)=>{
                row.comment_count = parseInt(row.comment_count)
            })
            return rows
        })
}

exports.checkReviewExists = (id) => {
   return db.query(`
                SELECT *
                FROM reviews
                WHERE review_id = $1;
                `, [id])
            .then(({rows})=>{
                const review = rows[0]
                if (!review) {
                    return Promise.reject({
                        status: 404,
                        msg: `No review found for this ID: ${id}`
                    })
                } else {
                    return id
                }
            })
}

exports.selectReviewCommentsByID = (id) => {
    return db.query(`
                    SELECT *
                    FROM comments
                    WHERE review_id = $1
                    ORDER BY created_at DESC;
                    `, [id])
        .then(({rows})=>{
            return rows
        })
    }

exports.selectReviewByID = (id) => {

    dbQuery =   `
                SELECT reviews.review_id, reviews.title, reviews.review_body, reviews.designer, reviews.review_img_url, reviews.votes, reviews.category, reviews.owner, reviews.created_at, COUNT(comments.body) AS comment_count
                FROM reviews
                LEFT JOIN comments
                ON reviews.review_id = comments.review_id
                WHERE reviews.review_id = $1
                GROUP BY reviews.review_id;
                `;

    return db.query(dbQuery, [id])
    .then(({rows}) => {
        return rows[0]
    })
}

exports.checkUserExists = (username) => {
    return db.query(`
                    SELECT *
                    FROM users
                    WHERE username = $1;
                    `, [username])
        .then(({rows})=> {
            const user = rows[0]
            if (!user) {
                return Promise.reject({
                    status: 404,
                    msg: `No user found with this name: ${username}`
                })
            } else {
                return user
            }
        })
}

exports.insertCommentToReviewByID = (review_id, username, body) => {
    return db.query(`
                    INSERT INTO comments
                        (body, review_id, author)
                    VALUES
                        ($1,$2,$3)
                    RETURNING *;
                    `, [body, review_id, username])
        .then(({rows})=>{
            return rows[0];
        })
}

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`)
        .then(({rows})=>{
            return rows
        })
}

exports.deleteSelectedComment = (comment_id) => {
    return db.query(`
                    DELETE FROM comments
                    WHERE comment_id = $1
                    RETURNING *;
                    `, [comment_id])
            .then(({rows, rowCount})=>{
                if (rowCount === 0) {
                    return Promise.reject({status: 404, msg: `No comment found for this id: ${comment_id}`})
                }
                return rows[0]
            })
}

exports.retrieveEndpoints = () =>{ 
    return fs.readFile('endpoints.json','utf-8')
        
}