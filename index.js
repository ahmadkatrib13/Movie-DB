const express = require('express')
const app = express()
app.listen(3000)
//step 2
// app.get(/\//, (req, res) => {
//   res.send('Ok')
// })

//step 3
app.get("/test",(req,res)=>{
    res.send( {status:200, message:"ok"})
})
app.get("/time",(req,res)=>{
    let date = new Date()
    res.send({status:200, message:`${date.getHours()}:${date.getMinutes()}`})
})
//step 4 
app.get(["/hello","/hello/:id"],(req,res)=>{
    res.send({status:200, message:`Hello, ${req.params.id || "Unkwon"}`})
})

app.get("/search",(req,res)=>{
    if(typeof req.query.s =="undefined" || req.query.s === "") res.send({status:500, error:true, message:"you have to provide a search"})
    else res.send( {status:200, message:"ok", data:req.query.s})
})

//step 5
const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]

app.get("/movies/create",(req,res)=>{
    res.send("create a movie")
})
app.get("/movies/read",(req,res)=>{
    res.send({status:200, data:movies })
})
app.get("/movies/update",(req,res)=>{
    res.send("update a movie")
})
app.get("/movies/delete",(req,res)=>{
    res.send("delete a movie")
})
