const mongoose = require('mongoose');
const accountTypeSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    accounttype : {
        type : String,
        unique : true,
    },
    limit_debit: Number,
    limit_transfer_internal : Number,
    limit_transfer_external : Number,
    limit_cash_withdraw : Number,
    limit_cash_deposit : Number,
    admin_fee : Number,
    card_making_fee : Number
});

module.exports = mongoose.model('AccountType', accountTypeSchema);