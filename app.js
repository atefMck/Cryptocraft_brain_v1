const express = require('express');
const app = express();

const mongoose = require('mongoose');
const User = require('./models/test');

//DB setup
mongoose.connect('mongodb://mongo:27017');

app.get('/create', function(req, res){
  const newUser = new User({
    first_name: 'req.body.first_name',
    last_name: 'req.body.last_name',
    password: 'req.body.password',
    gender: 'Male',
    date_of_birth: Date.now(),
    address: "req.body.address",
    phone: 58815090,
  });
  newUser.save().then(user => res.json(user));
});

app.get('/', function(req, res){
  User.find({})
    .then(data => res.send(data))
});


app.listen(3005, function(){
  console.log('Heloo mfkerssss');
});