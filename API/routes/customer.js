const express = require('express');
const router = express.Router();
const Customer = require('../model/customer');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth')

//Router to get all customers data
router.get('/', (req, res, next) => {
    Customer.find().exec().then(result=>{
        res.status(200).json(result);
    })
})

router.get('/getCustomer/:CIF', (req, res, next) => {
    Customer.findOne({CIF: req.params.CIF}).select('name').exec().then(result => {
        res.status(200).json(result)
    })
})

//Router for customers to create Tabungan Online
router.post('/createtabunganOnline', (req, res, next) => {
    Customer.findOne({nik : req.body.nik}).exec().then(customer => {
        if(customer){
            const customer = new Customer({
                name : req.body.name,
                gender : req.body.gender,
                phonenumber : req.body.phonenumber,
                nama_ibu : req.body.nama_ibu,
                kota_domisili : req.body.kota_domisili,
                email: req.body.email,
                birthplace: req.body.birthplace,
                birthdate : req.body.birthdate,
                religion : req.body.religion,
                marriedstatus: req.body.marriedstatus,
                lasteducation : req.body.lasteducation,
                address : req.body.address,
                job : req.body.job
            })
            Customer.update({nik : req.body.nik}, customer).then(result=> {
                res.status(200).json({
                    message : "Data updated!"
                })
            })
            .catch(err => {
                res.status(500).json({
                    error : err
                })
            })
        }
        else if(!customer){
            var ID = function (){
                return Math.random().toString(36).substr(2, 12);
            }

            const customer = new Customer({
                _id : new mongoose.Types.ObjectId(),
                CIF : Math.floor((Math.random() * 99999999999) + 10000000000),
                nik : req.body.nik,
                name : req.body.name,
                gender : req.body.gender,
                phonenumber : req.body.phonenumber,
                nama_ibu : req.body.nama_ibu,
                kota_domisili : req.body.kota_domisili,
                email: req.body.email,
                birthplace: req.body.birthplace,
                birthdate : req.body.birthdate,
                religion : req.body.religion,
                marriedstatus: req.body.marriedstatus,
                lasteducation : req.body.lasteducation,
                address : req.body.address,
                job : req.body.job
            })

            customer.save().then(result => {
                res.status(200).json({
                    message : "Customer with [ id " + result.CIF + " ] is created",
                    status : 200
                })
            }).catch(err => {
                res.status(500).json({
                    error : err
                })
            })
        }
    })
})


module.exports = router;