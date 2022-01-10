const express = require('express')
const app = express()
const mongoose = require('mongoose');
app.listen(3000)
app.use(express.json());

const uri = "mongodb+srv://admin:admin@cluster0.7go78.mongodb.net/movie-db?retryWrites=true&w=majority"

//connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});


const schemaMovies = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        default: 1900

    },
    rating: {
        type: Number,
        default: 4
    }

}, { versionKey: false });

const movies = mongoose.model('movies', schemaMovies);
const usersArray = [{ username: "admin", password: "admin" }, { username: "ahmad", password: "p@ssword" }]


const checkAuth = (username,password)=>{
   let acceptPass = false;
   let acceptUsername = false;
   if(!username) return -1//not authorized if username missed
    for(let i=0;i<usersArray.length-1;i++){
        if(username == usersArray[i].username)
            if(password== usersArray[i].password) acceptPass = true
            acceptUsername=true
            break
    }
    if(acceptPass&&acceptUsername) return 0;//acceptable username and pass
    if(acceptUsername) return 1;//acceptable username but wrong pass
    return -1;//wrong username and password
}

app.get("/users", (req, res) => {
    res.send({
        status: 200, users: usersArray
        
    })
})
app.get("/users/read/id/:id",(req,res)=>{
    let id = req.params.id.trim()
    if(usersArray[id]) res.send({ status: 200, users: usersArray[id] })
    else{ 
        res.status(404).send({ status: 404, error: true, message:`the user ${id || 'Unknown'} does not exist` })
}
})

app.post("/users/add",(req, res) => {
      let usernames = usersArray.map(user => user.username)
    if(req.query.username && !(usernames.includes(req.query.username))) {
        if ((/^\S{8,}$/).test(req.query.password)) {
            usersArray.push({username:req.query.username,password:req.query.password})
            res.send({ status: 200, users: usersArray })
        } else res.status(404).send("error, passowrd should be at least of size 8")
    }else res.status(404).send("error, username may be already exist or undifined")
})

app.delete("/users/delete/:id",(req,res)=>{
    let id = req.params.id.trim()
    if(usersArray[id]){
        usersArray.splice(id, 1);
        res.send({ status: 200, users: usersArray})
    }else{
        res.status(404).send(`error, user <${id || "unkown"}> does not exist or undifined`)
    }
})

app.put("/users/update/:id",(req,res)=>{
    let id = req.params.id.trim()
    if(usersArray[id]){
        if (req.query.username) usersArray[id].username = req.query.username
        if (req.query.password && (/^\S{8,}$/).test(req.query.password)) usersArray[id].password = req.query.password
        res.send({ status: 200, users: usersArray })
    }else{
        res.status(404).send(`error, user <${id || "Unkown"}> does not exist or undifined`)
        }})


        
//step 2
//--for all routes
// app.get(/\//, (req, res) => {
//   res.send('Ok')
// })
//--for just the root route
app.get("/", (req, res) => {
    res.send('Ok')
})



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
    if (typeof req.query.s == "undefined" || req.query.s === "") res.status(500).send({ status: 500, error: true, message: "you have to provide a search" })
    else res.send({ status: 200, message: "ok", data: req.query.s })
})

//step 5
// const movies = [
//     { title: 'Jaws', year: 1975, rating: 8 },
//     { title: 'Avatar', year: 2009, rating: 7.8 },
//     { title: 'Brazil', year: 1985, rating: 8 },
//     { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
// ]

app.post("/movies/create", (req, res) => {
    res.send("create a movie")
})
app.get("/movies/read", (req, res) => {
    movies.find()
        .then(moviesData => {
            res.send({ status: 200, data: moviesData });
        }).catch(err => {
            console.log("error, no entry found")
        })

})
app.put("/movies/update", (req, res) => {
    res.send("update a movie")
})
app.delete("/movies/delete", (req, res) => {
    res.send("delete a movie")
})

//step 6
app.get("/movies/read/by-date", (req, res) => {
    movies.find()
        .then(moviesData => {
            res.send({ status: 200, data: moviesData.sort((a, b) => b.year - a.year) })
        }).catch(err => {
            console.log("error, no entry found")
        })
});

app.get("/movies/read/by-rating", (req, res) => {
    movies.find()
        .then(moviesData => {
            res.send({
                status: 200, data: moviesData.sort((a, b) => b.rating - a.rating)
            })
        }).catch(err => {
            console.log("error, no entry found")
        })
});

app.get("/movies/read/by-title", (req, res) => {
    movies.find()
        .then(moviesData => {
            res.send({
                status: 200, data: moviesData.sort((a, b) => (a.title).localeCompare(b.title))
            })
        }).catch(err => {
            console.log("error, no entry found")
        })
});
//step 7
app.get("/movies/read/id/:id", (req, res) => {

    movies.findById(req.params.id).then(movieData => {
        res.send({ status: 200, data: movieData })
    }).catch(err => {
        res.status(404).send({ status: 404, error: true, message: `the movie '${req.params.id || 'Unknown'}' does not exist` });
    })

});
//step 8
app.post("/movies/add", (req, res) => {
    let authorized =checkAuth(req.query.username,req.query.password)
    if(authorized == -1) res.status(500).send({status:500,error:true,message:'you cannot create movie without providing exist username and password'})
    else if(authorized == 1) res.status(500).send({status:500,error:true,message:'wrong password , unauthorized operation'})
    else
    if (req.query.title && req.query.year && (/^[1-9]\d{3}$/).test(req.query.year)) {
        // title not missing  //year not missing //4 digits and a number
        movies.create({
            title: req.query.title,
            year: req.query.year,
            rating: (req.query.rating && Number(req.query.rating) <= 10 && Number(req.query.rating) > 0) ? Number(req.query.rating) : 4
        }
        ).then(newMovie => {
            movies.find()
                .then(moviesData => {
                    res.send({ status: 200, data: moviesData });
                }).catch(err => {
                    console.log("error, no entry found")
                })

        }).catch(err => { "error, connot create element" });
        //if rating is not a number or missing push 4 instead
    } else res.status(403).send({ status: 403, error: true, message: 'you cannot create a movie without providing a title and a year' });
});
//step 9
app.delete("/movies/delete/:id", (req, res) => {
    let authorized =checkAuth(req.query.username,req.query.password)
    if(authorized == -1) res.status(500).send({status:500,error:true,message:'you cannot create movie without providing exist username and password'})
    else if(authorized == 1) res.status(500).send({status:500,error:true,message:'wrong password , unauthorized operation'})
    else
    movies.findByIdAndDelete(req.params.id).then(deletedMovie => {
        movies.find().then(moviesData => {
            res.send({ status: 200, data: moviesData });
        }).catch(err => {
            console.log("error, no entry find")
        })
    }).catch(err => {
        res.status(404).send({ status: 404, error: true, message: `the movie '${req.params.id}' does not exist` });
    })
});
//step 10
app.put("/movies/update/:id", (req, res) => {
    let authorized =checkAuth(req.query.username,req.query.password)
    if(authorized == -1) res.status(500).send({status:500,error:true,message:'you cannot create movie without providing exist username and password'})
    else if(authorized == 1) res.status(500).send({status:500,error:true,message:'wrong password , unauthorized operation'})
    else
    movies.findById(req.params.id).then(async (doc, err) => {

        //check if title provided
        if (req.query.title) doc.title = req.query.title
        //check if rating provdided and is number
        if (req.query.rating && Number(req.query.rating) >= 0 && Number(req.query.rating) < 10) doc.rating = Number(req.query.rating)
        //check if year  providded and 4 digits
        if (req.query.year && (/^[1-9]\d{3}$/).test(req.query.year)) doc.year = req.query.year
        await doc.save()
        movies.find().then(moviesData => {
            res.send({ status: 200, data: moviesData });
        }).catch(err => {
            console.log("error, no entry find")
        })


    }).catch(err => {
        res
            .status(404)
            .send({ status: 404, error: true, message: `the movie '${req.params.id}' does not exist` })
    })
});


