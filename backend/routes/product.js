const Product = require("../models/Product");
const {verifyToken, verifyTokenAndAutorization, verifyTokenAndAdmin} = require("./verifyToken");
const router = require("express").Router();


//CREATE PRODUCT

const removeSpace = (body)=>{
    for (const key in body) {
       if(typeof body[key] === "string") body[key] = body[key].trim()
    }
}

router.post("/", verifyTokenAndAdmin, async (req, res)  =>{
    removeSpace(req.body)
    
    const newProduct =  new Product(req.body);
    console.log(req.body);
    try {
        const saveProduct = await newProduct.save();
        res.status(200).json(saveProduct); 
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})



//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res)  =>{
   
    try {
        const  updatedProduct = await Product.findByIdAndUpdate(
            
            req.params.id,
            {
                $set: req.body
            },
            {new: true}
        );
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res)  =>{

   
    try {
         await Product.findByIdAndUpdate(req.params.id);
        res.status(200).json("Producto ha sido eliminado");
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


// GET PRODUCT

router.get("/find/:id", async (req, res) => {
    try {

        const product =  await Product.findById(req.params.id)
        console.log(product);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }

    })
    
// GET ALL PRODUCT

router.get("/", async (req, res) => {

    const product = req.query.new
    const Category = req.query.category
    console.log(product);
    try {
        // if (name) {
        //     query.name = {
        //       $regex: name,  
        //       $options: 'i',
        //     };
        //   }
   
        let products;
        if(product){

            return products  =  await Product.find().sort({createdAt: -1}).limit(3)
        }
    
        else if(Category){
             products = await Product.find({
                categories:{
                    $in:[Category]
                },
                
            })
        } else{
            products = await Product.find()
            
        }
       // console.log("=============D" , Category);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message})
    }

    })


module.exports = router;