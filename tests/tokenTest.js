const {generateToken, verifyToken} = require('../utils/tokenManager');

const user = {
  username: 'Tyler1',
  pass: '!Gazza123!'
}

generateToken(user).then(token => {
  verifyToken(token).then(user => console.log(user))
})