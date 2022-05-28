const express = require('express')
const app = express()
const cookieParser = require("cookie-parser")
app.use(express.json())
app.use(cookieParser())
const ErrorHandler = require("./middleware/error")
 

//Route imports
const product = require("./routes/ProductRoute")
const user = require("./routes/UserRoute")

app.use("/api/v2", product)
app.use("/api/v2", user)


app.use(ErrorHandler)

module.exports = app