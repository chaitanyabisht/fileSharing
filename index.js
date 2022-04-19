const path = require("path");
const express = require("express");
const bodyparser = require("body-parser");
const rimraf = require('rimraf')
const multer = require("multer");
const fs = require("fs");
const generateID = require("./helpers/generateID");
const nodemailer = require('nodemailer')
require('dotenv').config()

const app = express();
app.set('view engine', 'ejs')

const PORT = process.env.PORT || 3000;
const maxSize = 4 * 1024 * 1024 * 1024;

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

function clearFiles(){
  fs.readdir(uploadPath, (err, files) => {
    files.forEach(file => {
      const filepath = path.join(uploadPath, file)
      return rimraf(filepath, e => {
        if (e) throw e
        console.log(`${file} was deleted as server restarts`)
      })
    })
  })
}
clearFiles()

function deleteFile(){ // function to delete files after its life 
    // console.log(JSON.stringify(fileLife))
    fs.readdir(uploadPath, function (err, files) {
      files.forEach(function (file, index) {
        const filepath = path.join(uploadPath, file)
        fs.stat(filepath, function (err, stat) {
          const filename = filepath.split('/').pop()
          var endTime, now;
          if (err) {
            return console.error(err);
          }
          now = new Date().getTime();
          // console.log(filename)
          // console.log(JSON.stringify(fileLife))
          console.log(`life: ${Number(fileLife[filename])}`)
          endTime = new Date(stat.ctime).getTime() + (1000 * 60 * 60 * Number(fileLife[filename])); // offset is in milliseconds
          if (now > endTime) {
            return rimraf(filepath, function (err) {
              if (err) {
                return console.error(err);
              }
              console.log(`${file.split(randomSep)[1]} was deleted`);
              delete fileLife[filename]
            });
          }
        });
      });
    });
}


app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASSWORD
  }
});



app.get("/", (req, res) => {
    res.render('index')
});

app.post('/uploadfile', (req, res) => {
    upload(req, res, err => {
        if (err) return res.end("Error uploading file." + err);
        if (req.body.mail != "") {
          const mailOptions = {
            from: process.env.GMAIL_ID,
            to: req.body.email,
            subject: 'fileShare: Download file',
            text: "Download Link: "+req.get('origin') + '/files/' + req.file.filename
          }; 
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log(`Email sent to ${req.body.email} ` + info.response);
            }
          });
        }
        fileLife[req.file.filename] = req.body.time;
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


app.get('*', (req, res) => {
    res.status = 404;
    res.render('404')
})


app.listen(PORT, () => {
    console.log("Server started on port 3000");
})