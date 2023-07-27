const express = require('express');
const router = express.Router();
const dbClient = require('../controller/db');

router.get('/', async (req,res)=>{
    const body = req.query;
    console.log("🚀 ~ file: comment.js:7 ~ router.get ~ body:", body)
    try {
        result = await dbClient.query(`SELECT * FROM public."comment" WHERE "parent_id" = ${body.parent_id} AND "category" = '${body.category}' LIMIT 20 OFFSET 0 `);
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
router.post('/', async (req, res) => {
    const body = req.body;
    const { id, comment, writer, category } = body;
    try {
        const result = await dbClient.query(`INSERT INTO public."comment"
        (parent_id, comment, writer, category)
        VALUES ('${id}', '${comment}', '${writer}', '${category}');`);
        if(result.rowCount > 0){
            const result = await dbClient.query(`UPDATE public."${category}"
            SET "comment_num" = "comment_num" + 1
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