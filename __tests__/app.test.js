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