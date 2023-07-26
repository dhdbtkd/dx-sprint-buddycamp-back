const express = require('express');
const router = express.Router();
const dbClient = require('../controller/db');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    res.status(200).json({
        code: 200,
        result: false,
        message: "spritn_user"
    });
})

router.post('/login', async (req, res) => {
    const body = req.body;
    const {id, pw} = body;
    
    try {
        const password = req.body.pw;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        result = await dbClient.query(`SELECT * FROM public."user" WHERE email = '${id}';`);
        if(result.rows.length > 0){
            const dbPw = result.rows[0].pw;
            
            const isMatch = await bcrypt.compare(password, dbPw);
            if(isMatch){
                req.session.loggedin = true;
                req.session.useremail = id;
                res.status(200).send({
                    result : true,
                })
            } else {
                res.status(200).send({
                    result : false,
                    msg : "비밀번호 불일치"
                })
            }
            
        } else {
            res.status(200).send({
                result : false,
                msg : "존재하지 않는 아이디"
            });
        }      
    }
    catch (e) {
        console.log(e);
    }
})
router.post('/signup', async (req, res) => {
    const body = req.body;
    const {id, pw} = body;
    try {
        const isDuplicate = await checkDuplicateEmail(id);
        if(isDuplicate){
            res.status(200).send({
                result : false,
                msg : "아이디 중복"
            })
        } else {
            const password = req.body.pw;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            result = await dbClient.query(`INSERT INTO public."user" (email, pw) VALUES ('${body.id}', '${hashedPassword}') RETURNING *;`);
            const exist = result.rows[0].exists;
            res.status(200).send({
                result : true,
                msg : ""
            })
        }
        
        // if (exist) {
        //     return true
        // } else {
        //     return false
        // }
    }
    catch (e) {
        console.log(e);
    }
})
const checkDuplicateEmail = async (email) => {
    console.log("🚀 ~ file: sprint_user.js:77 ~ checkDuplicateEmail ~ email:", email)
    result = await dbClient.query(`select exists(select 1 from public."user" where email='${email}') AS "exists"`);
    if(result.rows[0].exists) return true;
    
    return false;
}
module.exports = router;