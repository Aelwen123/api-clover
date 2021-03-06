const express = require('express');
const router = express.Router();
const Account = require('../model/account');
const AccountType = require('../model/accounttype')
const Limit = require('../model/limit')
const DebitCard = require('../model/debitcard');
const CreditCard = require('../model/creditcard')
const ThirdCompany = require('../model/thirdcompany')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const checkAuth = require('../middleware/check-auth');
const fetch = require('node-fetch');
const customer = require('../model/customer');
const e = require('express');
const limit = require('../model/limit');

//Router to perform transfer internal
router.post('/transferInternal', (req, res, next) => {
    Account.findOne({accountnumber: req.body.senderAccountNumber}).exec().then(senderaccount => {
        if(senderaccount.balance < req.body.amount){
            return res.status(401).json({
                message: "Not enough balance",
                status : 401
            })
        }
        Account.findOne({accountnumber: req.body.receiverAccountNumber}).exec().then(receiveraccount => {
            DebitCard.findOne({accountnumber: senderaccount.accountnumber}).exec().then(debit => {
                bcrypt.compare(req.body.debitcardpin, debit.debitcardpin, (err, result) => {
                    if(!result){
                        return res.status(401).json({
                            message: "Auth Failed!",
                            status : 401
                        })
                    }
                    if(result){
                        Account.findOneAndUpdate({accountnumber : req.body.senderAccountNumber}, {balance: senderaccount.balance - req.body.amount}, {new : true}, (err2, result) => {
                            if(!result){
                                return res.status(401).json({
                                    message: "Auth Failed!",
                                    status: 401
                                })
                            } else {
                                Account.findOneAndUpdate({accountnumber: req.body.receiverAccountNumber}, {balance : receiveraccount.balance + req.body.amount}, {new : true}, (err3, results) => {
                                    if(!results){
                                        return res.status(401).json({
                                            message: "Auth Failed!",
                                            status : 401
                                        })
                                    }
                                    else{
                                        Limit.findOne({accountnumber:req.body.senderAccountNumber}).exec().then(limitsender => {
                                            Limit.findOneAndUpdate({accountnumber: limitsender.accountnumber}, {limit_transfer_internal: limitsender.limit_transfer_internal + req.body.amount}, {new : true}, (err4, resultss) => {
                                                res.status(200).json({
                                                    message : "Transfer successfull",
                                                    Receiver_Account : results,
                                                    Sender_Account : result,
                                                    Sender_Limit : resultss,
                                                    status : 200
                                                })
                                            })
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            })
        })
    })
})

//Public Router to perform transfer internal pakai yang INI!
router.get('/public/payBalance/:senderAccountNumber/:amountAfter/:debitcardpin', (req, res, next) => {
    Account.findOne({accountnumber: req.params.senderAccountNumber}).exec().then(senderaccount => {
        if(senderaccount.balance < req.params.amountAfter){
            return res.status(401).json({
                message: "Not enough balance",
                status : 401
            })
        }
        Account.findOne({accountnumber: "20383682"}).exec().then(receiveraccount => {
            DebitCard.findOne({accountnumber: senderaccount.accountnumber}).exec().then(debit => {
                bcrypt.compare(req.params.debitcardpin, debit.debitcardpin, (err, result) => {
                    if(!result){
                        return res.status(401).json({
                            message: "Auth Failed!",
                            status : 401
                        })
                    }
                    if(result){
                        Account.findOneAndUpdate({accountnumber : req.params.senderAccountNumber}, {balance: Number(senderaccount.balance) - Number(req.params.amountAfter)}, {new : true}, (err2, result) => {
                            if(!result){
                                return res.status(401).json({
                                    message: "Auth Failed!",
                                    status: 401
                                })
                            } else {
                                Account.findOneAndUpdate({accountnumber: "20383682"}, {balance : Number(receiveraccount.balance) + Number(req.params.amountAfter)}, {new : true}, (err3, results) => {
                                    if(!results){
                                        return res.status(401).json({
                                            message: "Auth Failed!",
                                            status : 401
                                        })
                                    }
                                    else{
                                        Limit.findOne({accountnumber:req.params.senderAccountNumber}).exec().then(limitsender => {
                                            Limit.findOneAndUpdate({accountnumber: limitsender.accountnumber}, {limit_transfer_internal: Number(limitsender.limit_transfer_internal) + Number(req.params.amountAfter)}, {new : true}, (err4, resultss) => {
                                                res.status(200).json({
                                                    message : "Transfer successfull",
                                                    Receiver_Account : results,
                                                    Sender_Account : result,
                                                    Sender_Limit : resultss,
                                                    status : 200
                                                })
                                            })
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            })
        })
    })
})

router.get('/public/withdraw/balance/:accountnumber/:amount', (req, res, next) => {
    Account.findOne({accountnumber : "20383682"}).exec().then(balance => {
        if(balance.balance < req.params.amount){
            return res.status(401).json({
                message : "Not enough balance",
                status : 401
            })
        }

        Account.findOne({accountnumber : req.params.accountnumber}).exec().then(account => {
            if(!account) {
                return res.status(401).json({
                    message : "Auth failed!",
                    status : 401
                })
            } else {
                Account.findOneAndUpdate({accountnumber : balance.accountnumber}, {balance : Number(balance.balance) - Number(req.params.amount)}, {new : true}, (err2, result2) => {
                    if(!result2){
                        return res.status(401).json({
                            message : "Auth failed!",
                            status : 401
                        })
                    } else {
                        Account.findOneAndUpdate({accountnumber : req.params.accountnumber}, {balance : Number(account.balance) + Number(req.params.amount)}, {new : true}, (err3, result3) => {
                            if(!result3){
                                return res.status(401).json({
                                    message : "Auth failed!",
                                    status : 401
                                })
                            } else {
                                res.status(200).json({
                                    message : "Withdrawal Successfull",
                                    status : 200,
                                    receiver : result3
                                })
                            }
                        })
                    }
                })
            }
        })
    })
})

// //Public Router to perform transfer internal
// router.get('/public/transferInternal/:senderAccountNumber/:receiverAccountNumber/:amount/:amountbefore/:debitcardpin', (req, res, next) => {
//     Account.findOne({accountnumber: req.params.senderAccountNumber}).exec().then(senderaccount => {
//         if(senderaccount.balance < req.params.amount){
//             return res.status(401).json({
//                 message: "Not enough balance",
//                 status : 401
//             })
//         }
//         Account.findOne({accountnumber: req.params.receiverAccountNumber}).exec().then(receiveraccount => {
//             DebitCard.findOne({accountnumber: senderaccount.accountnumber}).exec().then(debit => {
//                 bcrypt.compare(req.params.debitcardpin, debit.debitcardpin, (err, result) => {
//                     if(!result){
//                         return res.status(401).json({
//                             message: "Auth Failed!",
//                             status : 401
//                         })
//                     }
//                     if(result){
//                         Account.findOneAndUpdate({accountnumber : req.params.senderAccountNumber}, {balance: Number(senderaccount.balance) - Number(req.params.amount)}, {new : true}, (err2, result) => {
//                             if(!result){
//                                 return res.status(401).json({
//                                     message: "Auth Failed!",
//                                     status: 401
//                                 })
//                             } else {
//                                 Account.findOneAndUpdate({accountnumber: req.params.receiverAccountNumber}, {balance : Number(receiveraccount.balance) + Number(req.params.amountbefore)}, {new : true}, (err3, results) => {
//                                     if(!results){
//                                         return res.status(401).json({
//                                             message: "Auth Failed!",
//                                             status : 401
//                                         })
//                                     }
//                                     else{
//                                         Limit.findOne({accountnumber:req.params.senderAccountNumber}).exec().then(limitsender => {
//                                             Limit.findOneAndUpdate({accountnumber: limitsender.accountnumber}, {limit_transfer_internal: Number(limitsender.limit_transfer_internal) + Number(req.params.amount)}, {new : true}, (err4, resultss) => {
//                                                 res.status(200).json({
//                                                     message : "Transfer successfull",
//                                                     Receiver_Account : results,
//                                                     Sender_Account : result,
//                                                     Sender_Limit : resultss,
//                                                     status : 200
//                                                 })
//                                             })
//                                         })
//                                     }
//                                 })
//                             }
//                         })
//                     }
//                 })
//             })
//         })
//     })
// })

router.post('/topUp/:companycode', (req, res, next) => {
    const body = {
        accountnumber : req.body.accountnumber,
        debitcardpin : req.body.debitcardpin,
        amount : req.body.amount,
        phonenumber : req.body.phonenumber,
        companycode : req.params.companycode
    }

    ThirdCompany.findOne({companyCode: body.companycode}).exec().then(result => {
        if(!result){
            return res.status(401).json({
                message : "Not found",
                companycode : req.params.companycode
            })
        }
    })

    DebitCard.findOne({accountnumber: body.accountnumber}).exec().then(debit => {
        bcrypt.compare(body.debitcardpin, debit.debitcardpin, (err, result) => {
            if(!result){
                return res.status(401).json({
                    message : "Auth Failed! pin salah",
                    status : 401
                })
            }
            else{
                Account.findOne({accountnumber : body.accountnumber}).exec().then(account => {
                    if(body.amount < 20000){
                        return res.status(401).json({
                            message: "Amount minimal 20.000 IDR"
                        })
                    }
                    if(account.balance < body.amount){
                        return res.status(401).json({
                            message : "Balance is not enough!",
                            status : 401
                        })
                    }
                    else{
                        if(body.companycode === "3901"){
                            fetch('http://192.168.100.218:3000/payment/topUp/phonenumber=' + body.phonenumber + '/amount=' + body.amount, {method: 'post'})
                            .then(response => response.json())
                            .then(json => {
                                if(json.status === 200){      
                                    Account.findOneAndUpdate({accountnumber: body.accountnumber}, {balance: account.balance - body.amount}, {new : true}, (err2, results) => {
                                        res.status(200).json({
                                            message: "Top Up successfull",
                                            status : 200,
                                            eWallet_user_Details : {
                                                eWallet_username : json.customer.name,
                                                eWallet_userbalance : json.customer.balance
                                            },
                                            account_detail : {
                                                accountnumber : results.accountnumber,
                                                accountbalance : results.balance
                                            }
                                        })
                                    })              
                                }
                                else {
                                    res.status(401).json(json)
                                }
                            }).catch(err => {
                                res.status(500).json({
                                    error : err
                                })
                            })
                        }
                    }
                })
            }
        })
    })
})

router.get('/public/topUp/:companycode/:accountnumber/:debitcardpin/:amount/:phonenumber', (req, res, next) => {
    const params = {
        accountnumber : req.params.accountnumber,
        debitcardpin : req.params.debitcardpin,
        amount : req.params.amount,
        phonenumber : req.params.phonenumber,
        companycode : req.params.companycode
    }

    ThirdCompany.findOne({companyCode: params.companycode}).exec().then(result => {
        if(!result){
            return res.status(401).json({
                message : "Not found",
                companycode : req.params.companycode
            })
        }
    })

    DebitCard.findOne({accountnumber: params.accountnumber}).exec().then(debit => {
        bcrypt.compare(params.debitcardpin, debit.debitcardpin, (err, result) => {
            if(!result){
                return res.status(401).json({
                    message : "Auth Failed! pin salah",
                    status : 401
                })
            }
            else{
                Account.findOne({accountnumber : params.accountnumber}).exec().then(account => {
                    if(params.amount < 20000){
                        return res.status(401).json({
                            message: "Amount minimal 20.000 IDR"
                        })
                    }
                    if(account.balance < params.amount){
                        return res.status(401).json({
                            message : "Balance is not enough!",
                            status : 401
                        })
                    }
                    else{
                        if(params.companycode === "3901"){
                            fetch('http://192.168.100.218:3000/payment/topUp/phonenumber=' + params.phonenumber + '/amount=' + params.amount, {method: 'post'})
                            .then(response => response.json())
                            .then(json => {
                                if(json.status === 200){      
                                    Account.findOneAndUpdate({accountnumber: params.accountnumber}, {balance: account.balance - params.amount}, {new : true}, (err2, results) => {
                                        res.status(200).json({
                                            message: "Top Up successfull",
                                            status : 200,
                                        })
                                    })              
                                }
                                else {
                                    res.status(401).json(json)
                                }
                            }).catch(err => {
                                res.status(500).json({
                                    error : err
                                })
                            })
                        }
                    }
                })
            }
        })
    })
})

router.post('/limitChecker', (req, res, next) => {
    Limit.findOne({accountnumber : req.body.accountnumber}).exec().then(limit => {
        Account.findOne({accountnumber: req.body.accountnumber}).exec().then(account => {
            AccountType.findOne({accounttype: account.accounttype}).exec().then(accounttype => {
                if(limit.limit_transfer_internal >= accounttype.limit_transfer_internal){
                    return res.status(200).json({
                        message: "Limit transfer internal reached! sama"
                    })
                }
                if(limit.limit_transfer_internal + req.body.amount > accounttype.limit_transfer_internal){
                    return res.status(200).json({
                        message: "Limit transfer internal reached!"
                    })
                }
                else{
                    res.status(200).json({
                        message1: "Limit belum tercapai limit.limit_transfer_internal = " + req.body.limit_transfer_internal,
                        message2: "Limit belum tercapai accounttype.limit_transfer_internal = " + accounttype.limit_transfer_internal
                    })
                }
            }).catch(err => {
                res.status(400).json({
                    err : err
                })
            })
        })
    })
})

router.get('/public/limitChecker/:accountnumber/:amount', (req, res, next) => {
    Limit.findOne({accountnumber : req.params.accountnumber}).exec().then(limit => {
        Account.findOne({accountnumber: req.params.accountnumber}).exec().then(account => {
            AccountType.findOne({accounttype: account.accounttype}).exec().then(accounttype => {
                if(limit.limit_transfer_internal >= accounttype.limit_transfer_internal){
                    console.log("LLimit transfer internal reached!OL")
                    return res.status(401).json({
                        message: "Limit transfer internal reached!",
                        status: 401
                    })
                }
                if(Number(limit.limit_transfer_internal) + Number(req.params.amount) > accounttype.limit_transfer_internal){
                    console.log("LLimit transfer internal reached!OLsssss")
                    return res.status(401).json({
                        message: "Limit transfer internal reached!",
                        status : 401
                    })
                }
                else{
                    res.status(200).json({
                        message1: "Limit belum tercapai limit.limit_transfer_internal = " + limit.limit_transfer_internal,
                        message2: "Limit belum tercapai accounttype.limit_transfer_internal = " + accounttype.limit_transfer_internal,
                        status : 200
                    })
                }
            }).catch(err => {
                res.status(400).json({
                    err : err
                })
            })
        })
    })
})

module.exports = router;