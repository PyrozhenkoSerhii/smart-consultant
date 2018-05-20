const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const chatModule = require('./chat');
const config = require('./config/database');
const passport = require('passport');
const port = process.env.PORT || 8000;

//db connection
mongoose.connect(config.connectionString, (err) => {
        if (err) console.log('Database error' + err);
        else {
            console.log('Connected to database ' + config.dbName);
            chatModule.socketCreation();
        }
    }
);

const app = express();

//modules usage
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public')));
app.use(passport.initialize());
app.use(passport.session());


//routes
const customers = require('./routes/customers');
app.use('/customers', customers);
const companies = require('./routes/companies');
app.use('/companies', companies);
const consultants = require('./routes/consultants');
app.use('/consultants', consultants);
const products = require('./routes/products');
app.use('/products', products);


app.get('*',function (req,res) {
    res.sendFile(path.join(__dirname,'./public/index.html'))
});

app.listen(port, () => {
    console.log('Main server app listening on port ' + port);
});
