const {tokenVerify} = require("../util/handleJWT")

const isAuth = async(req,res,next) => {
    try {
        if(!req.headers.authorization){
            let error = new Error("Debe iniciar sesion");
            error.status = 401;
            return next(error)
        }
        const token = req.headers.authorization.split(" ").pop();
        const tokenStatus = await tokenVerify(token)
        if(tokenStatus instanceof Error){
            if(tokenStatus.message === "invalid token"){
                let error = new Error("Token no valido");
                error.status = 403;
                return next(error)
            }else{
                let error = new Error("Token vencido");
                error.status = 403;
                return next(error)
            }
        }

        req.user = tokenStatus

        if (req.user.id == 1){  /* ID DEL USUARIO ADMINISTRADOR */
        console.log("REQ ADMIN ", req.user)
            next() }
            else{
            let error = new Error("No tienes permisos para dicha acción");
            error.status = 401;
            return next(error)
            } 
    } catch (error) {
        error.message = "Error interno del sistema"
        
    }
}

module.exports = isAuth