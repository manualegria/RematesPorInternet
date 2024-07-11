const router = require('express').Router()
const Category = require('../models/Category')
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('../middleware/verifyToken')

// CREATE
router.post('/', verifyTokenAndAuthorization, async (req, res) => {
  const { name, description } = req.body

  try {
    const existingCategory = await Category.findOne({ name })
    if (existingCategory) {
      return res.status(400).json({ message: 'La categoría ya existe' })
    }

    const newCategory = new Category({ name, description })
    const savedCategory = await newCategory.save()
    res.status(201).json(savedCategory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET
router.get('/find/:id',  async (req, res) => {
  try {
    const categories = await Category.findById(req.params.id)
    if (!product || product.isRemoved) {
      return res
        .status(404)
        .json({ message: 'Producto no encontrado o está eliminado' })
    }
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET ALL
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find()
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// UPDATE
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  const { name, description } = req.body

  try {
    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    )

    if (!updateCategory) {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }

    res.status(200).json(updateCategory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// DELETE
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }
    category.isRemoved = true
    await category.save()

    res.status(200).json({ message: 'Categoría eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
