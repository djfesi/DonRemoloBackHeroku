const { check, validationResult } = require("express-validator");


const validatorCreateUser = [
    check("name")
    .exists().withMessage("El nombre es requerido")
    .trim()
    .notEmpty().withMessage("Debe colocar un nombre")
    .isLength({ min: 2, max: 90 }).withMessage("El nombre debe tener un minimo de 2 caracteres y un maximo de 90")
    .isAlpha('es-ES', {ignore: ' '}).withMessage("El nombre deben ser solo letras"),
    check("email")
    .exists().withMessage("El mail es requerido")
    .trim()
    .isEmail().withMessage("El mail debe ser valido")
    .normalizeEmail(),
    check("password")
    .exists().withMessage("Debe ingresar una contraseña")    
    .trim()
    .notEmpty()
    .isLength({ min: 8,  max: 20 }).withMessage("La contraseña debe tener entre 8 y 20 caracteres."),                        
                
    (req,res,next)=>{
        try {
            validationResult(req).throw();
            return next();
        } catch (error) {
            res.status(400).json({errors: error.array()})
        }
    }    
]

const validatorEditeUser = [
    check("name")
    .exists().withMessage("El nombre es requerido")
    .trim()
    .notEmpty().withMessage("Debe colocar un nombre")
    .isLength({ min: 2, max: 90 }).withMessage("El nombre debe tener un minimo de 2 caracteres y un maximo de 90")
    .isAlpha('es-ES', {ignore: ' '}).withMessage("El nombre deben ser solo letras"),
    check("email")
    .exists().withMessage("El mail es requerido")
    .trim()
    .isEmail().withMessage("El mail debe ser valido")
    .normalizeEmail(),                    
                
    (req,res,next)=>{
        try {
            validationResult(req).throw();
            return next();
        } catch (error) {
            res.status(400).json({errors: error.array()})
        }
    }    
]


const validatorResetPass = [
    check("pass1")
    .exists().withMessage("Debe ingresar una contraseña")    
    .trim()
    .notEmpty()
    .isLength({ min: 8,  max: 20 }).withMessage("La contraseña debe tener entre 8 y 20 caracteres."),   
    check("pass2")
    .custom(async(pass2, {req}) => {
        const pass1 = req.body.pass1;
        if(pass1 !== pass2){
            throw new Error("Las contraseñas no coinciden.")
        }
    }),
    (req,res,next)=>{
    const token = req.params.token;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const arrWarnings = errors.array();
        res.render("reset", {arrWarnings, token})
    }else return next();
    }
]

module.exports = {validatorCreateUser, validatorEditeUser, validatorResetPass}
