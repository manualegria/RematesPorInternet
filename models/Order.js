const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const OrderSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: 'pending' },
    date: { type: Date, default: Date.now },
    isRemoved: { type: Boolean, default: false },
  },
  { strict: true, timestamps: true, versionKey: false, _id: false }
)

module.exports = mongoose.model('Order', OrderSchema)
