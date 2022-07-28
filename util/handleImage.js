const multer = require("multer");
const path = require("path")

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        // file.originalname.split(".").pop();
if(ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png"){
    cb(new Error("Tipo de archivo no soportado"), false);
    return
}
cb(null, true);

    }
    // destination: (req, file, callback) => {
    //     const pathStorage = `${__dirname}/../storage`
    //     callback(null, pathStorage)                  
    // },
    // filename: (req, file, callback) => {
    //     const filename = `file_${Date.now()}.${ext}`;
    //     callback(null, filename)
    // }
});

// const uploadFile = multer({storage})

// module.exports = uploadFile