const express = require('express');
const { Client } = require('pg');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { auth } = require('../auth');
const UsersController = require('../controller/users');
const dbClient = require('../controller/db');


const checkPlanExist = async (name)=>{
  let result;
  try {
    result = await dbClient.query(`SELECT EXISTS(SELECT 1 FROM public.tourplans WHERE owner_nm='${name}');`);
    const exist = result.rows[0].exists;
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
const createPlan = async (userId, userNm)=>{
  let result;
  try {
    result = await dbClient.query(`INSERT INTO public.tourplans (owner_id, owner_nm) VALUES ('${userId}','${userNm}') RETURNING *;`);
    return result;
  }
  catch (e) {
    console.log(e);
  }
}
const updatePlan = async (userNm, planJson) => {
  let result;
  try {
    result = await dbClient.query(`UPDATE public.tourplans SET places = '${JSON.stringify(planJson)}' WHERE owner_nm = '${userNm}' RETURNING *;`);
    return result;
  }
  catch (e) {
    console.log(e);
  }
}
const getPlan = async (userNm)=>{
  let result;
  try {
    result = await dbClient.query(`SELECT * FROM public.tourplans WHERE owner_nm = '${userNm}';`);
    return result;
  }
  catch (e) {
    console.log(e);
  }
}
//여행 계획 생성
router.post('/', async (req, res) => {
  const name = req.body.name;
  if (name) {
    if (await checkPlanExist(name)) {
      res.status(200).json({
        code: 200,
        result: false,
        message: "이미 여행 계획이 존재"
      });
    } else {
      const userInfo = await UsersController.getUserInfoByNm(name);
      const createResult = await createPlan(userInfo.idx, userInfo.name);
      res.status(200).json({
        code: 200,
        result: true,
        message: `${name}의 여행 계획 생성 완료`
      });
    }
  }
})

//여행 계획 저장(업데이트)
router.put('/:name', auth, async (req,res)=>{
  const name = req.params.name;
  if(!name) return;
  const planJson = req.body.planJson;
  const updateResult = await updatePlan(name, planJson);
  console.log(updateResult);
})

//여행 계획 불러오기
router.get('/:name', async (req,res)=>{
  const name = req.params.name;
  if(!name) return;
  const getResult = await getPlan(name);
  if(getResult.rows.length>0){
    res.status(200).json({
      code : 200,
      result : true,
      data : getResult.rows
    })
  } else {
    res.status(404).json({
      code : 404,
      result : false,
      data : getResult.rows
    })
  }
})

module.exports = router;
