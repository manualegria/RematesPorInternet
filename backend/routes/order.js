const Order = require("../models/Order");
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
    
    const newOrder =  new Order(req.body);
    console.log(req.body);
    try {
        const saveOrder = await newOrder.save();
        res.status(200).json(saveOrder); 
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})



//UPDATE
router.put("/:id", verifyTokenAndAutorization, async (req, res)  =>{
   
    try {
        const  updatedOrder = await Order.findByIdAndUpdate(
            
            req.params.id,
            {
                $set: req.body
            },
            {new: true}
        );
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


// //DELETE
router.delete("/:id", verifyTokenAndAutorization, async (req, res)  =>{

   
    try {
        const Order = await Order.findByIdAndUpdate(req.params.id);
        res.status(200).json("Orden ha sido eliminada");
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


// GET USER ORDER

router.get("/find/:userId", verifyTokenAndAutorization, async (req, res) => {
    try {

        const orders =  await Order.findOne({ userId: req.params.userId })
       
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({message: error.message})
    }

    })
    
// GET ALL 

router.get("/", verifyTokenAndAdmin, async (req, res) => {

    try {
   
        const orders = await Order.find();
        
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({message: error.message})
    }

    })


    // GET MONTHLY ICOME

    router.get("/income", verifyTokenAndAdmin, async (req, res) => {
        const date = new Date();
        const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
        const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
      
        try {
          const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
              $project: {
                month: { $month: "$createdAt" },
                sales: "$amount",
              },
            },
            {
              $group: {
                _id: "$month",
                total: { $sum: "$sales" },
              },
            },
          ]);
          res.status(200).json(income);
        } catch (err) {
          res.status(500).json(err);
        }
      });


module.exports = router;