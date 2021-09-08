const {generateToken, verifyToken} = require('../utils/tokenManager');

const user = {
  username: 'xFreak666',
  pass: 'looool'
}

generateToken(user).then(token => {
  verifyToken(token).then(user => console.log(user))
})