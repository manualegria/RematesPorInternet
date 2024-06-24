const router = require('express').Router()
const Brand = require('../models/Brand')
const { removeSpace } = require('../utils/constant')
// const {
//   verifyToken,
//   verifyTokenAndAuthorization,
//   verifyTokenAndRole,
// } = require('./verifyToken')

//CREATE
router.post('/', async (req, res) => {
  removeSpace(req.body)

  try {
    const newBrad = new Brand({
      name: req.body.name,
      description: req.body.description,
    })

    const saveBrand = await newBrad.save()
    res.status(201).json(saveBrand)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
