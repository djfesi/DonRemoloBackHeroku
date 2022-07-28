const router = require("express").Router();
const {listAll, listOne, register, editOne, recoverPass, reset, saveNewPass, removeOne, login} = require("./usersController")
const {validatorCreateUser, validatorEditeUser, validatorResetPass} = require("../validadores/users")

//GET ALL USERS
router.get("/", listAll)

//GET USER BY ID
router.get("/:id", listOne)

//POST USER BY ID
router.post("/register", validatorCreateUser , register)

//POST USER LOGIN
router.post("/login", login)

//OLVIDE CONTRASEÑA
router.post("/recoverpass", recoverPass)

router.get("/reset/:token", reset)

router.post("/reset/:token", validatorResetPass, saveNewPass)

//PATCH USER BY ID
router.patch("/:id", validatorEditeUser, editOne)

//DELETE USER BY ID
router.delete("/:id", removeOne)

module.exports = router