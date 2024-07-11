const router = require('express').Router()
const Role = require('../models/Role')
const { removeSpace } = require('../utils/constant')
const getDateDetails = require('../utils/constant')
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('../middleware/verifyToken')

// CREATE ROLE
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  removeSpace(req.body)

  try {

    const roleExist = await Role.findOne({name: req.body.name})
    if(roleExist ){
      return res.status(402).json('Rol ya existe')
    }

    const newRole = new Role({
      name: req.body.name,
      description: req.body.description,
    })

    const saveRole = await newRole
    res.status(201).json(saveRole)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const { name, description } = req.body

    const updateRole = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    )

    if (!updateRole) {
      return res.status(400).json({ message: 'Rol no encontrado' })
    }
    res.status(200).json(updateRole)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//DELETE
router.post('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const roleId = req.params.id

    const answer = await Role.updateOne(
      { _id: roleId },
      {
        $set: {
          isRemoved: true,
          deleteAt: getDateDetails(),
        },
      }
    )
    if (answer.modifiedCount) {
      res.status(200).json('Role ha sido marcado como eliminado')
    } else {
      res.status(404).json('Usuario no encontrado o ya eliminado')
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//GET

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const query = req.body.new

  try {
    const roles = query
      ? await Role.find({ isRemoved: false }).sort({ name: -1 })
      : await Role.find({ isRemoved: false })

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
