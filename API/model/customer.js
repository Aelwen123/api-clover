const mongoose = require('mongoose');
const customerSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    CIF : String,
    name : String,
    gender : String,
    phonenumber : {
        type : String,
        unique : true,
    },
    nik : String,
    nama_ibu : String,
    kota_domisili : String,
    email: String,
    birthplace: String,
    birthdate : String,
    religion : String,
    marriedstatus: String,
    lasteducation : String,
    address : String,
    job : String
});

module.exports = mongoose.model('Customer', customerSchema);