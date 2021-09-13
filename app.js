const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routes/User')
const walletRouter = require('./routes/Wallet')
const listingRouter = require('./routes/Listing');
const authRouter = require('./routes/Auth')
const tokenRouter = require('./routes/Token')
const cors = require("cors");
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose')

require('dotenv').config();
const {MONGO_PASSWORD} = process.env

const url = `mongodb+srv://duma_dev:${MONGO_PASSWORD}@cluster0.5yohj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(url)
    .then( () => {

        console.log('Connected to database ')
        // console.log('dropping database');
        // mongoose.connection.db.dropDatabase();
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

const corsOptions = {
  origin: ["http://localhost:3000"]
};

// Applying middlewares
app.use(cors(corsOptions));

// Bodyparser Middleware
app.use(bodyParser.json());

app.use('/users/', userRouter);
app.use('/listings/', listingRouter);
app.use('/auth/', authRouter);
app.use('/token/', tokenRouter);
app.use('/wallet/', walletRouter);

app.listen(3005, function(){
  console.log('App started on localhost:3005');
});
