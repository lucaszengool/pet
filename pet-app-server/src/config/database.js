const { Sequelize } = require('sequelize');
const config = require('./index');

let sequelize;

if (config.db.dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.db.storage,
    logging: config.env === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true, // soft delete
    },
  });
} else {
  sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    logging: config.env === 'development' ? console.log : false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
    timezone: '+08:00',
  });
}

module.exports = sequelize;
