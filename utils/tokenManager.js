const jwt = require('jsonwebtoken');
const { Promise } = require('mongoose');
require('dotenv').config();
const {SECRET_KEY, TOKEN_EXPIRE_SECONDS} = process.env

const generateToken = ({userId, username}) => {
  return new Promise((resolve, reject) => {
    jwt.sign({userId, username}, SECRET_KEY, { expiresIn: parseInt(TOKEN_EXPIRE_SECONDS) }, (err, token) => {
      if (err) {
        reject(new Error('Token generation unsuccessful'))
      }
      resolve(token)
    })
  })
}

const verifyToken = (req, res, next) => {
  const authHeader = req.header('authorization')
  const token = authHeader && authHeader.split(' ')[1]
  if (token === null) return res.sendStatus(401)

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {console.log("Invalid token"); return res.sendStatus(403)}
      req.userId = decoded.userId
      req.username = decoded.username
      next()
  })
}

module.exports = {
  generateToken,
  verifyToken
}
