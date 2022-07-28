const { getAllProducts, getWithType, getWithProduct, getProductById, addNewProduct, deleteProductById, editProductById} = require("./productsModel");
const notNumber = require("../util/notNumber");
const public_url = process.env.public_url;
const { matchedData } = require("express-validator");
const cloudinary = require("../util/cloudinary")

const listAll = async (req, res, next) => {
    let dbResponse = null;
    if(req.query.tipo){
        dbResponse = await getWithType(req.query.tipo);
        console.log(dbResponse)
    }else{
    if(req.query.producto){
        dbResponse = await getWithProduct(req.query.producto);
    }
    else{
        dbResponse = await getAllProducts();}}
    if (dbResponse instanceof Error) return next(dbResponse);
    
    dbResponse.length ? res.status(200).json(dbResponse) : next();
}


const listOne = async (req, res, next) => {
    if(notNumber(req.params.id, next)) return;
    const dbResponse = await getProductById(+req.params.id);
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.length ? res.status(200).json(dbResponse) : next()
    
}

const create = async(req, res, next) => {
    const image2 = await cloudinary.uploader.upload(req.file.path)
    cantidad = image2.public_id
    image = image2.url
    const cleanProduct = matchedData(req)
    const dbResponse = await addNewProduct({...cleanProduct, cantidad, image});
    dbResponse instanceof Error ? next(dbResponse) : res.status(201).json({message:`${req.body.producto} agregado!`});
}

const editOne = async(req, res, next) => {
    if(notNumber(req.params.id, next)) return;
    const image2 = await cloudinary.uploader.upload(req.file.path)
    cantidad = image2.public_id
    image = image2.url
    const dbResponse = await editProductById(+req.params.id, {...req.body,cantidad, image});
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.affectedRows ? res.status(200).json({message:"Producto modificado"}) : next()
  
}

const removeOne = async (req, res, next) => {
    if(notNumber(req.params.id, next)) return;
    const dbResponse = await deleteProductById(+req.params.id);
    if (dbResponse instanceof Error) return next(dbResponse);
    dbResponse.affectedRows ? res.status(204).end() : next();
}

module.exports = {listAll, listOne, create, editOne, removeOne}