const express = require('express');
const { Client } = require('pg');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { auth } = require('../auth');
const UsersController = require('../controller/users');
const Util = require("../controller/utils");
const dbClient = require('../controller/db');

/**
 * DB에 존재하는 닉네임인지 확인한다.
 * @param {string} name 닉네임
 */
const checkIdExist = async (name) => {
  let result;
  try {
    result = await dbClient.query(`SELECT EXISTS(SELECT 1 FROM public."user" WHERE name='${name}');`);
    const exist = result.rows[0].exists;
    console.log("result.rows[0]", result.rows[0]);
    if (exist) {
      return true
    } else {
      return false
    }
  }
  catch (e) {
    console.log(e);
  }
}
/**
 * DB에 닉네임을 추가한다.
 * @param {string} name 닉네임 
 */
const addNewId = (name, req, res) => {
  const shareId = Util.generateRandomString(8);
  dbClient.query(`INSERT INTO public."user" (name, share_id) VALUES ('${name}', '${shareId}') RETURNING *;`, (error, result) => {
    if (error) {
      // res.sendStatus(500, error);
      res.send(error);
      console.log(error);
    } else {
      res.status(200).json({
        code : 200,
        result : true,
        message : "Id 추가 완료",
        data : result.rows[0]
      });
    }
  })
}

//계정 생성 post
router.post('/', async (req, res) => {
  const name = req.body.name;
  if (name) {
    if (await checkIdExist(name)) {
      res.status(200).json({
        code: 200,
        result: false,
        message: "이미 존재하는 닉네임이에요"
      });
      console.log("already exist");
    } else {
      console.log("Not exist");
      addNewId(name, req, res);
    }
    
  }
})

//로그인
router.post('/login', async function (req, res, next) {
  const name = req.body.name;
  if (!name) return
  if (!await checkIdExist(name)) {
    return res.status(200).json({
      code: 400,
      message: '존재하지 않는 닉네임이에요',
    });
  }

  token = jwt.sign({
    type: 'JWT',
    name: name,
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
    message: '토큰이 발급되었어요.',
    token: token,
    name : name
  });
});

//JWT 토큰 확인
router.get('/payload', auth, (req, res) => {
  const name = req.decoded.name;
  return res.status(200).json({
    code: 200,
    message: '토큰은 정상입니다.',
    data: {
      name: name,
    }
  });
});
module.exports = router;
