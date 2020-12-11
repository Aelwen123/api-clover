const mongoose = require('mongoose');
const limitSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    accountnumber: String,
    limit_debit: Number,
    limit_transfer_internal : Number,
    limit_transfer_external : Number,
    limit_cash_withdraw : Number,
    limit_cash_deposit : Number
});

module.exports = mongoose.model('Limit', limitSchema);