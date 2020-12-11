const express = require('express');
const router = express.Router();
const DebitCard = require('../model/debitcard');
const Limit = require('../model/limit')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const checkAuth = require('../middleware/check-auth')

//Router to get all debit card data
router.get('/', (req, res, next) => {
    Limit.find().exec().then(result=>{
        res.status(200).json(result);
    })
})

module.exports = router;