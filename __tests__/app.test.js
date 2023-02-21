const app = require('../app')
const db = require('../db/connection')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data')


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
        console.log(">>> /api/categories tests <<<")
        
        test('endpoint has 200 status', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
        })
        test('returns an array of category objects', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(({body}) => {
                    const {categories} = body;

                    expect(Array.isArray(categories)).toBe(true)
                })
        })
        test('category objects have slug, description properties', () => {
            return request(app)
                .get('/api/categories')
                .expect(200)
                .then(({body}) => {
                    const {categories} = body;
                    categories.forEach((category)=>{
                        expect(Object.keys(category).length).toBe(2)

                        expect(category).toHaveProperty('slug', expect.any(String))
                        expect(category).toHaveProperty('description', expect.any(String))
                    })
                })
        })
    })

    describe('GET: /api/reviews', () => {
        test('endpoint status 200', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
        })
        test('returns an array', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({reviews})=>{
                    expect(Array.isArray(reviews)).toBe(true)
                })
        })
        test('returns an array of review objects', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({reviews})=>{
                    expect(Object.prototype.toString.call(reviews[0])).toBe('[object Object')
                })
        })
        test('should have 9 length', () => {
            return request(app)
                .get('/api/reviews')
                .expect(200)
                .then(({reviews})=>{
                    expect(Object.keys(reviews).length).toBe(9)
                })
        })
        test('objects should have correct properties', () => {
            return request(app)
                .get("/api/reviews")
                .expect(200)
                .then(({reviews})=>{
                    reviews.forEach(review => {
                        expect(review).hasOwnProperty("owner", expect.any(String))
                        expect(review).hasOwnProperty("title", expect.any(String))
                        expect(review).hasOwnProperty("review_id", expect.any(Number))
                        expect(review).hasOwnProperty("category", expect.any(String))
                        expect(review).hasOwnProperty("review_img_url", expect.any(String))
                        expect(review).hasOwnProperty("created_at", expect.any(Number))
                        expect(review).hasOwnProperty("votes", expect.any(Number))
                        expect(review).hasOwnProperty("designer", expect.any(String))
                        expect(review).hasOwnProperty("comment_count", expect.any(Number))
                    });
                })
        })
        test.todo('return objects should be sorted by date in descending order')
    })

    describe('errors', () => {
        console.log(">>> error handling tests <<<")

        test('responds 404 to non existent endpoint', () => {
            return request(app)
                .get('/api/notanexistingendpoint')
                .expect(404)
        })
        test('repsonds with an appropriate error message', () => {
            return request(app)
                .get('/api/notanexistingendpoint')
                .expect(404)
                .then(({body}) => {
                    console.log(body.msg)
                    console.log(body, "<<<<<")
                    expect(body.msg).toBe('Not Found')
                })
        })
    })
})