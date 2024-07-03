const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const ProductSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
    },
    userId: {
      _id: { type: String },
      name: { type: String }
    },
    img: { type: String, required: true, match: /^https?:\/\// },
    categories: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    stock: { type: Number, required: true, min: 0 },
  },
  { strict: true, timestamps: true, versionKey: false, _id: false }
)
// Ejemplo de pre-save hook
ProductSchema.pre('save', function (next) {
  // Lógica personalizada antes de guardar
  if (this.stock === 0) {
    this.isActive = false
  } else {
    this.isActive = this.isActive !== undefined ? this.isActive : true
  }
  next()
})

module.exports = mongoose.model('Product', ProductSchema)
