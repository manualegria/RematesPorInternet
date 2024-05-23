const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {
    const  token = req.headers.token;
    if(token){
        // jwt.verify(token, process.env.JWT_SEC, (err, user)=>{
        //     if(err) res.status(403).json("token no es valido");
        //     req.user = user;
        //     next();
        // })
        const user = jwt.verify(token, process.env.JWT_SEC)
        req.user = user
        next();
    }else{
        return res.status(401).json("usuario no autenticado")
    }
 }


 const verifyTokenAndAutorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        }   else {
            res.status(403).json("No autorizado");
        }
    });
};


const verifyTokenAndAdmin = (req, res, next) => {
    
    verifyToken(req, res, () => {

        console.log(req.user);
        if ( req.user.isAdmin) {
            next();
        }   else {
             res.status(403).json("No autorizado no eres admin");
         }
    });
};

 module.exports = {verifyToken, verifyTokenAndAutorization,verifyTokenAndAdmin};