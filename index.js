const express = require('express')
const { addListener } = require('nodemon')
const app = express()
app.listen(3000)
//step 2
//--for all routes
// app.get(/\//, (req, res) => {
//   res.send('Ok')
// })
//--for just the root route
// app.get("/", (req, res) => {
//   res.send('Ok')
// })

//step 3
app.get("/test", (req, res) => {
    res.send({ status: 200, message: "ok" })
})
app.get("/time", (req, res) => {
    let date = new Date()
    res.send({ status: 200, message: `${date.getHours()}:${date.getMinutes()}` })
})
//step 4 
app.get(["/hello", "/hello/:id"], (req, res) => {
    res.send({ status: 200, message: `Hello, ${req.params.id || "Unkwon"}` })
})

app.get("/search", (req, res) => {
    if (typeof req.query.s == "undefined" || req.query.s === "") res.send({ status: 500, error: true, message: "you have to provide a search" })
    else res.send({ status: 200, message: "ok", data: req.query.s })
})

//step 5
const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]

app.get("/movies/create", (req, res) => {
    res.send("create a movie")
})
app.get("/movies/read", (req, res) => {
    console.log(movies);
    res.send({ status: 200, data: movies })
})
app.get("/movies/update", (req, res) => {
    res.send("update a movie")
})
app.get("/movies/delete", (req, res) => {
    res.send("delete a movie")
})

//step 6
app.get("/movies/read/by-date", (req, res) => {
    res.send({ status: 200, data: [...movies].sort((a, b) => b.year - a.year) })
});

app.get("/movies/read/by-rating", (req, res) => {
    res.send({
        status: 200, data: [...movies].sort((a, b)=>b.rating-a.rating)
    })
});

app.get("/movies/read/by-title", (req, res) => {
    res.send({
        status: 200, data: [...movies].sort((a, b) => (a.title).localeCompare(b.title))
    })
});

app.get(["/movies/read/id/","/movies/read/id/:id"], (req, res) => {
    let id = Number(req.params.id)
    if(id>=0 && id<movies.length) res.send({status:200, data:movies[id]});
    else res.status(404).send({status:404, error:true, message:`the movie '${req.params.id || 'Unknown'}' does not exist`});
});

app.get("/movies/add",(req, res) => {
    //?title=<TITLE>&year=<YEAR>&rating=<RATING>
    if(req.query.title && req.query.year && (/^[1-9]\d{3}$/).test(req.query.year)){
    // title not missing  //year not missing //4 digits and a number
    movies.push({title: req.query.title, year: req.query.year, rating: (req.query.rating && Number(req.query.rating)<=10 && Number(req.query.rating)>0)?Number(req.query.rating):4})
    //if rating is not a number or missing push 4 instead
    res.send({ status: 200, data: movies })
    }else res.status(403).send({status:403, error:true, message:'you cannot create a movie without providing a title and a year'});
});
