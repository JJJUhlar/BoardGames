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
        test('GET 200 /api/reviews accepts a category query, sort_by query, and order_query', () => {
            return request(app)
                .get('/api/reviews?category=social+deduction&sort_by=title&order=ASC')
                .expect(200)
                .then(({body})=>{
                    const reviews = body.reviews;

                    expect(Array.isArray(reviews)).toBe(true)
                    expect(Object.prototype.toString.call(reviews[0])).toBe('[object Object]')

                    // expect(reviews).toBeSortedBy('title', {descending: false})

                    reviews.forEach((review) => {
                        expect(review.category).toBe('social deduction')
                    })
                })
        })
        test('GET 200: /api/reviews?category=social+deduction query defaults to sort by date and order descending if not specified', () => {
            return request(app)
                .get('/api/reviews?category=dexterity')
                .expect(200)
                .then(({body})=>{
                    const reviews = body.reviews;

                    // expect(reviews).toBeSortedBy('created_at', {descending: true})
                })
        })
        test('GET 200: /api/reviews?query responds with an empty array of articles for a valid query with no reviews', () => {
            return request(app)
                .get("/api/reviews?category=children's+games")
                .expect(200)
                .then(({body})=>{
                    const reviews = body.reviews;
                    expect(reviews).toEqual([])
                })
                
        })

        test('GET 200: /api/reviews?badlyformedquery Ignores a bad query, and returns default get reviews request.', () => {
            return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({body})=>{
                expect(Array.isArray(body.reviews)).toBe(true)
                expect(Object.prototype.toString.call(body.reviews[0])).toBe('[object Object]')
                expect(Object.keys(body.reviews[0]).length).toBe(9)
            })
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
        
        
        test('GET: 200 /api/reviews/:review_id | returns 0 for comment count if there are no comments', () => {
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
                    const comments = body.comments;
                    
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
                    const comments = body.comments;
                    expect(Array.isArray(comments)).toBe(true)
                    expect(comments.length).toBe(0)
                })
        })
        test('GET: 200 /api/reviews/:review_id/comments | returns an empty array for an existing review_id with no comments', () => {
            return request(app)
                .get('/api/reviews/5/comments')
                .expect(200)
                .then(({body})=>{
                    const comments = body.comments;
                    expect(Array.isArray(comments)).toBe(true)
                    expect(comments.length).toBe(0)
                })
        })
    })

    describe('PATCH 202 /api/reviews/:review_id', () => {
        test('increments votes for a review by a given amount ', () => {
            const testPatch = {
                "inc_votes": 5 
            }

            return request(app)
                .patch('/api/reviews/2')
                .send(testPatch)
                .expect(202)
                .then(({body}) => {
                    console.log(body.updatedReview, "<<< should have returned updated review")
                    expect(body.updatedReview.votes).toBe(10)

                    expect(Object.prototype.toString.call(body.updatedReview)).toBe('[object Object]')

                    expect(Object.keys(body.updatedReview).length).toBe(9)
                    expect

                    expect(body.updatedReview).toHaveProperty('review_id',2)
                    expect(body.updatedReview).toHaveProperty('title',expect.any(String))
                    expect(body.updatedReview).toHaveProperty('category',expect.any(String))
                    expect(body.updatedReview).toHaveProperty('designer',expect.any(String))
                    expect(body.updatedReview).toHaveProperty('owner',expect.any(String))
                    expect(body.updatedReview).toHaveProperty('review_body',expect.any(String))
                    expect(body.updatedReview).toHaveProperty('review_img_url',expect.any(String))
                    expect(body.updatedReview).toHaveProperty('created_at',expect.any(String))
                    
                })
        })
        test('decrements votes for a review by a specified amount', () => {
            const testPatch = {
                "inc_votes": -5 
            }

            return request(app)
                .patch('/api/reviews/9')
                .send(testPatch)
                .expect(202)
                .then(({body}) => {
                    expect(body.updatedReview.votes).toBe(5)
                })
        })
        test('ignores unncessary properties', () => {
            const testPatch = {
                "inc_votes": 9,
                "Extra property 1": "asldkjad",
                "Extra property 2": [12,3,,4,5,,6] 
            }

            return request(app)
                .patch('/api/reviews/1')
                .send(testPatch)
                .expect(202)
                .then(({body}) => {
                    expect(body.updatedReview.votes).toBe(10)
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
                .expect(201) 
                .then(({body})=>{
                 
                    const post = body.comment;

                    

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
                .expect(201) 
                .then(({body})=>{
                    const post = body.comment;
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
    })

    describe('GET /api', () => {
        test('GET: 200 /api responds with json of all available endpoints', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .expect('Content-Type', /json/)
                .then(({body}) => {
                    
                    const endpoints = JSON.parse(body.endpoints)
                
                    

                    expect(endpoints).toHaveProperty("GET /api")
                    expect(endpoints).toHaveProperty("GET /api/reviews")
                    expect(endpoints).toHaveProperty("GET /api/reviews/:review_id")
                    expect(endpoints).toHaveProperty("GET /api/reviews/:review_id/comments")
                    expect(endpoints).toHaveProperty("POST /api/reviews/:review_id/comments")
                    expect(endpoints).toHaveProperty("DELETE /api/comments/:comment_id")
                    expect(endpoints).toHaveProperty("GET /api/users")
                    expect(endpoints).toHaveProperty("PATCH /api/reviews/:review_id")

                })
        })
    })
    
    describe('DELETE /api/comments/:comment_id', () => {
        test('DELETE: 204 /api/comments/:comment_id deletes a comment given an id', () => {
            return request(app)
                .delete('/api/comments/1')
                .expect(204)
                .then((data)=>{
                    expect(data.res.statusMessage).toBe('No Content')
                })
        })
    })

          

    describe('Errors', () => {
        test('responds 404 to non existent path', () => {
            return request(app)
                .get('/api/notanexistingendpoint')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Not found! :'( ")
            })
        })

        test('GET: 404 /api/reviews? returns not found if category does not exist', () => {
            return request(app)
                .get("/api/reviews?category=pirates")
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe("No reviews found for this category: pirates")
                })
            })

        test('GET: 400 /api/reviews? errors if sort query is badly formed', () => {
            return request(app)
                .get('/api/reviews?category=dexterity&sort_by=[object Object]')
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request: Invalid sort query')
                })
            })
        test('GET: 400 /api/reviews? errors if order query is badly formed', () => {
            return request(app)
                .get('/api/reviews?category=dexterity&order=[object Object]')
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Bad Request: Invalid order query')
                })
            })



        test('responds 400 for bad review_id', () =>{
            return request(app)
                .get('/api/reviews/notanid')
                .expect(400)
                .then(({body})=>{

                    expect(body.msg).toBe('Invalid Input: bad request')
                    expect(body.msg).toBe('Invalid Input: bad request')
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
                    expect(body.msg).toBe('Invalid Input: bad request')
                    expect(body.msg).toBe('Invalid Input: bad request')
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
        
        test('PATCH: 404 /api/reviews/:non_existant_review_id | errors for a well_formed for but non-existant review', () => {
            const testPatch = {
                "inc_votes": -5 
            }

            return request(app)
                .patch('/api/reviews/99999')
                .send(testPatch)
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('No review found for this ID: 99999')
                })
        })
        test('PATCH: 400 /api/reviews/:not_a_valid_review_id | errors for a valid patch, but to a bad path', () => {
            const testPatch = {
                "inc_votes": -5 
            }

            return request(app)
                .patch('/api/reviews/not_a_valid_path')
                .send(testPatch)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid Input: bad request')
                })
        })
        test('PATCH: 400 /api/reviews/:review_id | errors for a malformed patch request to a valid review_id', () => {
            const testPatch = {
                "inc_votes": "What happens if I'm *not* an integer!" 
            }

            return request(app)
                .patch('/api/reviews/1')
                .send(testPatch)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid Input: bad request')
                })
        })
        test('PATCH: 400 /api/reviews/:review_id | errors for a well formed request but missing necessary properties', () => {
            const testPatch = {
                "not inc votes": "I should break your test" 
            }

            return request(app)
                .patch('/api/reviews/1')
                .send(testPatch)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid Input: missing inc_votes')
                })
        })
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
                    expect(body.msg).toBe('Invalid Input: bad request')
                    expect(body.msg).toBe('Invalid Input: bad request')
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

        test('DELETE: 404 /api/comments/:comment_id 404 errors if a comment does not exist', () => {
            return request(app)
                .delete('/api/comments/99999')
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('No comment found for this id: 99999')
                })
        })

        test('DELETE: 400 /api/comments/badRequest errors if a bad comment id is passed', () =>{
            return request(app)
                .delete('/api/comments/undefinedNaN[object Object]')
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe('Invalid Input: bad request')
                })
        })
    })
})