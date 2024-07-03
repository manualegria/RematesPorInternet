const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product'); 


const verifyToken = (req, res, next) => {
  const token = req.headers.token;  
  if (!token) {
    return res.status(401).json('You are not authenticated!');
  }

  jwt.verify(token, process.env.JWT_SEC, (err, user) => {
    if (err) {
      return res.status(403).json('Token is not valid!');
    }
    
    // El token es válido, establecer req.user y llamar a next()
    req.user = user;
    next();
  });
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    // Verificar si el usuario es admin o vendedor
    if (req.user && (req.user.id === req.params.id ||
      req.user.role === 'admin' ||
       req.user.role === 'vendedor')) {
       
      next();
    } else {
      res.status(403).json("No tienes permiso.");
    }
  });
};

const verifyTokenAndRole = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === 'vendedor') {
      next()
    } else {
      res.status(403).json('You are not alowed to do that!')
    }
  })
}

module.exports = {
  verifyToken,
  verifyTokenAndRole,
  verifyTokenAndAuthorization
};