const express = require('express')
const cors = require('cors')
const mysql = require('mysql');

const conn = require('./db/db.js')

const app = express()

app.use(express.json())

app.use(cors())

const ProductsRoutes = require('./routes/ProductsRoutes.js')
const PacksRoutes = require('./routes/PacksRoutes.js')

app.use('/products', ProductsRoutes)
app.use('/packs', PacksRoutes)

conn
  .sync()
  .then(() => {
    app.listen(3000)
  })
  .catch((err) => console.log(err))
