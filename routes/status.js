var express = require('express');
var router = express.Router();
var db = require('../models');
const fs = require('fs');
const { QueryTypes } = require('sequelize');

const insertData = async(filename) => {
    const {records} = await JSON.parse(fs.readFileSync('./data/' + filename));

    records.forEach(async (record) => {
        let result = await db.sequelize.query(record.query, {
            raw: true,
            type: QueryTypes.INSERT
        });
        console.log(result)
    })
}

const checkIfDBHasData = async() => {
    let result = await db.sequelize.query('SELECT COUNT(*) as total FROM statuses', {
        raw: true,
        type: QueryTypes.SELECT
    });

    if(result[0].total == 0){
        return true;
    }
    return false;
}

const initializeApp = async() => {
    if(await checkIfDBHasData()){
        console.log('No records in the categories table, populating the database')
        await insertData('status.json');
      } else {
        console.log('No records added. The database is already populated');
      }
}

setTimeout(() => {
    initializeApp().then(() => {
      console.log('Initialization complete.');
    });
  }, 5000);

module.exports = router;