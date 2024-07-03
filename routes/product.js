
const Product = require('../models/Product')
const Brand = require('../models/Brand')
const Category = require('../models/Category')
const User = require('../models/User')
const { removeSpace } = require('../utils/constant')
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndRole,
} = require('../middleware/verifyToken')
const router = require('express').Router()


//CREATE PRODUCT
router.post('/',verifyTokenAndAuthorization, async (req, res) => {
  removeSpace(req.body)

  try {
    const {
      name,
      description,
      brand,
      img,
      categories,
      size,
      color,
      price,
      stock,
    } = req.body

    const userId = req.user.id;
    

    // Validar que el ID de la marca existe
    const brandExists = await Brand.findById(brand)
    if (!brandExists) {
      return res.status(400).json({ message: 'Marca no encontrada' })
    }

    // Validar que los IDs de las categorías existen
    const categoriesExist = await Category.find({ _id: { $in: categories } })
    if (categoriesExist.length !== categories.length) {
      return res
        .status(400)
        .json({ message: 'Una o más categorías no fueron encontradas' })
    }

    const userCreate = await User.findById(userId);

    const newProduct = new Product({
      name,
      description,
      brand: {
        _id: brandExists._id.toString(),
        name: brandExists.name,
        description: brandExists.description,
      },
      userId: {
        _id: userCreate._id.toString(),
        name: userCreate.fullName,
      },
      img,
      categories: categoriesExist.map((cat) => ({
        _id: cat._id,
        name: cat.name,
        description: cat.description,
      })),
      size,
      color,
      price,
      stock,
    })
  console.log('--------', userCreate);
    const saveProduct = await newProduct.save()
    res.status(200).json(saveProduct)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//UPDATE
router.put('/:id', verifyTokenAndAuthorization,  async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      img,
      categories,
      size,
      color,
      price,
      stock,
      isActive,
    } = req.body

    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }
    
    console.log(product.userId._id , req.user.id);
    // Verificar si el usuario tiene permisos para actualizar el producto
    if (product.userId._id !== req.user.id
      && req.user.role !== 'Admin') {
      return res
        .status(403)
        .json('No tienes permiso para actualizar este producto')
    }

    // Actualizar campos del producto
    if (name !== undefined) product.name = name
    if (description !== undefined) product.description = description
    if (img !== undefined) product.img = img
    if (size !== undefined) product.size = size
    if (color !== undefined) product.color = color
    if (price !== undefined) product.price = price
    if (stock !== undefined) product.stock = stock
    if (isActive !== undefined) product.isActive = isActive

    // Actualizar la marca del producto si se proporciona el ID de la marca
    if (brand !== undefined) {
      const brandExists = await Brand.findById(brand)
      if (!brandExists) {
        return res.status(400).json({ message: 'Marca no encontrada' })
      }
      product.brand = {
        _id: brandExists._id.toString(),
        name: brandExists.name,
        description: brandExists.description,
      }
    }

    // Actualizar las categorías del producto si se proporcionan los IDs de las categorías
    if (categories !== undefined && Array.isArray(categories)) {
      const categoriesExist = await Category.find({
        _id: { $in: categories },
      })
      if (categoriesExist.length !== categories.length) {
        return res
          .status(400)
          .json({ message: 'Una o más categorías no fueron encontradas' })
      }
      product.categories = categoriesExist.map((cat) => ({
        _id: cat._id.toString(),
        name: cat.name,
        description: cat.description,
      }))
    }

    // Lógica para isActive basado en el stock
    if (product.stock === 0) {
      product.isActive = false
    } else {
      product.isActive = isActive !== undefined ? isActive : product.isActive
    }

    const updatedProduct = await product.save()
    res.status(200).json(updatedProduct)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET ALL PRODUCT

// router.get('/', async (req, res) => {
//   const { qNew, qCategory, qName } = req.query

//   try {
//     let products
//     // Filtrar por productos nuevos
//     if (qNew) {
//       products = await Product.find().sort({ createdAt: -1 }).limit(3)
//     }
//     // Filtrar por categoría
//     else if (qCategory) {
//       products = await Product.find({
//         categories: { $in: [qCategory] },
//         isActive: true,
//       })
//     } // Búsqueda por nombre usando expresión regular
//     else if (qName) {
//       const regex = new RegExp(qName, 'i')
//       products = await Product.find({ name: { $regex: regex }, isActive: true })
//     }
//     // Obtener todos los productos
//     else {
//       products = await Product.find({ isActive: true })
//     }
//     res.status(200).json(products)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// })


//DELETE
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    // Marcar el producto como eliminado
    product.isActive = false
    await product.save()

    res.status(200).json('Producto ha sido eliminado lógicamente')
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// RESTORE
router.put('/restore/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    // Restaurar el producto cambiando isActive a true
    product.isActive = true
    await product.save()

    res.status(200).json({ message: 'Producto ha sido restaurado', product })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET PRODUCT

router.get('/find/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ message: 'Producto no encontrado o está eliminado' })
    }

    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET ALL PRODUCT

router.get('/', async (req, res) => {
  const { qNew, qCategory, qName } = req.query

  try {
    let products
    // Filtrar por productos nuevos
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(3)
    }
    // Filtrar por categoría
    else if (qCategory) {
      products = await Product.find({
        categories: { $in: [qCategory] },
        isActive: true,
      })
    } // Búsqueda por nombre usando expresión regular
    else if (qName) {
      const regex = new RegExp(qName, 'i')
      products = await Product.find({ name: { $regex: regex }, isActive: true })
    }
    // Obtener todos los productos
    else {
      products = await Product.find({ isActive: true })
    }
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
