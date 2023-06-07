const express = require("express");
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

const { createUser, queryContainer } = require('./src/app');
const ItemSchema = require('./src/model/Item');
const { container } = require("./src/config/config");

// const bodyParser = require('body-parser');
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
// assuming POST: name=foo&color=red       <-- URL encoding
// or  POST: {"name":"foo","color":"red"}  <-- JSON encoding

app.get("/", (req, res, next) => {
    res.render('index');
    //     const baseData = await queryContainer();
    //     //     console.log(await baseData)

    //     const page = await ejs.renderFile('./views/index.ejs', { data: await queryContainer() }, { async: true });
    //     res.send(page);
});


// Create item route
app.post('/submitData', async(req, res) => {
    const { id, fname, lname, empStatus, empRole, employer } = req.body;

    let newItem = new ItemSchema(id, fname, lname, empStatus, empRole, employer);
    createUser(newItem);

    // Query most recently created db item      
    //     res.send(await queryContainer());
    const newestItem = await queryContainer()
        .then(res => res.render('index', { data: res }))
        //     Redirect back to home page with query data below form?
        //     res.render('/', { data: await queryContainer() });
});

app.listen(port, () => console.log(`App listening on port: ${port}`));