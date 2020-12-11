const express = require('express');
const router = express.Router();
const CreditCard = require('../model/creditcard');
const Account = require('../model/account')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const checkAuth = require('../middleware/check-auth')

//Router to get all debit card data
router.get('/', (req, res, next) => {
    CreditCard.find().exec().then(result=>{
        res.status(200).json(result);
    })
})

router.get('/getCustomerCreditCard/:accountnumber', (req, res, next) => {
    CreditCard.findOne({accountnumber:req.params.accountnumber}).select('creditcardnumber accountnumber limitcredit').exec().then(result => {
        if(result){
            res.status(200).json({
                status : 200,
                result : result
            })
        } else {
            res.status(401).json({
                status : 401,
                message : "Auth failed!"
            })
        }
    })
})

//Router for customer to add debit card
router.post('/createcreditCard', (req, res, next) => {
    Account.findOne({accountnumber: req.body.accountnumber}).exec().then(result => {
        if(result){
            bcrypt.hash(req.body.creditcardpin, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const creditcard = new CreditCard({
                        _id: new mongoose.Types.ObjectId(),
                        CIF : result.CIF,
                        accountnumber : req.body.accountnumber,
                        creditcardnumber : req.body.creditcardnumber,
                        creditcardpin: hash,
                        limitcredit: 600000000
                    });
                    
                    creditcard.save().then(results => {
                        res.status(200).json({
                            message: 'User with id [' + results._id + '] created',
                            createdCard:{
                                CIF : results.CIF,
                                accountnumber : results.accountnumber,
                                creditcardnumber : results.creditcardnumber,
                                creditcardpin : results.creditcardpin,
                                limitcredit: results.limitcredit
                            }
                        });
                    }). catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        } else{
            return res.status(401).json({
                status : 401,
                message : "User account number is invalid"
            })
        }
    });
});

module.exports = router;