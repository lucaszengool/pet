const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  },
  icon: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  type: {
    type: DataTypes.ENUM('pet', 'service', 'product'),
    allowNull: false,
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'categories',
});

// Self-referencing associations without FK constraint (avoids SQLite DROP issues)
Category.hasMany(Category, { as: 'children', foreignKey: 'parent_id', constraints: false });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id', constraints: false });

module.exports = Category;
