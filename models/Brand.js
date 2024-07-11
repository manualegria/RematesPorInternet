const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const SizeSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    description: { type: String },
    isRemoved: {type: Boolean, default: false }
  },
  { strict: true, timestamps: true, versionKey: false, _id: false }
)

module.exports = mongoose.model('Brand', SizeSchema)
