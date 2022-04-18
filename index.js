const path = require("path");
const express = require("express");
const bodyparser = require("body-parser");
const rimraf = require('rimraf')
const multer = require("multer");
const fs = require("fs");
const generateID = require("./helpers/generateID");

const app = express();
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render('index')
});