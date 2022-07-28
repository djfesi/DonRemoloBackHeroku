const router = require("express").Router();
const {listAll, listOne, create, editOne, removeOne} = require("./productsController")
const uploadFile = require("../util/handleImage");
const { validatorCreateProduct } = require("../validadores/product")
const isAuth = require("../util/isAuth")

//GET ALL PRODUCT
router.get("/", listAll)

//GET PRODUCT BY ID
router.get("/:id", listOne)

//POST PRODUCT BY ID
router.post("/newProduct", isAuth, uploadFile.single("image"), validatorCreateProduct, create)

//PATCH PRODUCT BY ID
router.patch("/:id", isAuth, uploadFile.single("image"), editOne)

//DELETE PRODUCT BY ID
router.delete("/:id", isAuth, removeOne)

module.exports = router