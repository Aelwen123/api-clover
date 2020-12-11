const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routeCustomer = require('./API/routes/customer');
const routePayment = require('./API/routes/payment');
const routerDebit = require('./API/routes/debitcard');
const routerCredit = require('./API/routes/creditcard')
const routerAccountType = require('./API/routes/accounttype')
const routerAccount = require('./API/routes/account')
const routerLimit = require('./API/routes/limit')
const routerThirdParty = require('./API/routes/thirdcompany')

mongoose.connect('mongodb+srv://admin:' + process.env.MONGO_ATLAS_PW + '@bankapp.ruomw.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useMongoClient: true
})

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({});
    }
    next();
})

// Routes untuk handle request
app.use('/customer', routeCustomer);
app.use('/payment', routePayment);
app.use('/debit', routerDebit)
app.use('/credit', routerCredit)
app.use('/accounttype', routerAccountType)
app.use('/account', routerAccount)
app.use('/limit', routerLimit)
app.use('/thirdparty', routerThirdParty)

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    })
})

module.exports = app;