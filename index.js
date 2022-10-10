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
    <code>/list/:id</code>
    <p>Nhận phần tử bằng id thông tin người tiếng việt</p>
    </div>
    `)
})

app.get('/list', async (req, res) => {
    GetList(UserModel, res, req, "name", "name");
})
app.get('/random', async (req, res) => {
    UserModel.count().exec(function (err, count) {
        // Get a random entry
        var random = Math.floor(Math.random() * count)
        // Again query all users but only fetch one offset by our random #
        UserModel.findOne().skip(random).exec(
            function (err, result) {
                // Tada! random user
                console.log(result)
            })
    })
})
app.get('/list/:id', async (req, res) => {
    GetId(UserModel, res, req, { _id: req.params.id });
})
app.listen(process.env.PORT || 3002, () => {
    console.log('Server đang chay tren cong ' + process.env.PORT);
});
