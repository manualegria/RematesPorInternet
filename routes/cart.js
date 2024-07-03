const Cart = require('../models/Cart')
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndRole,
} = require('../middleware/verifyToken')
const router = require('express').Router()
const getDateDetails = require('../utils/constant')

//CREATE

router.post('/', verifyToken, async (req, res) => {
  removeSpace(req.body)

  const newCart = new Cart(req.body)

  try {
    const saveCart = await newCart.save()
    res.status(200).json(saveCart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).json(updatedCart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// //DELETE

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id)
    res.status(200).json('Cart has been deleted...')
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET USER CART
// el Id sera el del usuario

router.get('/find/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })

    res.status(200).json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET ALL

router.get('/', async (req, res) => {
  const query = req.query.new
  try {
    const carts = query
      ? await Cart.find({ isRemoved: false }).sort({ _id: -1 }).limit(5)
      : await Cart.find({ isRemoved: false })

    res.status(200).json(carts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router

