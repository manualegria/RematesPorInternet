const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

// Definición del modelo Category
const CategorySchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    description: { type: String },
  },
  { strict: true, timestamps: true, versionKey: false, _id: false }
)

module.exports = mongoose.model('Category', CategorySchema)
