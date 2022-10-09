const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    Fullname: { type: String },
    Gender: { type: String },
    Title: { type: String },
    Birthday: { type: String },
    City: { type: String },
    District: { type: String },
    Ward: { type: String },
    Fulladdress: { type: String },
    ZipCode: { type: String },
    Phone: { type: String },
    Mobile: { type: String },
    Email: { type: String },
    Industry: { type: String },
    Jobtitle: { type: String },
    Salary: { type: String },
    Company: { type: String },
    Weight: { type: String },
    BMIindex: { type: String },
    Username: { type: String },
    Password: { type: String },
    Bloodtype: { type: String },
});
module.exports = mongoose.model('User', User);