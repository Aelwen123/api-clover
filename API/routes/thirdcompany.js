const express = require('express');
const router = express.Router();
const DebitCard = require('../model/debitcard');
const ThirdParty = require('../model/thirdcompany')
const Limit = require('../model/limit')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const checkAuth = require('../middleware/check-auth')

//Router to get all debit card data
router.get('/', (req, res, next) => {
    DebitCard.find().exec().then(result=>{
        res.status(200).json(result);
    })
})

//Router for customer to add debit card
router.post('/addthirdparty', (req, res, next) => {
    const thirdparty = new ThirdParty({
        _id : new mongoose.Types.ObjectId(),
        companyCode : req.body.companycode,
        companyName : req.body.companyname,
        companyType : req.body.companytype
    })

    thirdparty.save().then(result => {
        res.status(200).json({
            message : result
        })
    })
})

module.exports = router;