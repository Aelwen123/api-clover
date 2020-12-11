const mongoose = require('mongoose');
const thirdcompanySchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    companyCode : String,
    companyName : String,
    companyType : String
});

module.exports = mongoose.model('ThirdCompany', thirdcompanySchema);