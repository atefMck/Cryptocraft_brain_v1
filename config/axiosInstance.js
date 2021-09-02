const axios = require('axios');

module.exports = (appID, appSecret) => {
  return new Promise((resolve, reject) => {
    axios({
      url: 'https://kovan.cloud.enjin.io/graphql/default',
      method: 'post',
      data: {
        query: `
        query RetrieveAppAccessToken {
          AuthApp(id: ${appID}, secret: "${appSecret}") {
            accessToken
            expiresIn
          }
        }`
      }
    })
    .then(result => {
      resolve(result.data.data.AuthApp.accessToken);
    })
    .catch(err => reject(err))
  })
}

