const { check, validationResult } = require("express-validator");


const validatorCreateProduct = [
    check("producto")
    .exists().withMessage("El nombre del producto es obligatorio")
    .trim()
    .notEmpty().withMessage("Debe colocar un producto")
    .isLength({ min: 2, max: 90 }).withMessage("El nombre debe tener un minimo de 2 caracteres y un maximo de 90"),
    check("precio")
    .exists().withMessage("Debe ingresar el costo del producto")    
    .notEmpty().withMessage("Complete con el costo del producto"),   
    check("cantidad")                     
    .exists(),
    check("descripcion")                     
    .exists(),
    check("tipo")
    .exists(),
    (req,res,next)=>{
        try {
            validationResult(req).throw();
            return next();
        } catch (error) {
            res.status(400).json({errors: error.array()})
        }
    }    
]

module.exports = {validatorCreateProduct}
