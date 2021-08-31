const Sequelize = require("sequelize");
const dbName = "cryptocraft_dev";
const dbUsername = "tunicraft";
const dbPassword = "DirrabOmmek";
const dbHost = "localhost";
const dbDialect = "mysql";
const dbPool = {
  max: 5,
  min: 0,
  acquire: 30000,
  idle: 10000
}

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
  operatorsAliases: 0,

  pool: {
    max: dbPool.max,
    min: dbPool.min,
    acquire: dbPool.acquire,
    idle: dbPool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;