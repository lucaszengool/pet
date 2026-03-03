const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Polymorphic review target
  target_type: {
    type: DataTypes.ENUM('pet', 'service', 'product'),
    allowNull: false,
  },
  target_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
  content: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  images: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const val = this.getDataValue('images');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('images', JSON.stringify(val));
    },
  },
  // Merchant reply
  reply: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  reply_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  is_anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'reviews',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['target_type', 'target_id'] },
    { fields: ['order_id'] },
  ],
});

module.exports = Review;
