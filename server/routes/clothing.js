const express = require('express');
const fs = require('fs');
const fsPromises = require('fs').promises;
const datafile = 'server/data/clothing.json';
const router = express.Router();

// /* GET all clothing */
// router.route('/')
//   .get(async function(req, res) {

//     // Async/Await Convention
//     try {
//     let data = await getClothingData();
//     console.log('Data from Clothing received');
//     res.send(data);
//     } catch (error) {
//       console.log(error);
//       res.send(error);
//     }
//     // Promises Convention
//     /*getClothingData().then(data => {
//       console.log('Data from Clothing received');
//       res.send(data);
//     }).catch(err => {
//       console.log(err);
//       res.status(404);
//     }).finally(() => {
//       console.log('Promise has returned.');
//     })*/

//     // Callback Convention
//    /* getClothingData((err, data) => {
//       if (err) {
//         console.log(err);
//         res.status(404);
//       }
//       else {
//         res.send(data);
//       }
//     })*/
//     console.log('Now onto Other Tasks.');
//   });

//   // async/await convention
//   async function getClothingData(){
    
//     // By using await, the data returned is already unwrapped so no need to use then to process the resolution of Promise
//     let rawData = await fsPromises.readFile(datafile, 'utf8');
//     let clothingData = JSON.parse(rawData);
//     return clothingData;

//     // using the promise based readFile of FS; we still need to unwrap promise without using await
//     /*let clothingPromise = fsPromises.readFile(datafile, 'utf8');
//     clothingPromise.then(data => JSON.parse(data));
//     return clothingPromise;*/
//   }

//   // Promise Convention
//   /*
//   function getClothingData(){
//     return new Promise((resolve, reject) => {
//       let rawData = fs.readFile(datafile, 'utf8',  (err, data) => {
//         if (err) {
//           console.log(err);
//           reject(err);
//         } 
//         else {
//           console.log('Finished reading Clothing Data.');
//           let clothingData = JSON.parse(data);
//           resolve( clothingData);
//         }
//       });
//     })
//   }
// */

//   // Callback Convention
// /*
//   function getClothingData(callback){
//     let rawData = fs.readFile(datafile, 'utf8',  (err, data) => {
//       if (err) {
//         console.log(err);
//         callback(err, null);
//       } 
//       else {
//         console.log('Finished reading Clothing Data.');
//         let clothingData = JSON.parse(data);
//         callback(null, clothingData);
//       }
//     });
//   }
// */
// module.exports = router;


// Code for the Event Emitter Module
module.exports = function(monitor) {
  let dataMonitor = monitor;

  dataMonitor.on('dataAdded', (item) => {
    setImmediate(() => console.log(`New data was added: ${item}`));
  });
  
  /* GET all clothing */
  router.route('/')
    .get(async function(req, res) {
  
      try {
        let data = await getClothingData();
        res.send(data);
      }
      catch (error) {
        res.status(500).send(error);
      }
    })
  
    .post(async function(req, res) {
      try {
  
        let data = await getClothingData();
  
        let nextID = getNextAvailableID(data);
  
        let newClothingItem = {
            clothingID: nextID,
            itemName: req.body.itemName,
            price: req.body.price
        };
  
        data.push(newClothingItem);
  
        await saveClothingData(data);
  
        dataMonitor.emit('dataAdded', newClothingItem.itemName);

        console.log('Returning new item to browser.');
  
        res.status(201).send(newClothingItem);
      }
      catch (error) {
        res.status(500).send(error);
      }
  
    });
  
  async function getClothingData() {
  
    let rawData = await fsPromises.readFile(datafile, 'utf8');
    let clothingData = JSON.parse(rawData);
  
    return clothingData;
  
  }  
  
  function getNextAvailableID(allClothingData) {
    
    let maxID = 0;
  
    allClothingData.forEach(function(element, index, array) {
      if(element.clothingID > maxID) {
          maxID = element.clothingID;
      }
    });
    return ++maxID;
  }
  
  function saveClothingData(data) {
    return fsPromises.writeFile(datafile, JSON.stringify(data, null, 4));
  }
  
  return router;
}