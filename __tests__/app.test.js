const app = require('../app')
const db = require('../db/connection')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')
const reviews = require('../db/data/test-data/reviews')

// supertest re-seed database between tests
beforeEach(()=>{
    return seed(data)
})

// stop jest from hanging
afterAll(()=>{
    return db.end()
})

describe('appTests', () => {
   

    describe('GET: /api/categories', () => {        
        test('GET: 200 /api/categories', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(({body}) => {
                    const {categories} = body;

                    expect(Array.isArray(categories)).toBe(true)

                    categories.forEach((category)=>{
                        expect(Object.keys(category).length).toBe(2)

                        expect(category).toHaveProperty('slug', expect.any(String));
                        expect(category).toHaveProperty('description', expect.any(String));
                    })
                })
        })
    })
    describe('GET: /api/reviews', () => {
        test('GET: 200 /api/reviews', () =>{
            return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({body})=>{
                        
                expect(Array.isArray(body.reviews)).toBe(true)
                expect(Object.prototype.toString.call(body.reviews[0])).toBe('[object Object]')
                expect(Object.keys(body.reviews[0]).length).toBe(9)
                body.reviews.forEach(review => {
                    expect(review).toHaveProperty("owner", expect.any(String))
                    expect(review).toHaveProperty("title", expect.any(String))
                    expect(review).toHaveProperty("review_id", expect.any(Number))
                    expect(review).toHaveProperty("category", expect.any(String))
                    expect(review).toHaveProperty("review_img_url", expect.any(String))
                    expect(review).toHaveProperty("created_at", expect.any(String))
                    expect(review).toHaveProperty("votes", expect.any(Number))
                    expect(review).toHaveProperty("designer", expect.any(String))
                    expect(review).toHaveProperty("comment_count", expect.any(Number))
                    })
                
                const reviewDates = body.reviews.map((review)=>{
                const date = review.created_at.substring(0,4) + review.created_at.substring(5,7) + review.created_at.substring(8,10)
            
                return parseInt(date,10)
                    });

                for (let i = 1; i < reviewDates.length; i++) {
                    expect(reviewDates[i - 1] >= reviewDates[i]).toBe(true)
                    }
                
                });
            })
    
        test('GET: 200 /api/reviews/:review_id', ()=>{
            return request(app)
                .get('/api/reviews/1')
                .expect(200)
                .then(({body})=>{
                    const review = body.review;
                    
                    expect(Object.prototype.toString.call(review)).toBe('[object Object]')

                    expect(Object.keys(review).length).toBe(10)
                    expect(review).toHaveProperty('review_id', expect.any(Number))
                    expect(review).toHaveProperty('title', expect.any(String))
                    expect(review).toHaveProperty('review_body', expect.any(String))
                    expect(review).toHaveProperty('designer', expect.any(String))
                    expect(review).toHaveProperty('review_img_url', expect.any(String))
                    expect(review).toHaveProperty('votes', expect.any(Number))
                    expect(review).toHaveProperty('category', expect.any(String))
                    expect(review).toHaveProperty('owner', expect.any(String))
                    expect(review).toHaveProperty('created_at', expect.any(String))
                })
        })


        
        test('GET: 200 /api/reviews/:review_id| Can use a query to get back comment counts for the given review', () => {
            return request(app)
                .get('/api/reviews/3')
                .expect(200)
                .then(({body}) => {
                    const review = body.review;
                    expect(review.comment_count).toBe(3)
                })
        })
        
        
        test('GET: 200 /api/reviews/:review_id?comment_count=true | returns 0 for comment count if there are no comments', () => {
            return request(app)
                .get('/api/reviews/1')
                .expect(200)
                .then(({body})=>{
                    const review = body.review;

                    expect(review.comment_count).toBe(0)
                })
        })

        test('GET: 200 /api/reviews/:review_id/comments', () => {
            return request(app)
                .get('/api/reviews/3/comments')
                .expect(200)
                .then(({body})=>{
                    const comments = body.reviewComments;
                    expect(Array.isArray(comments)).toBe(true)
                    expect(Object.prototype.toString.call(comments[0])).toBe('[object Object]');
    
                    comments.forEach((comment)=>{
                        expect(Object.keys(comment).length).toBe(6)
                        expect(comment).toHaveProperty('comment_id', expect.any(Number))
                        expect(comment).toHaveProperty('votes', expect.any(Number))
                        expect(comment).toHaveProperty('created_at', expect.any(String))
                        expect(comment).toHaveProperty('author', expect.any(String))
                        expect(comment).toHaveProperty('body', expect.any(String))
                        expect(comment).toHaveProperty('review_id', expect.any(Number))
                    })
                    // should return in descending order (most recent first)
                    for (let i = 1; i < comments.length; i++) {
                        expect(Date.parse(comments[i-1].created_at) > Date.parse(comments[i].created_at)).toBe(true)
                    }
                })
        })
        
        test('GET: 200 /api/reviews/:review_id/comments | returns an empty array for an existing review_id with no comments', () => {
            return request(app)
                .get('/api/reviews/5/comments')
                .expect(200)
                .then(({body})=>{
                    const comments = body.reviewComments;
                    expect(Array.isArray(comments)).toBe(true)
                    expect(comments.length).toBe(0)
                })
        })
    })

    describe('GET: 200 /api/users', () => {
        test('responds with an array of user objects', () => {
            return request(app)
                .get('/api/users')
                .expect(200)
                .then(({body})=>{
                    const users = body.users
                    expect(Array.isArray(users)).toBe(true)
                    expect(Object.prototype.toString.call(users[0])).toBe('[object Object]')

                    expect(users.length).toBe(4)

                    users.forEach((user) => {
                        expect(user).toHaveProperty('username', expect.any(String))
                        expect(user).toHaveProperty('name', expect.any(String))
                        expect(user).toHaveProperty('avatar_url', expect.any(String))
                    })
                })
        })
    })

    describe('POST /api/reviews/:review_id/comments', () => {
        test('POST: 201 correctly adds a comment to a review and returns the comment', () => {
            const body = {
                "username": 'bainesface',
                "body": 'I think this test game is amazing'
            }

            return request(app)
                .post('/api/reviews/1/comments')
                .send(body)
                .expect(201) // 'created'
                .then(({body})=>{
                    console.log(body.postedComment)
                    const post = body.postedComment;

                    expect(Object.prototype.toString.call(post)).toBe('[object Object]')
                    expect(Object.keys(post).length).toBe(6)
                    
                    expect(post).toHaveProperty("comment_id", expect.any(Number))
                    expect(post).toHaveProperty("body", expect.any(String))
                    expect(post).toHaveProperty("review_id", expect.any(Number))
                    expect(post).toHaveProperty("author", expect.any(String))
                    expect(post).toHaveProperty("votes", expect.any(Number))
                    expect(post).toHaveProperty("created_at", expect.any(String))

                    expect(post.author).toBe("bainesface")
                    expect(post.body).toBe("I think this test game is amazing")

                })
        })
        test('POST: 201 | ignores unnecessary properties', () => {
            const body = {
                "username": 'bainesface',
                "body": 'I think this test game is amazing',
                "unneccessary prop 1": "superfluous value",
                "unncessary prop 2": [1,2,3,4,5]
            }

            return request(app)
                .post('/api/reviews/1/comments')
                .send(body)
                .expect(201) // 'created'
                .then(({body})=>{
                    console.log(body.postedComment)
                    const post = body.postedComment;

                    expect(Object.prototype.toString.call(post)).toBe('[object Object]')
                    expect(Object.keys(post).length).toBe(6)
                    
                    expect(post).toHaveProperty("comment_id", expect.any(Number))
                    expect(post).toHaveProperty("body", expect.any(String))
                    expect(post).toHaveProperty("review_id", expect.any(Number))
                    expect(post).toHaveProperty("author", expect.any(String))
                    expect(post).toHaveProperty("votes", expect.any(Number))
                    expect(post).toHaveProperty("created_at", expect.any(String))

                    expect(post.author).toBe("bainesface")
                    expect(post.body).toBe("I think this test game is amazing")

                })
        })

        test.skip('DELETE: 204 /api/comments/:comment_id deletes a comment given an id', () => {
            return request(app)
                .delete('/api/comments/1')
                .expect(204)
                .then(({body})=>{
                    expect(body.msg).toBe('no content')
                })
        })
    })
    
    describe('errors', () => {
        test('responds 404 to non existent path', () => {
            return request(app)
                .get('/api/notanexistingendpoint')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Not found! :'( ")
                })
        })
        test('responds 400 for bad review_id', () =>{
            return request(app)
                .get('/api/reviews/notanid')
                .expect(400)
                .then(({body})=>{

                    expect(body.msg).toBe('Invalid Input: bad review ID')
                })
        })

        test('GET: 404 /api/reviews/:review_id/notaroute ', () => {
            return request(app)
                .get('/api/reviews/3/bananapancakes')
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe("Not found! :'( ")
                })
        })
        test('GET: 400 /api/reviews/:bad_review_id/comments', () => {
            return request(app)
                .get('/api/reviews/magicErrorThrowingCatapult/comments')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid Input: bad review ID')
                })
        })
        test('GET: 404 /api/reviews/:well_formed_but_non_existant_id/comments', () => {
            return request(app)
                .get('/api/reviews/99999990/comments')
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('No review found for this ID: 99999990')
                })
        })
            // /api/reviews/review_id/comments 
        test('POST: 404 /api/reviews/:review_id/comments Rejects a well formed post to an existing review however for a non-existant user.', () => {

            const testComment = {
                "username": "I do not exist",
                "body": "this game really tested me"
            }

            return request(app)
                .post('/api/reviews/1/comments')
                .send(testComment)
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('No user found with this name: I do not exist')
                })
        })

        test('POST: 404 /api/reviews/:non_existant_review_id/comments Rejects a valid post to a well formed but non existant route', () => {
            const testComment = {
                "username": 'bainesface',
                "body": 'I think this test game is amazing'
            }

            return request(app)
                .post('/api/reviews/99999999/comments')
                .send(testComment)
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('No review found for this ID: 99999999')
                })
        })

        test('POST: 400 Rejects a valid post, to a badly formed route', () => {
            const testComment = {
                "username": 'bainesface',
                "body": 'I think this test game is amazing'
            }

            return request(app)
                .post('/api/reviews/impossible_route/comments')
                .send(testComment)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid Input: bad review ID')
                })
        })
        test('POST: 400 errors when required properties are missing, to a correct path', () => {
            const testComment = {
                "I'm not a username": 'Neither am I',
                "And I'm not a body": 'I will break your test'
            }

            return request(app)
                .post('/api/reviews/1/comments')
                .send(testComment)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid Input: missing values')
                })
        })

        test.skip('DELETE: 404 /api/comments/:comment_id 404 errors if a comment does not exist', () => {
            return request(app)
                .delete('/api/comments/99999')
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('No comment found for this id: 99999')
                })
        })

        test.skip('DELETE: 400 /api/comments/badRequest errors if a bad comment id is passed', () =>{
            return request(app)
                .delete('/api/comments/undefinedNaN[object Object]')
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Invalid Input: bad request')
                })
        })

    })
})
