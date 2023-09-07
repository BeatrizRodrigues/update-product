const { DataTypes } = require('sequelize')

const db = require('../db/db')

const Products = db.define('products', {
  code: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
  },
  cost_price: {
    type: DataTypes.DECIMAL,
  },
  sales_price: {
    type: DataTypes.DECIMAL,
    require: true,
  }
},
{
  sequelize: db,
  timestamps: false,
  tableName: "products",
})

module.exports = Products