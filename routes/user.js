const User = require('../models/User')
const getDateDetails = require('../utils/constant')
// const {
//   verifyToken,
//   verifyTokenAndAuthorization,
//   verifyTokenAndRole,
// } = require('./verifyToken')
const router = require('express').Router()

//UPDATE
router.put('/:id', async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString()
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//DELETE

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id

    const answer = await User.updateOne(
      { _id: userId },
      {
        $set: {
          isRemoved: true,
          deletedAt: getDateDetails(),
        },
      }
    )
    if (answer.modifiedCount) {
      res.status(200).json('Usuario ha sido marcado como eliminado')
    } else {
      res.status(404).json('Usuario no encontrado o ya eliminado')
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET USER

router.get('/find/:id', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isRemoved: false })

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' })
    }
    const { password, ...others } = user._doc
    res.status(200).json(others)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET ALL USER

router.get('/', async (req, res) => {
  const query = req.query.new

  try {
    const users = query
      ? await User.find({ isRemoved: false }).sort({ _id: -1 }).limit(5)
      : await User.find({ isRemoved: false })

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET USER STATS

router.get('/stats', async (req, res) => {
  const date = new Date()
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ])
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
