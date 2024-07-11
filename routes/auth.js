const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Role = require('../models/Role')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

//REGISTRAR
router.post('/registrar', async (req, res) => {
  try {
    const { userName, firstName, lastName, email, password } = req.body
    let roleExistsArray = await Role.find({ name: 'General' })
    let roleExists = roleExistsArray[0]

    if (!roleExists) {
      roleExists = new Role({
        name: 'Estanadar',
        description: 'Rol por defecto para usuarios',
      })
      await roleExists.save()
    }

    const newUser = new User({
      userName,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email,
      password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
      role: {
        _id: roleExists._id,
        name: roleExists.name,
      },
    })

    const saveUser = await newUser.save()
    res.status(201).json(saveUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//LOGIN

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    const hashePassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    )

    if (hashePassword.toString(CryptoJS.enc.Utf8) === password) {
      const accessToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
          userName: user.userName,
          fullName: user.fullName,
        },
        process.env.JWT_SEC,
        { expiresIn: 3600 }
      )

      const { password, ...others } = user._doc
      //res.status(200).json({ ...others, accessToken })
      res.status(200).json({ accessToken })
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' })
    }
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
