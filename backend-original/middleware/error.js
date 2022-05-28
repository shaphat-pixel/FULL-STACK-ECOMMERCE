const ErrorHandler = require("../utils/ErrorHandler")

module.exports = (err, req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.statusCode = err.message || "Internal server error"


    //wrong mongodb id error
    if(err.name === "CastError"){
        const message = `Resource not found with this id....Invalid ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        error: err.message
    })
}