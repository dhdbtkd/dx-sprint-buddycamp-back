const express = require('express');
const { Client } = require('pg');
const router = express.Router();

router.get('/autocomplete/:query', async (req, res) => {
  // const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=name%2Cgeometry%2Cformatted_address&input=${req.params.query}&inputtype=textquery&key=AIzaSyDr2B8Vq2INj0dDC9cclqjj_EQIOxwDvic`;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.params.query}&radius=5000&key=AIzaSyDr2B8Vq2INj0dDC9cclqjj_EQIOxwDvic&language=ko`;
  const queryResult = await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return res.status(200).json({
          code: 200,
          message: 'google autocomplete success',
          data: data
        });
      });
});
router.get('/geocode/:query', async (req, res) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?place_id=${req.params.query}&key=AIzaSyDr2B8Vq2INj0dDC9cclqjj_EQIOxwDvic`;
  const queryResult = await fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        return res.status(200).json({
          code: 200,
          message: 'google geocode success',
          data: data
        });
      });
});
module.exports = router;
