const express = require('express');
const router = express.Router();

const AccountType = require('../model/accounttype')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const checkAuth = require('../middleware/check-auth')

//Router to get all debit card data
router.get('/', (req, res, next) => {
    Account.find().exec().then(result=>{
        res.status(200).json(result);
    })
})

//Router for customer to add debit card
router.post('/createAccountType', (req, res, next) => {
    AccountType.findOne({accounttype : req.body.accounttype}).exec().then(result => {
        if(result){
            return res.status(401).json({
                message: "Account type is already existed!",
                status : 401
            })
        } else {
            const accounttype = new AccountType({
                _id : new mongoose.Types.ObjectId(),
                accounttype : req.body.accounttype,
                limit_debit: req.body.limit_debit,
                limit_transfer_internal : req.body.limit_transfer_internal,
                limit_transfer_external : req.body.limit_transfer_external,
                limit_cash_withdraw : req.body.limit_cash_withdraw,
                limit_cash_deposit : req.body.limit_cash_deposit,
                admin_fee : req.body.admin_fee,
                card_making_fee : req.body.card_making_fee
            })

            accounttype.save().then(results => {
                res.status(200).json({
                    message: "AccountType with id [" + results._id + "] created",
                    createdAccountType: {
                        accounttype : results.accounttype,
                        limit_debit: results.limit_debit,
                        limit_transfer_internal : results.limit_transfer_internal,
                        limit_transfer_external : results.limit_transfer_external,
                        limit_cash_withdraw : results.limit_cash_withdraw,
                        limit_cash_deposit : results.limit_cash_deposit,
                        admin_fee : results.admin_fee,
                        card_making_fee : results.card_making_fee
                    },
                    status : 200
                })
            })
        }
    })
});

module.exports = router;