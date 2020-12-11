const mongoose = require('mongoose');
const accountSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    CIF : String,
    accountnumber : String,
    accounttype : String,
    balance : Number
});

module.exports = mongoose.model('Account', accountSchema);