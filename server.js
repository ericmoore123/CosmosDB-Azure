const express = require("express");
const app = express();
const port = 3000;

const functions = require('./app');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
// assuming POST: name=foo&color=red       <-- URL encoding
// or  POST: {"name":"foo","color":"red"}  <-- JSON encoding

app.get("/", (req, res) => {
     res.sendFile(__dirname + '/static/index.html');
});

app.post('/submitData', async (req, res) => {
     const data = req.body;

     // Create id generator
     // const id = functions.generateId();

     functions.createUser( // replace with schema/model system 
          {
               "id": data.id,
               "fName": data.fName,
               "lName": data.lName,
               "employment": [
                   {
                       "status": data.empStatus,
                       "role": data.empRole,
                       "employer": data.employer
                   }
               ]
             }
     )
     await functions.queryContainer()
          .then(data => res.send(data));
});


app.listen(port, () => console.log(`App listening on port: ${port}`));
