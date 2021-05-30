const express  = require("express")
const { resource, route } = require("../app")
const db = require("../db")
const ExpressError = require("../expressError")

const router = express.Router()



router.get("/",async (req,res,next)=>{
    try{
        const response = await db.query(`SELECT * FROM invoices`)
        return res.status(200).json({invoices:response.rows})
    }catch(e){
        return next(e)
    }
})

router.get("/:id",async(req,res,next)=>{
    try{
        const id = req.params.id
        const response = await db.query(`
        SELECT 
        i.id,
        i.amt,
        i.paid,
        i.add_date,
        i.paid_date,
        c.code,
        c.name,
        c.description FROM invoices i JOIN companies c ON i.comp_code = c.code`)
        if(response.rows.length === 0 ) throw new ExpressError("Invoice not found",404)
        const rows = response.rows[0]
        return res.status(200).json({invoice:{
            id:rows.id,
            amt: rows.amt,
            paid:rows.paid,
            add_date:rows.add_date,
            company:{
                code:rows.code,
                name:rows.name,
                description:rows.description
            }
        }})
    }catch(e){
        return next(e)
    }
})

router.post("/",async (req,res,next)=>{
    try{
        const {comp_code, amt, paid, paid_date} = req.body
        console.log(comp_code,amt,paid,paid_date)
        const response = await db.query(
        `INSERT INTO invoices 
        (comp_code,amt,paid,paid_date)
        VALUES
        ($1,$2,$3,$4) RETURNING *`,[comp_code, amt, paid, paid_date])
        return res.status(201).json({invoice:response.rows[0]})
    }catch(e){
        return next(e)
    }
})


router.put("/:id",async (req,res,next)=>{
    try{
        const id = req.params.id
        const {amt,paid} = req.body
        let paid_date = null

        const currInvoice = await db.query(`SELECT * FROM invoices WHERE id=$1`,[id])
        if (currInvoice.rows.length === 0) throw new ExpressError("Invoice Not Found",404)
        const currentInvoice = currInvoice.rows[0]

        if(!currentInvoice.paid_date && paid){
            paid_date = new Date()
        }else if (!paid){
            paid_data = null
        }else{
            paid_date = currentInvoice.paid_date
        }

        const response = await db.query(`UPDATE invoices SET amt=$1,paid=$2,paid_date=$3 WHERE id=$4 RETURNING *`,[amt,paid,paid_date,id])
        return res.status(200).json({invoice:response.rows[0]})
    }catch(e){
        return next(e)
    }
})


router.delete("/:id",async (req,res,next)=>{
    try{
        const id = req.params.id
        const response = await db.query(`DELETE FROM invoices WHERE id=$1 RETURNING *`,[id])
        console.log(response)
        if( response.rows.length === 0) throw new ExpressError("Invoice Not Found",404)
        return res.status(200).json({status:"deleted"})
    }catch(e){
        return next(e)
    }
})


module.exports = router
