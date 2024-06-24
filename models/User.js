const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    fullName: { type: String, require: true },
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      _id: { type: String, require: true },
      name: { type: String, require: true },
    },
    isRemoved: { type: Boolean, default: false },
  },
  { strict: true, timestamps: true, versionKey: false, _id: false }
)

module.exports = mongoose.model('User', UserSchema)
