const { getAllUsers, getUsersById, addNewUser, loginUser, deleteUserById, editUserById } = require("./usersModel");
const notNumber = require("../util/notNumber")
const { encrypt, compare } = require("../util/handlePassword");
const { matchedData } = require("express-validator");
const public_url = process.env.public_url;
const {tokenSign, tokenVerify} = require("../util/handleJWT")
const nodemailer = require("nodemailer");

const listAll = async (req, res, next) => {
    const dbResponse = await getAllUsers();
    if (dbResponse instanceof Error) return next(dbResponse);
    const responseGetUsers = dbResponse.map((user)=>{
        const filteredUser = {
            id: user.id, 
            name: user.name, 
            email: user.email}
            return filteredUser;
        })

    
    dbResponse.length ? res.status(200).json(responseGetUsers) : next();
}

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.mail_user,
      pass: process.env.mail_pass
    }
  });


const recoverPass = async(req, res, next) => {
    const dbResponse = await loginUser(req.body.email)
    if (!dbResponse.length) return next();
    const user = {
        id: dbResponse[0].id,
        name:  dbResponse[0].name,
        email:  dbResponse[0].email
    }
    const token = await tokenSign(user, '5m');
    const link = `${public_url}/users/reset/${token}`

    let mailDetails = {
        from: "donRemolo@pizzeria.com",
        to: user.email,
        subject: "Recuperar contraseña - Pizzeria Don Remolo",
        html:`
        <img src="../public/assets/logopest.png" alt="">
        <h1 style="font-family: 'Fredoka', sans-serif; color:  #e54322;">Pizzeria Don Remolo</h1>
        <h3 style="font-family: 'Fredoka', sans-serif; color: #333;">Recuperar contraseña de usuario</h3>
        <p style="font-family: 'Fredoka', sans-serif; color: #333;">Hola <strong style="color: #e54322;">${user.name}</strong>, para recuperar su contraseña haga click en el siguiente enlace: </p>
        <div>
        <a style="font-family: 'Fredoka', sans-serif; background:  #e54322; color: #f5f5dc" href="${link}">CLICK AQUI</a>
        </div>
        <p style="font-family: 'Fredoka', sans-serif; color: #333;">Recuerde que tiene 5 minutos para restaurarla, transcurrido dicho tiempo deberá solicitarlo nuevamente en caso de no haberlo echo.</p>
        `
    }
    transport.sendMail(mailDetails, (err,data) => {
        if(err){
            err.message("")
            res.next(err)
        }else{
            res.status(200).json({message: `${user.name} le hemos enviado un email a ${user.email} con las instrucciones`})
        }
    })

};

const reset = async (req, res, next) => {
    const { token } = req.params;
    const tokenStatus = await tokenVerify(token)
    if(tokenStatus instanceof Error){
        res.send(tokenStatus)
    }else res.render("reset", {tokenStatus, token})
    
}

const saveNewPass = async (req, res, next) => {
    const {token} = req.params;
    const tokenStatus = await tokenVerify(token);
    if(tokenStatus instanceof Error) return res.send(tokenStatus)
    const newPass = await encrypt(req.body.pass1);
    const dbResponse = await editUserById(tokenStatus.id, { password: newPass })
    dbResponse instanceof Error ? next(dbResponse) : res.status(200).json({message: `Contraseña cambiada con exito`})
}




const listOne = async (req, res, next) => {
    if(notNumber(req.params.id, next)) return;
    const dbResponse = await getUsersById(+req.params.id);
    if (dbResponse instanceof Error) return next(dbResponse);
    if(dbResponse.length){
        const {id, name, email} = dbResponse[0];
        const responseGetUser = {id, name, email}
        return res.status(200).json(responseGetUser) 
    }
    next()
    
}

const register = async(req, res, next) => {
    const cleanBody = matchedData(req)
    const password = await encrypt(req.body.password);
    const dbResponse = await addNewUser({...cleanBody, password});
    if(dbResponse instanceof Error) return next(dbResponse);
    const userToken = {id: cleanBody.id, email: cleanBody.email};
    const tokenData = await tokenSign(userToken, "10m");
    res.status(201).json({message:`Usuario ${req.body.name} creado!`, JWT: tokenData});

}

const login = async(req,res,next)=>{
    const dbResponse = await loginUser(req.body.email);
    if(!dbResponse.length)return next();
    if(await compare(req.body.password, dbResponse[0].password)){
    const userToken = {id: dbResponse[0].id, email: dbResponse[0].email};
    const tokenData = await tokenSign(userToken, "30m");
    let role = ""
    dbResponse[0].id === 1 ? role = "admin" : role = "client";
    res.status(200).json({message:`Usuario ${dbResponse[0].name} inicio sesion!`, JWT: tokenData, rol : role });

    }else{
        let error = new Error("No Autorizado");
        error.status = 401;
        next(error)
    }    
}

const editOne = async(req, res, next) => {
    if(notNumber(req.params.id, next)) return;
    const dbResponse = await editUserById(+req.params.id,{...req.body});
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.affectedRows ? res.status(200).json({message: "Usuario modificado"}) : next()
  
}

const removeOne = async (req, res, next) => {
    if(notNumber(req.params.id, next)) return;
    const dbResponse = await deleteUserById(+req.params.id);
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.affectedRows ? res.status(204).end() : next();
}

module.exports = {listAll, listOne, register, recoverPass, reset ,saveNewPass, login, editOne, removeOne}