const User = require("../models/UserModel")
const ErrorHandler = require("../utils/ErrorHandler.js")
const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const sendToken = require("../utils/jwtToken.js")
const SendmailTransport = require("nodemailer/lib/sendmail-transport")
const sendmail = require("../utils/sendMail.js")
const crypto = require("crypto")


//Register user
exports.createUser = catchAsyncErrors(async(req, res, next)=>{
    const {name, email, password} = req.body

    const user = await User.create({
        name,
        email,
        password,
        avator:{
            public_id:"https://test.com",
            url: "https://test.com"
        }
    })
    sendToken(user, 201, res)
})

//login user

exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email, password} = req.body
    if (!email || !password){
        return next(new ErrorHandler("Please enter your email and password", 400))

    };
    const user = await User.findOne({email}).select("+password");

    if (!user){
        return next(new ErrorHandler("User is not found with this email and password", 401))
    };

    const isPasswordMatched = await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("User is not found with this email and password", 401))

    }
    sendToken(user, 200, res)
})

// log out user

exports.logoutUser = catchAsyncErrors(async (req, res, next)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "LOgged out successflly"
    })
})

//forgot password

exports.forgotPassword = catchAsyncErrors(async(req, res, next)=>{
    const user = await User.findOne({email:req.body.email})

    if(!user){
        return next(new ErrorHandler("User not found with this email", 404))

    }

    //get resetpassword token

    const resetToken = user.getResetToken()

    await user.save({
        validateBeforeSave: false
    })

    
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`

    const message = `your password reset token is : - \n\n ${resetPasswordUrl}`

    try{

        await sendmail({
            email: user.email,
            subject:`Ecommerce Password Recovery`,
            message,
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,

        })

    } catch (error){
        user.resetPasswordToken = undefined
        user.resetPasswordTime = undefined

        await user.save({
            validateBeforeSave: false
        })

        return next(new ErrorHandler(error.message))
    }
})

// reset password
exports.resetPassword = catchAsyncErrors(async(req, res, next)=>{

    // create token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTime: {$gt: Date.now()},
    })

    if(!user){
        return next(new ErrorHandler("reset passsword url is invalid or has been expired",400))
    }
    if(req.body.password !== req.body.confirmPassowrd){
        return next(new ErrorHandler("password does not match with new password",400))
    }
    user.password = req.body.password

    user.resetPasswordToken = undefined
    user.resetPasswordTime = undefined

    await user.save()

    sendToken(user, 200,res)
})