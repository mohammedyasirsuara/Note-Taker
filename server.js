const PORT = process.env.PORT || 3000
const path = require("path");
const express = require("express");
let fs = require("fs");
let db = require("./db/db.json");
const { Console } = require("console");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//static content for the app from the public directory
app.use(express.static("public"));

//route to return the notes.html file
app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname, "/public/notes.html"))
})

//route to read the db.json file 
app.get("/api/notes", function(req,res){
    res.json(db)
})

//route to save a new note and post it to the client 
app.post("/api/notes", async (req,res)=>{
    let newNote = {
        title: req.body.title,
        text: req.body.text,
        id: db.length+1
    }
    db.push(newNote)
    console.log(db)
    fs.writeFile("./db/db.json", JSON.stringify(db), (err)=>{
        if(err) throw err;
        console.log("Note Added!")
        res.json(db)
    })
})

//route to read the db.json file 
app.delete("/api/notes/:id", async (req, res) => {
    const deleteId = req.params.id;
    console.log(deleteId);
    try {
      if (deleteId) {
        db = db.filter(function (val) {
          return val.id != deleteId;
        });
      }
      return res.json(db);
    } catch {
      res.status(500).json(err);
    }
  });

//route to return the index.html file
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.listen(PORT, () =>
  console.log(`App is listening on: http://localhost:${PORT}`)
);