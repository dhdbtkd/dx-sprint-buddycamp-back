const express = require('express');
const router = express.Router();
const dbClient = require('../controller/db');
const bcrypt = require('bcrypt');
const { auth } = require('../auth');
const jwt = require('jsonwebtoken');


router.get('/', async (req, res) => {
    res.status(200).json({
        code: 200,
        result: false,
        message: "spritn_user"
    });
})
router.get('/login', auth, (req, res)=>{
    return res.status(200).json({
        code: 200,
        message: '로그인 정상.',
        result : true
    });
})
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});
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
                token = jwt.sign({
                    type: 'JWT',
                    email: id,
                }, process.env.JWT_SECRET_KEY, {
                    expiresIn: '1h',
                    issuer: '토큰발급자',
                });
                res.cookie('jwtToken', token, {
                    httpOnly: true,
                });
                //response
                return res.status(200).json({
                    code: 200,
                    message: '로그인 성공',
                    result : true,
                    token: token,
                    email : id
                });
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
//JWT 토큰 확인
router.post('/payload', auth, (req, res) => {
    const name = req.decoded.name;
    console.log("🚀 ~ file: sprint_user.js:112 ~ router.post ~ name:", name)
    return res.status(200).json({
        code: 200,
        message: '토큰은 정상입니다.',
        result : true,
        data: {
            name: name,
        }
    });
});
const checkDuplicateEmail = async (email) => {
    result = await dbClient.query(`select exists(select 1 from public."user" where email='${email}') AS "exists"`);
    if(result.rows[0].exists) return true;
    
    return false;
}
module.exports = router;