const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Pet = require('./Pet');
const Service = require('./Service');
const Product = require('./Product');
const Order = require('./Order');
const Review = require('./Review');
const { Conversation, Message, Notification } = require('./Message');
const { Favorite, BrowseHistory, CartItem, Address } = require('./Favorite');

// ========== Associations ==========

// User -> Pets
User.hasMany(Pet, { foreignKey: 'user_id', as: 'pets' });
Pet.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });

// User -> Services
User.hasMany(Service, { foreignKey: 'user_id', as: 'services' });
Service.belongsTo(User, { foreignKey: 'user_id', as: 'provider' });

// User -> Products
User.hasMany(Product, { foreignKey: 'user_id', as: 'products' });
Product.belongsTo(User, { foreignKey: 'user_id', as: 'seller' });

// Category -> Pets/Services/Products
Category.hasMany(Pet, { foreignKey: 'category_id' });
Pet.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Service, { foreignKey: 'category_id' });
Service.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Orders
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'buyer' });
User.hasMany(Order, { foreignKey: 'merchant_id', as: 'merchant_orders' });
Order.belongsTo(User, { foreignKey: 'merchant_id', as: 'merchant' });

// Reviews
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'reviewer' });
Order.hasOne(Review, { foreignKey: 'order_id' });
Review.belongsTo(Order, { foreignKey: 'order_id' });

// Conversations & Messages
Conversation.hasMany(Message, { foreignKey: 'conversation_id', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id' });
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sent_messages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// Notifications
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Favorites & Browse History
User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(BrowseHistory, { foreignKey: 'user_id' });
BrowseHistory.belongsTo(User, { foreignKey: 'user_id' });

// Cart & Address
User.hasMany(CartItem, { foreignKey: 'user_id', as: 'cart' });
CartItem.belongsTo(User, { foreignKey: 'user_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Product.hasMany(CartItem, { foreignKey: 'product_id' });

User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Category,
  Pet,
  Service,
  Product,
  Order,
  Review,
  Conversation,
  Message,
  Notification,
  Favorite,
  BrowseHistory,
  CartItem,
  Address,
};
