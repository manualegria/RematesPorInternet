const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const RoleSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, require: true },
    description: { type: String },
    isRemoved: { type: String, default: false },
  },
  { strict: true, timestamps: true, versionKey: false, _id: false }
)

module.exports = mongoose.model('Role', RoleSchema)
