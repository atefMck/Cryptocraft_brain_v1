const axios = require('axios');
const Token = require('../models/Token');

const getAccessToken = require('./axiosInstance');
const URL = 'https://kovan.cloud.enjin.io/graphql/default'

const query = `query  {
  EnjinApp {
    tokens {
      name
      icon
      meltFeeRatio
      meltValue
      metadata
      metadataURI
      nonFungible
      reserve
      supplyModel
      circulatingSupply
      mintableSupply
      totalSupply
      transferable
      variantMode
    }
  }
}`

getAccessToken()
  .then(token => {
    axios(URL, {
      method: 'post',
      data: {
        query,
      },
      headers: {'Authorization': `Bearer ${token}`}
    }).then(res => console.log(res.data.data.EnjinApp.tokens))
  })

