const mongoose = require('mongoose');
const creditcardSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    CIF : String,
    accountnumber : String,
    creditcardnumber : String,
    creditcardpin: String,
    limitcredit: Number
});

module.exports = mongoose.model('CreditCard', creditcardSchema);