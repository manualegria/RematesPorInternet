const Order = require('../models/Order')
// const {
//   verifyToken,
//   verifyTokenAndAuthorization,
//   verifyTokenAndRole,
// } = require('./verifyToken')
const router = require('express').Router()
const mongoose = require('mongoose')
const { removeSpace } = require('../utils/constant')

//CREATE

router.post('/', async (req, res) => {
  removeSpace(req.body)

  try {
    const newOrder = new Order({ _id: req.body.id }, req.body)

    const saveOrder = await newOrder.save()
    res.status(200).json(saveOrder)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//UPDATE
router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).json(updatedOrder)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// //DELETE

const getDateDetails = () => new Date()
router.delete('/:id', async (req, res) => {
  try {
    const orderId = new mongoose.Types.ObjectId(req.params.id)
    console.log(orderId)
    const answer = await Order.updateOne(
      { _id: orderId },
      {
        $set: {
          isRemoved: true,
          deletedAt: getDateDetails(),
        },
      }
    )
    if (answer.modifiedCount) {
      res.status(200).json('Orden ha sido eliminada')
    } else {
      res.status(404).json('Orden no encontrada o ya eliminada')
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET USER ORDER

router.get('/find/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })

    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET ALL

router.get('/', async (req, res) => {
  const query = req.query.new
  try {
    const orders = query
      ? await Order.find({ isRemoved: false }).sort({ _id: -1 }).limit(5)
      : await Order.find({ isRemoved: false })
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET MONTHLY ICOME

router.get('/income', async (req, res) => {
  const date = new Date()
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount',
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' },
        },
      },
    ])
    res.status(200).json(income)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
