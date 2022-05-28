const Product = require("../models/ProductModel.js")
const ErrorHandler = require("../utils/ErrorHandler.js")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Features = require("../utils/Features")

// create product
exports.createProduct = catchAsyncErrors(async (req, res, next)=>{
const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
})


exports.getAllProducts = catchAsyncErrors(async (req, res)=>{
    const resultPerPage = 8

    const productCount = await Product.countDocuments()
    const features = new Features(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
    
    const products = await features.query
    res.status(200).json({
        success: true,
        products,
        
    })
})

//Update products
exports.updateProduct = catchAsyncErrors(async (req, res) =>{
    let product = await Product.findById(req.params.id)
    if(!product){
        return res.status(500).json({
            success: false,
            message: "product not find with this id"
        })
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true,
        useUnified: false
    })
    res.status(200).json({
        success: true,
        product
    })
  
})

//Delete Product
exports.deleteProduct = catchAsyncErrors(async (req,res) => {

    const product = await Product.findById(req.params.id);

    if (!product){
        return res.status(500).json({
            success: false,
            message: "Product is not found with this id"

        })
    }

    await product.remove()
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})

// Single Product Details
exports.getSingleProduct = catchAsyncErrors(async(req, res, next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("Product is not found with this is id",404))
    }
    res.status(200).json({
        success: true,
        product,
        productCount
    })
})