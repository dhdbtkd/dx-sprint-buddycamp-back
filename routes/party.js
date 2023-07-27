const express = require('express');
const router = express.Router();
const dbClient = require('../controller/db');

router.get('/', async (req,res)=>{
    try {
        result = await dbClient.query(`SELECT * FROM public."party" ORDER BY "id" DESC LIMIT 50 OFFSET 0 `);
        if(result.rowCount > 0){
            res.status(200).json({
                code: 200,
                data : result.rows,
                result: true,
                message: "success"
            });
        } else {
            res.status(200).json({
                code: 200,
                result: false,
                message: "no data"
            });
        }
    } catch (e) {
        console.log(e);
    }
    
})
router.post('/add', async (req, res) => {
    const body = req.body;
    const { title, introduce, sido, number, positions } = body;
    try {
        result = await dbClient.query(`INSERT INTO public."party"
        (title, introduce, sido, number, positions)
        VALUES ('${title}', '${introduce}', '${sido}', '${number}', '${positions}');`);
        if(result.rowCount > 0){
            res.status(200).send({
                result: true,
                msg: ""
            })
        } else {
            res.status(200).send({
                result: false,
                msg: "db error"
            })
        }
        
    }
    catch (e) {
        console.log(e);
    }
})
router.post("/like", async (req, res)=>{
    const body = req.body;
    const {id} = body;
    try {
        const result = await dbClient.query(`UPDATE public."party"
        SET "like" = "like" + 1
        WHERE "id" = ${id}`)
        if(result.rowCount > 0){
            res.status(200).send({
                result: true,
                msg: ""
            })
        } else {
            res.status(200).send({
                result: false,
                msg: "db error"
            })
        }
    } catch (e){
        console.log(e);
    }
})
module.exports = router;