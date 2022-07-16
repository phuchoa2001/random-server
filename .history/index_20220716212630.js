const express = require('express')
const puppeteer = require('puppeteer');
const axios = require('axios').default;
let ListAnimeApi = [];
const db = require('./config/db')
const app = express();
const Phim = require('./app/models/Phims');
const Category = require("./app/models/category");
const Country = require("./app/models/country");
let category = [];

// 

db.connect();

app.get("/getaxios", (req, res) => {

    ListAnimeApi.map((phim, index) => {
        setTimeout(() => {
            axios.get(`https://ophim1.com/${phim.link}`)
                .then(function (response) {
                    // handle success
                    const movie = new Phim({
                        ...response.data,
                        ...response.data.movie
                    });
                    movie.save();
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
            if (index === ListAnimeApi.length - 1) {
                res.redirect('/end');
            }
        }, index * 100)
    });
})
app.get('/editAll', (req, res) => {
    Phim.updateMany({}, { like: 0, }).then();
    res.json({ message: "đã edit" });
})
app.get('/endcountry', (req, res) => {
    const countrys = new Country({
        country: category
    });
    countrys.save();
    res.json(category)
})
app.get('/getcountry', (req, res) => {
    Phim.find({}, function (err, data) {
        data.map((phim, index) => {
            phim.country.map(item => {
                category.push(item.name);
                category = Array.from(new Set(category));
                console.log("a")
            })
        })
    })
})
app.get('/endcategory', (req, res) => {
    Category.findOneAndUpdate({}, { category }).then();
    res.json(category)
})
app.get('/getcategory', (req, res) => {
    Phim.find({}, function (err, data) {
        data.map((phim, index) => {
            phim.category.map(item => {
                category.push(item.name);
                category = Array.from(new Set(category));
                console.log("a")
            })
        })
    })
})
app.get('/deleteAll', (req, res) => {
    Phim.deleteMany({}).then();
    res.json({ message: "đã xóa" })
})
app.get('/end', (req, res) => {
    res.json({ message: " tất cả bộ phim vào data " + ListAnimeApi.length })
})
app.get('/getphims', (req, res) => {
    res.json(ListAnimeApi)
})
app.get('/capnhatphim', (req, res) => {
    Phim.find({ episode_total: "" }, function (err, data) {
        data.map((phim, index) => {
            setTimeout(() => {
                axios.get(`https://ophim1.com/phim/${phim.slug}`)
                    .then(function (response) {
                        // handle success
                        const movie = {
                            ...response.data,
                            ...response.data.movie,
                            follow: phim.follow,
                            view: phim.view,
                            like: phim.like
                        };
                        Phim.findOneAndUpdate({ _id: phim._id }, movie).then();
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                    .then(function () {
                        // always executed
                    });
                if (index === data.length - 1) {
                    res.redirect('/end');
                }
            }, index * 100)
        });
        res.json({
            length: data.length,
            data: data
        })
    })
})
app.get('/day', (req, res) => {
    ListAnimeApi = [];
    let end = "";
    Phim.findOne({}, async function (err, data) {
        end = data.slug;
        let startpage = 1;
        let endpage = 71;
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 30
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1400,
            height: 1000,
        });
        async function GetAll() {
            if (startpage > endpage) {
                res.redirect('/getaxios');
                await browser.close();
            } else {
                await page.goto(`https://ophim.cc/danh-sach/hoat-hinh?page=${startpage}`);
                const elHandleArrays = await page.$$('tbody a');
                const imgArrays = await page.$$('tbody img');
                const arrPage = [];
                for (let styleNumber of elHandleArrays) {
                    const attr = await page.evaluate(el => el.getAttribute("href"), styleNumber);
                    const title = await page.evaluate(el => el.getAttribute("title"), styleNumber);
                    ListAnimeApi = [{
                        link: attr,
                        title
                    }, ...ListAnimeApi]
                    if (attr === `/phim/${end}`) {
                        arrPage.push(attr);
                        break;
                    } else {
                        arrPage.push(attr);
                    }
                }
                if (arrPage.findIndex(attr => attr === `/phim/${end}`) > -1) {
                    ListAnimeApi.splice(0, 1);
                    res.redirect('/getaxios');
                    await browser.close();
                } else {
                    startpage++;
                    GetAll();
                }
            }
        }
        function GetPageEnd() {
            (async () => {
                await page.goto(`https://ophim.cc/danh-sach/hoat-hinh?page=1`);
                let PageEnd = await page.$$(`[title="Trang cuối"]`);

                for (let styleNumber of PageEnd) {
                    const href = await page.evaluate(el => el.getAttribute("href"), styleNumber);
                    const index = href.indexOf("page=");
                    const pageEnd = href.slice(index + 5, href.length);
                    endpage = pageEnd;
                    GetAll();
                }
            }
            )();
        }
        GetPageEnd();
    }).sort({ $natural: -1 });
})
app.get('/getphim', (req, res) => {
    let html = ``;
    for (let i = 0; i < ListAnimeApi.length; i++) {
        const phim = ListAnimeApi[i];
        console.log(phim.img)
        html += `
                <div >
                    <p>${phim.title}</p>
                    <img src="${phim.img}" alt="" />
                </div>
                `
    }
    res.send(
        `
                <p>Tổng bộ phim : ${ListAnimeApi.length}</p>
                <div>
                    ${html}
                </div>
                `
    )
})
app.get('/All', async (req, res) => {
    let startpage = 1;
    let endpage = 71;
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 30
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1400,
        height: 1000,
    });
    async function GetAll() {
        if (startpage > endpage) {
            res.redirect('/getaxios');
            await browser.close();
        } else {
            await page.goto(`https://ophim.cc/danh-sach/hoat-hinh?page=${startpage}`);
            const elHandleArrays = await page.$$('tbody a');
            const imgArrays = await page.$$('tbody img');
            for (let styleNumber of elHandleArrays) {
                const attr = await page.evaluate(el => el.getAttribute("href"), styleNumber);
                const title = await page.evaluate(el => el.getAttribute("title"), styleNumber);
                ListAnimeApi = [{
                    link: attr,
                    title
                }, ...ListAnimeApi]
            }
            startpage++;
            GetAll();
        }
    }
    function GetPageEnd() {
        (async () => {
            await page.goto(`https://ophim.cc/danh-sach/hoat-hinh?page=1`);
            let PageEnd = await page.$$(`[title="Trang cuối"]`);

            for (let styleNumber of PageEnd) {
                const href = await page.evaluate(el => el.getAttribute("href"), styleNumber);
                const index = href.indexOf("page=");
                const pageEnd = href.slice(index + 5, href.length);
                endpage = pageEnd;
                GetAll();
            }
        }
        )();
    }
    GetPageEnd();
})
app.listen(process.env.PORT || 3001, () => {
    console.log('Server đang chay tren cong ' + process.env.PORT);
});
