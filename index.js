const express = require('express')
const axios = require('axios').default;
const db = require('./config/db')
const app = express();

const { GetList, GetId } = require("./common/GetList")
const { GetTotal } = require("./common/GetTotal")

const UserModel = require('./app/models/user');
// 

let numberAll = 0;

db.connect();

app.get("/", async (req, res) => {
    const Total = await GetTotal(UserModel);
    console.log("Total", Total);
    res.send(`
    <style>
     h3 {
        font-size: 30px;
        text-align: center;
        margin-top : 10px;
     }
     code , p {
        font-size: 20px;
        margin : 20px 0px;
     }
    </style>
    <div class="infoVietName">
    <h3>Tổng cộng thông tin người tiếng việt : ${Total}</h3>
    <code>/random</code>
    <p>Nhận ngẫu nhiên thông tin người tiếng việt</p>
    <code>/list</code>
    <p>Nhận một danh sách thông tin người tiếng việt</p>
    <p>Lưu ý : phần meta hỗ trợ phần trang</p>
    <code>/list?search=timkiem</code>
    <p>Chúng ta có thêm query : search để tìm kiếm Fullname cần tìm</p>
    <code>/list?page_size=10</code>
    <p>Chúng ta có thêm query : page_size để nhận số lượng cần lấy về</p>
    <code>/list?page=1</code>
    <p>Chúng ta có thêm query : page để nhận phân trang tiếp theo </p>
    <code>/list?search=dangphuchoa&page=1&page_size=10</code>
    <p>Có thể viết như trên</p>
    <code>/list/:_id</code>
    <p>Nhận phần tử bằng id thông tin người tiếng việt</p>
    </div>
    `)
})

app.get('/list', async (req, res) => {
    GetList(UserModel, res, req, "Fullname", "Fullname");
})
app.get('/random', async (req, res) => {
    UserModel.count().exec(function (err, count) {
        // Get a random entry
        var random = Math.floor(Math.random() * count)
        // Again query all users but only fetch one offset by our random #
        UserModel.findOne().skip(random).exec(
            function (err, result) {
                // Tada! random user
                res.json(result);
            })
    })
})
app.get('/list/:id', async (req, res) => {
    GetId(UserModel, res, req, { _id: req.params.id });
})
app.listen(process.env.PORT || 3002, () => {
    console.log('Server đang chay tren cong ' + process.env.PORT);
});
