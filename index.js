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