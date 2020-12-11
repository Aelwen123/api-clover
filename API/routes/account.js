const express = require('express');
const router = express.Router();
const Account = require('../model/account')
const AccountType = require('../model/accounttype')
const Customer = require('../model/customer')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')
const mailGun = require('nodemailer-mailgun-transport')
const checkAuth = require('../middleware/check-auth')

//Router to get all debit card data
router.get('/', (req, res, next) => {
    Account.find().exec().then(result=>{
        res.status(200).json(result);
    })
})

router.get('/public/balance/:accountnumber', (req, res, next) => {
    Account.findOne({accountnumber: req.params.accountnumber}).select('balance').exec().then(result => {
        res.status(200).json(result)
    })
})

router.post('/getAccount', (req, res, next) => {
    Account.findOne({accountnumber: req.body.accountnumber}).select('-_id -__v').exec().then(result => {
        if(result){
            res.status(200).json(result)
        }
        else{
            res.status(401).json({
                message: "Account number not found!",
                status : 401
            })
        }
    })
})

router.get('/public/getAccount/:accountnumber', (req, res, next) => {
    Account.findOne({accountnumber: req.params.accountnumber}).select('-_id -__v').exec().then(result => {
        if(result){
            res.status(200).json(result)
        }
        else{
            res.status(401).json({
                message: "Account number not found!",
                status : 401
            })
        }
    })
})

//Router for customer to add debit card
router.post('/createAccount', (req, res, next) => {
    Customer.findOne({CIF: req.body.CIF}).exec().then(result => {
        if(!result){
            return res.status(401).json({
                message: "User with CIF: " + req.body.CIF + " is not found"
            })
        }
    })

    Account.findOne({accountnumber: req.body.accountnumber}).exec().then(result => {
        if(result){
            return res.status(401).json({
                message: "Account number is already existed!"
            })
        } else {
            AccountType.findOne({accounttype : req.body.accounttype}).exec().then(result => {
                if(!result){
                    return res.status(401).json({
                        message: "Account type is not exist",
                        status : 401
                    })
                }
                else{
                    const account = new Account({
                        _id : new mongoose.Types.ObjectId(),
                        CIF : req.body.CIF,
                        accountnumber : req.body.accountnumber,
                        accounttype : req.body.accounttype,
                        balance : 0
                    })

                    account.save().then(results => {
                        res.status(200).json({
                            message: 'Account with id [' + results._id + '] created',
                            createdAccount:{
                                CIF : results.CIF,
                                accountnumber : results.accountnumber,
                                accounttype : results.accounttype,
                                balance : 0
                            },
                            status : 200
                        });
                    })
                }
            })
        }
    })
});

module.exports = router;