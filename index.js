require("dotenv").config()
require("./db/config")
const express = require("express");
const hbs = require("express-handlebars")
const path = require("path");
const cors = require('cors');
const PORT = process.env.PORT;
const server = express();
server.use(express.json())
server.use(express.urlencoded({ extended: true }))


server.use(cors())
server.use(express.static("storage"))

server.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
server.use(express.static(path.join(__dirname,"./public")))

server.set("view engine", "hbs");
server.set("views", path.join(__dirname, "views")) // "./views"
server.engine("hbs", hbs.engine({ extname: "hbs" }))

server.listen(process.env.PORT, (err) => {
    err ? console.warn(`Hubo un error {
        message: ${err} }`) : console.log(`Servidor corre en http://localhost:${PORT}`)
})

//welcome endpoint
server.get("/", (req, res) => {
    res.render("index")
})

server.use("/users", require("./users/usersRoutes"))

server.use("/products", require("./products/productsRoutes"))


//catch all route (404)
server.use((req, res, next) => {
    let error = new Error("Resource not found")
    error.status = 404;
    next(error)
})

//Error handler
server.use((error,req,res,next) =>{
    if(!error.status){
        error.status = 500
    }
    res.status(error.status)
    res.json({status: error.status, message: error.message})
})