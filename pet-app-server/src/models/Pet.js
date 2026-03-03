const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pet = sequelize.define('Pet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: { len: [4, 100] },
  },
  breed: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  age: {
    type: DataTypes.STRING(30),
    defaultValue: '',
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'unknown'),
    defaultValue: 'unknown',
  },
  vaccine: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  deworming: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  sterilized: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  price_type: {
    type: DataTypes.ENUM('fixed', 'negotiable', 'contact'),
    defaultValue: 'fixed',
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  images: {
    type: DataTypes.TEXT, // JSON array of image URLs
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('images');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('images', JSON.stringify(val));
    },
  },
  contact: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  city: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  address: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    defaultValue: 0,
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('active', 'sold', 'pending', 'rejected', 'closed'),
    defaultValue: 'pending',
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  favorite_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'pets',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['category_id'] },
    { fields: ['status'] },
    { fields: ['city'] },
    { fields: ['created_at'] },
  ],
});

module.exports = Pet;
