const path = require("path");
const express = require("express");
const bodyparser = require("body-parser");
const rimraf = require('rimraf')
const multer = require("multer");
const fs = require("fs");
const generateID = require("./helpers/generateID");

const app = express();
app.set('view engine', 'ejs')


const maxSize = 10000 * 1024 * 1024;

setInterval(deleteFile, 2000);

app.use(express.static(path.resolve(__dirname + "/public/uploads"))); // Middleware for serving files
app.use('/static', express.static(path.join(__dirname, 'static'))) //static files here

const randomSep = generateID(7); // random string for used as a separator

const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: (req, file, callback) => {
        callback(
            null,
            generateID(15) + randomSep + file.originalname //save the files with random ID
        )
    }
});


const upload = multer({   //define upload params
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");

const uploadPath = __dirname + "/public/uploads"; //define uploadpath

var fileLife = {}; //stores the life of a file...assigned by the user...to be implemented

function deleteFile(){ // function to delete files after its life 
    fs.readdir(uploadPath, function (err, files) {
      files.forEach(function (file, index) {
        fs.stat(path.join(uploadPath, file), function (err, stat) {
          var endTime, now;
          if (err) {
            return console.error(err);
          }
          now = new Date().getTime();
          endTime = new Date(stat.ctime).getTime() + (1000 * 60 * 60 * 24); // offset is in milliseconds
          if (now > endTime) {
            return rimraf(path.join(uploadPath, file), function (err) {
              if (err) {
                return console.error(err);
              }
              console.log(`${file.split(randomSep)[1]} was deleted`);
            });
          }
        });
      });
    });
}


app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());




app.get("/", (req, res) => {
    res.render('index')
});

app.post('/uploadfile', (req, res) => {
    upload(req, res, err => {
        if (err) return res.end("Error uploading file." + err);
        res.json({
            path: req.file.filename
        })
    })
})


app.get('/files/:id', (req, res) => {
    console.log(req.params.id)
    res.render('displayfile', {path: req.params.id, randomSep: randomSep})
})

app.get('/download', (req, res) => {
    const pathOutput = req.query.path
    console.log(pathOutput)
    const fullPath = path.join(__dirname, pathOutput);
    res.download(fullPath, pathOutput.split(randomSep)[1] , err => {
        if (err) res.send(err);
    })
})

app.get('/dwn',(req,res)=>{
  res.render('displayfile')
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
})