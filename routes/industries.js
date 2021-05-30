const express = require("express")
const { route } = require("../app")
const db = require("../db")
const expressError = require("../expressError")

const router = express.Router()

router.post("/",async (req,res,next)=>{
    try{
        const {code,industry} = req.body
        const response = await db.query(
            `INSERT INTO industries VALUES ($1,$2) RETURNING * `,[code,industry]
        )
        return res.status(201).json({industry:response.rows[0]})
    }catch(e){
        return next(e)
    }
})

router.get("/",async (req,res,next)=>{
    try{
        const response = await db.query(
            `SELECT * FROM comp_industry`
        )
        return res.status(200).json({industry:response.rows})
    }catch(e){
        return next(e)
    }
})

module.exports = router