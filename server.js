const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
var cors = require('cors');
const { readFile } = require('fs');
const app = express();

var corsOptions = {
  origin: 'https://gatekeep.magic-ai.org',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.use(express.json());
app.use(cors({ origin: 'https://gatekeep.magic-ai.org' }));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://gatekeep.magic-ai.org');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});





app.get("/api",cors(corsOptions), (req, res) => {
    res.json({"message": "Hello from server!"});
});

app.post("/api", cors(corsOptions), async (req, res) => {

  const data = req.body

  async function listDir() {
    try {
      var users = readFile('./users.json', 'utf8')
      console.log(JSON.stringify(users))
      
    } catch (err) {
      console.error('Error occurred while reading directory!', err);
    }
  }

  await listDir();

    
});
  
  

app.listen(5000, () => {console.log("server started on port 80")});