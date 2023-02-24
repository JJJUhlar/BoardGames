const db = require('../db/connection')

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
            // console.log(">>> selected reviews >>>", rows)
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

exports.selectReviewByID = (id, comment_count) => {
    if (comment_count && !['true','false'].includes(comment_count)) {
        return Promise.reject({status: 400, msg: 'Invalid Input: Bad Query'})
        
    }

    let dbQuery = ``
    if (comment_count === 'true') {
        dbQuery =   `
                    SELECT reviews.review_id, reviews.title, reviews.review_body, reviews.designer, reviews.review_img_url, reviews.votes, reviews.category, reviews.owner, reviews.created_at, COUNT(comments.body) AS comment_count
                    FROM reviews
                    LEFT JOIN comments
                    ON reviews.review_id = comments.review_id
                    WHERE reviews.review_id = $1
                    GROUP BY reviews.review_id;
                    `;
    } else {
        dbQuery = `
                        SELECT review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at
                        FROM reviews
                        WHERE review_id = $1;
                        `;
    }

    return db.query(dbQuery, [id])
    .then(({rows}) => {
        console.log(rows, "<<< should be reviews by id")
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