const express = require('express');
const fs = require('fs');
const datafile = 'server/data/clothing.json';
const router = express.Router();

/* GET all clothing */
router.route('/')
  .get(function(req, res) {

    getClothingData().then(data => {
      console.log('Data from Clothing received');
      res.send(data);
    }).catch(err => {
      console.log(err);
      res.status(404);
    }).finally(() => {
      console.log('Promise has returned.');
    })
   /* getClothingData((err, data) => {
      if (err) {
        console.log(err);
        res.status(404);
      }
      else {
        res.send(data);
      }
    })*/
    console.log('Now onto Other Tasks.');
  });

  function getClothingData(){

    return new Promise((resolve, reject) => {
      let rawData = fs.readFile(datafile, 'utf8',  (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        } 
        else {
          console.log('Finished reading Clothing Data.');
          let clothingData = JSON.parse(data);
          resolve( clothingData);
        }
      });
    })
    
  }

/*
  function getClothingData(callback){
    let rawData = fs.readFile(datafile, 'utf8',  (err, data) => {
      if (err) {
        console.log(err);
        callback(err, null);
      } 
      else {
        console.log('Finished reading Clothing Data.');
        let clothingData = JSON.parse(data);
        callback(null, clothingData);
      }
    });
  }
*/
module.exports = router;
