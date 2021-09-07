require('dotenv').config();
const {ENJIN_PROJECT_ID, ENJIN_PROJECT_SECRET} = process.env
const { GraphQLClient, gql } = require('graphql-request')

const getAuthClient = async () => {
  const endpoint = 'https://kovan.cloud.enjin.io/graphql/default'

  const graphQLClient = new GraphQLClient(endpoint);

  const query = gql`
  query RetrieveAppAccessToken {
    AuthApp(id: ${ENJIN_PROJECT_ID}, secret: "${ENJIN_PROJECT_SECRET}") {
      accessToken
      expiresIn
    }
  }
  `

  const data = await graphQLClient.request(query)
  const token = data.AuthApp.accessToken;
  
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: 'Bearer ' + token,
    }
  })
}

module.exports = getAuthClient;
