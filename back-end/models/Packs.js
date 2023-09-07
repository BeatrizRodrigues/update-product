const { DataTypes } = require('sequelize')

const db = require('../db/db')

const Packs = db.define('packs', {
  pack_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    require: true,
  },
  qty: {
    type: DataTypes.INTEGER,
    require: true,
  },
},
{
  sequelize: db,
  timestamps: false,
  tableName: "packs",
})

module.exports = Packs