//padão do multer para envio de imagens, middlewares, interceptação
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, './public/image');
    },
    filename:(req, file, callback)=>{
        callback(null,` ${Date.now().toString}-${file.originalname}`);
    }
});


const fileFilter  = (req, file, callback) =>{
    const isAccepted = ['image/png', 'image/jpg','image/jpeg'] //imagens accept
    .find(acceptedFormat => acceptedFormat == file.mimetype);

    if(isAccepted){
        return callback(null, true);
    }

    return callback(null, false);
}

module.exports = multer({
    storage, 
    fileFilter
});