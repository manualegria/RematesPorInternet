const express = require("express")
const router = express.Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


//REGISTRAR

router.post("/registrar", async (req,res)=> {

    const newUser = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASS_SEC
            ).toString(), 
    });
    try {
        const saveUser = await newUser.save()
     res.status(201).json(saveUser);
    } catch (error) {
        res.status(500).json(error);
    }
    
})

//LOGIN

router.post("/login", async (req, res) => {
console.log(req.body);
try {
    
    const {userName, password} = req.body;
     
    const user = await User.findOne({userName});
  console.log(req.body);

    const hashePassword = CryptoJS.AES.decrypt(
        user.password, process.env.PASS_SEC);
       
       
        if (hashePassword.toString(CryptoJS.enc.Utf8) === password) {
           
             const accessToken = jwt.sign(
                {
                    id: user._id,
                    isAdmin: user.isAdmin,
                },
                process.env.JWT_SEC,
                {expiresIn: 3600}
             );
             
            const {password, ...others} = user._doc;

            res.status(200).json({...others, accessToken});
        } else {
            res.status(401).json({message: "Credenciales incorrectas"});
        }

} catch (error) {
    res.status(500).json(error);
}
    
})

module.exports = router;



