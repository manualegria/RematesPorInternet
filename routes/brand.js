const router = require('express').Router()
const Brand = require('../models/Brand')
const { removeSpace, getDateDetails } = require('../utils/constant')
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('../middleware/verifyToken')
const { query } = require('express')

//CREATE
router.post('/', verifyTokenAndAuthorization, async (req, res) => {
  removeSpace(req.body)
  const { _id, name, description } = req.body
  try {
    
    const brandExist = await Brand.findOne({ name })
    if(brandExist){
      return res.status(402).json('Marca ya existe')
    }

    const newBrad = new Brand({
      name,
      description
    })

    const saveBrand = await newBrad.save()
    res.status(201).json(saveBrand)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put('/:id', verifyTokenAndAuthorization, async (req, res) =>{
  removeSpace(req.body)

  try {
      const updatedBrand = await Brand.findByIdAndUpdate(
        req.params.id,
       {$set: req.body},
       {new: true}
      )
      res.status(200).json(updatedBrand)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

router.delete('/:id', verifyTokenAndAuthorization, async (req,res) =>{
  removeSpace(req.body)

  try {

    const brandId = req.params.id
    const deletedBrand = await Brand.updateOne(
      {_id: brandId},
      {$set: {
        isRemoved: true,
        deleteAdt: getDateDetails()
      }}
    )

    if(deletedBrand.modifiedCount){
      res.status(200).json('Marca ha sido eliminada')
    }else {
      res.status(404).json('Marca no encontrada o ya eliminada')
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})


router.get('/', async (req, res) =>{

   try {

    const brands = query
    ? await Brand.find({ isRemoved: false }).sort({ _id: -1 }).limit(5)
    : await Brand.find({ isRemoved: false })

    res.status(200).json(brands)
    
   } catch (error) {
    res.status(500).json({message: error.message})
   }
})


router.get('/find:id', async (req, res) =>{
  try {
    const brand = Brand.findById({_id: req.params.id, isRemoved: false})

    if(!brand){
      return res.status(404).json('Marca no existe')
    }

    res.status(200).json(brand)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})




module.exports = router
