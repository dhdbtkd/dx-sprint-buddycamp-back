const express = require('express');
const router = express.Router();
const dbClient = require('../controller/db');

router.get('/', async (req,res)=>{
    try {
        result = await dbClient.query(`SELECT * FROM public."buddy" LIMIT 20 OFFSET 0`);
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
    const { name, position, workYear, introduce, address, coord_x, coord_y, add_1depth, add_2depth, avatar_path, bcode } = body;
    try {
        result = await dbClient.query(`INSERT INTO public."buddy"
        (name, position, work_year, introduce, address, coord_x, coord_y, add_1depth, add_2depth, avatar_path, bcode)
        VALUES ('${name}', '${position}', '${workYear}', '${introduce}', '${address}', '${coord_x}', '${coord_y}', '${add_1depth}', '${add_2depth}', '${avatar_path}', '${bcode}');`);
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
module.exports = router;