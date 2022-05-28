const ErrorHandler = require("../utils/ErrorHandler")
const catchAsyncErrors = require("./catchAsyncErrors")
const jwt = require("jsonwebtoken")
const User = require("../models/UserModel")

exports.isAuthenticatedUser =  catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("please login to access this resource"))

    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = await User.findById(decodedData.id)
    next()
    
})

//ADMIN RULES
exports.authorizeRoles = (...roles)=>{
    return (req, res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} cannot access this resource`))
        }
        next()
    }
}