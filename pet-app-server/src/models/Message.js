const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user1_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user2_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  last_message: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  last_message_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  user1_unread: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  user2_unread: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'conversations',
  indexes: [
    { fields: ['user1_id'] },
    { fields: ['user2_id'] },
    { fields: ['last_message_at'] },
  ],
});

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  conversation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('text', 'image', 'voice', 'card'),
    defaultValue: 'text',
  },
  content: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  extra: {
    type: DataTypes.TEXT, // JSON for card messages etc.
    defaultValue: '{}',
    get() {
      const val = this.getDataValue('extra');
      return val ? JSON.parse(val) : {};
    },
    set(val) {
      this.setDataValue('extra', JSON.stringify(val));
    },
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'messages',
  indexes: [
    { fields: ['conversation_id'] },
    { fields: ['sender_id'] },
    { fields: ['receiver_id'] },
    { fields: ['created_at'] },
  ],
});

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('system', 'order', 'review', 'like', 'follow'),
    defaultValue: 'system',
  },
  title: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  content: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  link: {
    type: DataTypes.STRING(300),
    defaultValue: '',
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'notifications',
  indexes: [
    { fields: ['user_id'] },
    { fields: ['is_read'] },
  ],
});

module.exports = { Conversation, Message, Notification };
