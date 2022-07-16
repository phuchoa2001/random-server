const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Country = new Schema({
    country: { type: Array },
});
module.exports = mongoose.model('Country', Country);