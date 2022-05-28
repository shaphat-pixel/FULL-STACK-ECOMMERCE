const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, "Please enter a name of the product"],
        trim:true,
        maxlength: [30, "Product cannot be more than 30 charaters"]

    },
    description:{
        type: String,
        required: [true, "please add a description of your product"],
        maxlength: [4000, "Description cannot exceed 4000 characters"]

    },
    price:{
        type: Number,
        required: [true, "please add a price for your product"],
        maxlength: [8, "price cannot exceed 8 characters"],

    },
    dicountPrice:{
        type: String,
        maxlength: [4, 'Dicount cannot exceed 4 charcaters'],
    },
    color:{
        type: String,

    },
    size:{
        type: String,
    },
    ratings:{
        type: Number,
        default: 0,
    },
    images:[
        {
            public_id:{
                type: String,
                required:true,
            },
            url:{
                type: String,
                required:true,
            }
        }
    ],
    category:{
        type: String,
        required: [true, "PLease add a category of your product"],

    },
    stock:{
        type: Number,
        required: [true, "PLease add some stock for your product"],
        maxlength: [4, "Stock cannot exceed 4 characters"],

    },

    numOfReviews:{
        type: Number,
        default: 0,
    },
    reviews:[
        {
            user:{
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type:String,

            },
            time:{
                type:Date,
                default: Date.now()
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        
    },
    createAt: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model("Product", productSchema)