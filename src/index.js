const express = require('express');
var bodyParser = require('body-parser');
const mongoose=require('mongoose')
const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Yogesh_Mjs:U9bUHeuLxXaOhj4j@cluster0.8e1bd.mongodb.net/Yogesh_Mjs_DB?retryWrites=true&w=majority", {
    useNewUrlParser: true

})
.then(() => { console.log('MongoDB is Connected ') })
.catch(err => { console.log('Error connecting to MongoDB: ' + err) });

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
