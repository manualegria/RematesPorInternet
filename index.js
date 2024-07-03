
require('dotenv').config()
const express = require('express')
const mercadopago = require('mercadopago')
const cors = require('cors')
const app = express()
require('./db')

// Importación de rutas
const userRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const orderRoute = require('./routes/order')
const brandRoute = require('./routes/brand')
const categoryRoute = require('./routes/category')
const roleRoute = require('./routes/role')

// Configuración de MercadoPago
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
})

const PORT = process.env.PORT

// Middlewares
app.use(cors())
app.use(express.json())

app.get('/api', (req, res) => {
  res.send('Hello World')
})

// Uso de rutas
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/products', productRoute)
app.use('/api/carts', cartRoute)
app.use('/api/orders', orderRoute)
app.use('/api/brands', brandRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/roles', roleRoute)

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})

