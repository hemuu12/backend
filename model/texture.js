const mongoose = require("mongoose")

const textureTshirtSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true,
        trim: true
    },
    image: {
       type: String, 
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
})

const textureTshirtModel = mongoose.model("texturetshirt", textureTshirtSchema)

module.exports = {
    textureTshirtModel
}