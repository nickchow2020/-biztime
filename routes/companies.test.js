process.env.NODE_ENV = "test"
const request = require("supertest")
const app = require("../app")
const db = require("../db")

let companies;

beforeEach(async ()=>{
    const response = await db.query(
        `INSERT INTO companies VALUES ('QQ','Tencent','Tencent_game_good') RETURNING code,name`)
        companies = response.rows[0]
})

afterEach(async function(){
    await db.query(`DELETE FROM companies`)
})

afterAll(async function(){
    await db.end()
})

describe("GET / companies",function(){
    test("Testing /GET companies",async function(){
        const response = await request(app).get("/companies")

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({companies:[{ code: 'QQ', name: 'Tencent' }]})
    })
})

describe("GET /:id companies",function(){
    test("Testing GET Company with code",async function(){
        const response = await request(app).get("/companies/QQ")
        expect(response.statusCode).toBe(404)
    })
})