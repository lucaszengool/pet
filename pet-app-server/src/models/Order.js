const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_no: {
    type: DataTypes.STRING(32),
    unique: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  merchant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  order_type: {
    type: DataTypes.ENUM('service', 'product', 'pet'),
    allowNull: false,
  },
  // Polymorphic: item_type + item_id point to the ordered entity
  item_type: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  item_title: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  item_image: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  item_spec: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  shipping_fee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  pay_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(
      'pending',     // 待付款
      'paid',        // 已付款/待服务
      'accepted',    // 商家已接单
      'serving',     // 服务中/配送中
      'completed',   // 已完成
      'reviewed',    // 已评价
      'cancelled',   // 已取消
      'refunding',   // 退款中
      'refunded'     // 已退款
    ),
    defaultValue: 'pending',
  },
  payment_method: {
    type: DataTypes.STRING(20),
    defaultValue: '',
  },
  payment_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Booking info (for service orders)
  booking_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  booking_time: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  // Shipping info (for product orders)
  receiver_name: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  receiver_phone: {
    type: DataTypes.STRING(20),
    defaultValue: '',
  },
  receiver_address: {
    type: DataTypes.STRING(300),
    defaultValue: '',
  },
  tracking_no: {
    type: DataTypes.STRING(50),
    defaultValue: '',
  },
  // Notes & Extras
  remark: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  merchant_remark: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  cancel_reason: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'orders',
  indexes: [
    { unique: true, fields: ['order_no'] },
    { fields: ['user_id'] },
    { fields: ['merchant_id'] },
    { fields: ['status'] },
    { fields: ['created_at'] },
  ],
});

module.exports = Order;
