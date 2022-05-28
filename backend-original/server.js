
const app = require("./app")

const dotenv = require("dotenv")
const connectDatabase = require("./db/Database.js")
//handling uncaght exception

process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`)
    console.log(`shutting down the server for handling some errors`)
})

//CONFIG
dotenv.config({
    path:"backend/config/.env"
})

//connect databe
connectDatabase()




// create server
const server = app.listen(process.env.PORT, ()=>{
    console.log(`server is working on http://localhost${process.env.PORT}`)
})

//Unhandle promise rejesction

process.on("unhandledRejection", (err)=>{
    console.log(`shutting down the server for ${err.message}`)

    console.log(`shutting down the server due to unhandled rejection`)
    server.close(()=>{
        process.exit(1)
    })
})