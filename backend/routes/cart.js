const Cart = require("../models/Cart");
const {verifyToken, verifyTokenAndAutorization, verifyTokenAndAdmin} = require("./verifyToken");
const router = require("express").Router();


//CREATE 

const removeSpace = (body)=>{
    for (const key in body) {
       if(typeof body[key] === "string") body[key] = body[key].trim()
    }
}

router.post("/", verifyToken, async (req, res)  =>{
    removeSpace(req.body)
    
    const newCart =  new Cart(req.body);
    console.log(req.body);
    try {
        const saveCart = await newCart.save();
        res.status(200).json(saveCart); 
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})



//UPDATE
router.put("/:id", verifyTokenAndAutorization, async (req, res)  =>{
   
    try {
        const  updatedCart = await Cart.findByIdAndUpdate(
            
            req.params.id,
            {
                $set: req.body
            },
            {new: true}
        );
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


// //DELETE
router.delete("/:id", verifyTokenAndAutorization, async (req, res)  =>{

   
    try {
         await Cart.findByIdAndUpdate(req.params.id);
        res.status(200).json("Carrito vacío");
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


// GET USER CART

router.get("/find/:userId", verifyTokenAndAutorization, async (req, res) => {
    try {

        const cart =  await Cart.findOne({ userId: req.params.userId })
       
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({message: error.message})
    }

    })
    
// GET ALL 

router.get("/", verifyTokenAndAdmin, async (req, res) => {

    try {
   
        const carts = await Cart.find();
        
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({message: error.message})
    }

    })


module.exports = router;