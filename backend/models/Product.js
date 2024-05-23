const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type:String, required: true},
    img: {type:String, required: true},
    categories: {type: Array},
    size: {type: String},
    color: {type: String},
    price: {type: Number, required: true},
    isRemoved: {type:Boolean, default: false},

},
{timestamps:true},{versionKey: false}

);

module.exports = mongoose.model('Product', ProductSchema);