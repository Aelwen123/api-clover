const express = require('express');
const router = express.Router();
const DebitCard = require('../model/debitcard');
const Limit = require('../model/limit')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/check-auth')

//Router to get all debit card data
router.get('/', (req, res, next) => {
    DebitCard.find().exec().then(result=>{
        res.status(200).json(result);
    })
})

//Router for customer to add debit card
router.post('/createdebitCard', (req, res, next) => {
    DebitCard.findOne({accountnumber: req.body.accountnumber}).exec().then(result => {
        if(result){
            return res.status(409).json({
                message: "Customer already have a debit card with card number = " + result.debitcardnumber
            });
        } else{
            bcrypt.hash(req.body.debitcardpin, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const debitcard = new DebitCard({
                        _id: new mongoose.Types.ObjectId(),
                        CIF : req.body.CIF,
                        accountnumber : req.body.accountnumber,
                        debitcardnumber : req.body.debitcardnumber,
                        debitcardpin : hash
                    });
                    
                    const limit = new Limit({
                        _id : new mongoose.Types.ObjectId(),
                        accountnumber: req.body.accountnumber,
                        limit_debit: 0,
                        limit_transfer_internal : 0,
                        limit_transfer_external : 0,
                        limit_cash_withdraw : 0,
                        limit_cash_deposit : 0
                    })
                    
                    debitcard.save().then(result => {
                        limit.save().then(results => {
                            res.status(200).json({
                                message: 'User with id [' + result._id + '] created',
                                createdCard:{
                                    CIF : result.CIF,
                                    accountnumber : result.accountnumber,
                                    debitcardnumber : result.debitcardnumber,
                                    debitcardpin : result.debitcardpin
                                },
                                limitCounter:{
                                    limit_debit: results.limit_debit,
                                    limit_transfer_internal : results.limit_transfer_internal,
                                    limit_transfer_external : results.limit_transfer_external,
                                    limit_cash_withdraw : results.limit_cash_withdraw,
                                    limit_cash_deposit : results.limit_cash_deposit
                                }
                            });
                        })
                    }). catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });
});

//Router for sign in mobile banking
router.post('/signin_mobilebanking', (req, res, next) => {
    DebitCard.findOne({debitcardnumber : req.body.debitcardnumber}).exec().then(debit =>{
        if(!debit){
            return res.status(401).json({
                message: "Auth failed!"
            })
        }
        else{
            bcrypt.compare(req.body.debitcardpin, debit.debitcardpin, (err, result) => {
                if(!result){
                    return res.status(401).json({
                        message: "Pin salah!"
                    })
                }
                else{
                    const token = jwt.sign({
                        CIF : debit.CIF,
                        accountnumber : debit.accountnumber,
                        debitcardnumber : debit.debitcardnumber
                    }, 'secret', {expiresIn : '1h'})

                    res.status(200).json({
                        message: "Sign in Success",
                        status : 200,
                        token : token,
                        accountnumber : debit.accountnumber,
                        debitcardnumber : debit.debitcardnumber
                    })
                }
            })
        }
    })
})

module.exports = router;