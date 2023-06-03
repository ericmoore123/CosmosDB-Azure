const express = require("express");
const app = express();
const port = 3000;

const { createUser, queryContainer } = require('./src/app');
const ItemSchema = require('./src/model/Item');

// const bodyParser = require('body-parser');
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
// assuming POST: name=foo&color=red       <-- URL encoding
// or  POST: {"name":"foo","color":"red"}  <-- JSON encoding

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/static/index.html');
});

// Create item route
app.post('/submitData', async(req, res) => {
    const { id, fname, lname, empStatus, empRole, employer } = req.body;

    let newItem = new ItemSchema(id, fname, lname, empStatus, empRole, employer);
    createUser(newItem);

    res.send(await queryContainer());
});


app.listen(port, () => console.log(`App listening on port: ${port}`));