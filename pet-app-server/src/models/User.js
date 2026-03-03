const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
    validate: { is: /^1[3-9]\d{9}$/ },
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING(50),
    defaultValue: '宠物达人',
  },
  avatar: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'unknown'),
    defaultValue: 'unknown',
  },
  bio: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  role: {
    type: DataTypes.ENUM('user', 'merchant', 'admin'),
    defaultValue: 'user',
  },
  status: {
    type: DataTypes.ENUM('active', 'banned', 'inactive'),
    defaultValue: 'active',
  },
  // Merchant-specific fields
  shop_name: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  shop_address: {
    type: DataTypes.STRING(300),
    defaultValue: '',
  },
  shop_phone: {
    type: DataTypes.STRING(20),
    defaultValue: '',
  },
  business_license: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    defaultValue: 0,
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    defaultValue: 0,
  },
  city: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  sign_in_days: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  last_sign_in: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
  },
});

User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toSafeJSON = function () {
  const obj = this.toJSON();
  delete obj.password;
  delete obj.deletedAt;
  return obj;
};

module.exports = User;
