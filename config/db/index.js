const mongoose = require('mongoose');
async function connect() {
    var db = null
    try {
        await mongoose.connect("mongodb://localhost:27017/Phim", { // kết nối MongDB
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