const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const getAccessToken = require('./config/axiosInstance');
const userRouter = require('./routes/User')

require('dotenv').config();
const {ENJIN_PROJECT_ID, ENJIN_PROJECT_SECRET} = process.env

const mongoose = require('mongoose');

//DB setup
mongoose.connect('mongodb://mongo:27017');

// Bodyparser Middleware
app.use(bodyParser.json());

app.use('/users/', userRouter);

app.listen(3000, function(){
  console.log('Heloo mfkerssss');
});
