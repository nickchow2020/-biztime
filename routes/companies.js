const express = require("express")
const db = require("../db")
const ExpressError = require("../expressError")
const slugify = require('slugify')

const router = express.Router()

router.get("/",async (req,res,next)=>{
    try{
        const result = await db.query(`SELECT code,name FROM companies`)
        res.status(200).json({companies:result.rows})
    }catch(e){
        return next(e)
    }
})

router.get("/:code",async (req,res,next)=>{
    try{
        const code = req.params.code
        const _industry = await db.query(
            `SELECT c.name,i.industry FROM companies AS c LEFT JOIN comp_industry AS ci ON ci.comp_code = c.code LEFT JOIN industries AS i ON i.code = ci.industry WHERE c.code=$1`,[code]
        )

        const {industry} = _industry.rows[0];
        const result = await db.query(
            `SELECT 
            c.code,
            c.name,
            c.description,
            i.id,
            i.amt,
            i.paid,
            i.add_date,
            i.paid_date FROM companies c JOIN invoices i ON c.code = i.comp_code WHERE code=$1`,[code])
        if(result.rows.length === 0) throw new ExpressError("Company Id Not Found",404)
        const data = result.rows[0]
        res.status(200).json({company:{
            code:data.code,
            name:data.name,
            industry:industry,
            description:data.description,
            invoices:{
                id:data.id,
                amt:data.amt,
                paid:data.paid,
                add_date:data.add_date,
                paid_data:data.paid_data
            }
        }})
    }catch(e){
        return next(e)
    }
})


router.post("/",async (req,res,next)=>{
    try{
        const {code,name,description} = req.body
        const _code = slugify(code,{lower:true})
        const response = await db.query(`INSERT INTO companies VALUES ($1,$2,$3) RETURNING *`,[_code,name,description])
        return res.status(201).json({company:response.rows[0]})
    }catch(e){
        return next(e)
    }
})

router.put("/:code",async (req,res,next)=>{
    try{
        const code = req.params.code
        const {name,description} = req.body
        const response = await db.query(`UPDATE companies SET name=$1,description=$2 WHERE code =$3 RETURNING *`,[name,description,code])
        if(response.rows.length === 0) throw new ExpressError("Company Not Found",404)
        return res.status(201).json({company:response.rows[0]})
    }catch(e){
        return next(e)
    }
})


router.delete("/:code",async (req,res,next)=>{
    try{
        const code  = req.params.code
        const response = await db.query(`DELETE FROM companies WHERE code=$1 RETURNING *`,[code])
        if(response.rows.length === 0) throw new ExpressError("Company Not Found",404)
        return res.status(200).json({Status:"deleted"})
    }catch(e){
        return next(e)
    }
})



module.exports = router