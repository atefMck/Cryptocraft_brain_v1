const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routes/User')
const listingRouter = require('./routes/Listing');
const authRouter = require('./routes/Auth')
const cors = require("cors");



const mongoose = require('mongoose');

//DB setup
mongoose.connect('mongodb://mongo:27017', () => {
  // console.log('dropping database');
  // mongoose.connection.db.dropDatabase();
});

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

app.listen(3005, function(){
  console.log('App started on localhost:3005');
});
