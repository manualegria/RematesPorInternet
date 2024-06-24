const mongoose = require('mongoose')

console.log()
const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    isRemoved: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
)

module.exports = mongoose.model('Cart', CartSchema)
