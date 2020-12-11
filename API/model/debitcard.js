const mongoose = require('mongoose');
const debitcardSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    CIF : String,
    accountnumber : String,
    debitcardnumber : String,
    debitcardpin : String
});

module.exports = mongoose.model('DebitCard', debitcardSchema);