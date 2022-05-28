const express = require("express")
const {getAllProducts, createProduct, updateProduct, deleteProduct, getSingleProduct} = require("../controller/ProductController")
const router = express.Router()
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth")

router.route("/products").get(getAllProducts)

router.route("/product/new").post(isAuthenticatedUser,authorizeRoles("admin"), createProduct)

router.route("/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)

router.route("/product/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)

router.route("/product/:id").get(getSingleProduct)




module.exports = router