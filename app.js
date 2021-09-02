const express = require('express');
const app = express();
const axios = require('axios');
const getAccessToken = require('./config/axiosInstance');
require('dotenv').config();
const {ENJIN_PROJECT_ID, ENJIN_PROJECT_SECRET} = process.env

const mongoose = require('mongoose');

//DB setup
mongoose.connect('mongodb://mongo:27017');

getAccessToken(ENJIN_PROJECT_ID, ENJIN_PROJECT_SECRET)
  .then(token => {

    const query = `
      query GetTokenDetails($name: String!) {
        EnjinTokens(name: $name, pagination: {page: 1, limit: 50}) {
          id
          name
          creator
        }
      }
    `
    axios({
      url: 'https://kovan.cloud.enjin.io/graphql/default',
      method: 'post',
      data: {
        query,
        variables: { name: "Test Assetttt" },
      },
      headers: {
        'Authorization': token
      }
    }).then(result => console.log(result.data.data.EnjinTokens))

  })


app.listen(3000, function(){
  console.log('Heloo mfkerssss');
});
