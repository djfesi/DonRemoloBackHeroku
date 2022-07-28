const notNumber = (id, next) => {
if (isNaN(Number(id)) || +id < 1) {
    let error = new Error("ID debe ser un número entero positivo mayor que 0");
    error.status = 400;
    next(error);
    return true;
}else {
    return false;
}
}

module.exports = notNumber