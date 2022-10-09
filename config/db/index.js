const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();

async function connect() {
    var db = null
    try {
        await mongoose.connect(process.env.DATA_BASE_URL, { // kết nối MongDB
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
            // useCreateIndex: true
        });
        console.log("đã kết Mongdb Thành công");
    } catch (error) {
        console.log("Kết nối Mongdb Không Thành công");
    }
    return db;
}
module.exports = { connect }