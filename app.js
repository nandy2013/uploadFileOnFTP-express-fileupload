const express = require("express");
const app = express();
const http = require("http").Server(app).listen(3000);
const upload = require("express-fileupload");
const PromiseFtp = require("promise-ftp");
const ftp = new PromiseFtp();
const ftpConfig = require("./config/keys");
//const fs = require('fs');

app.use(upload());

console.log("Server Started");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
}
)

app.post("/", function (req, res) {
  if (req.files) {
    //console.log(req.files);
    const file = req.files.filename;
    const filename = file.name;

    file.mv("./upload/" + filename, function (err) {
      if (err) {
        console.log(err);
        res.send("error occured");
      }
      else {
        ftp.connect({
          host: ftpConfig.host,
          user: ftpConfig.userName,
          password: ftpConfig.pwd
        })
          .then(function (serverMessage) {
            console.log("Server message: " + serverMessage);
            return (
              ftp.put(
                "./upload/" + filename, ftpConfig.destPath + filename
              )
            );
          }).then(function (serverMessage) {
            return ftp.end();
          })
        res.send("Done");
      }
    })
  }
})

