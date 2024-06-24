const router = require("express")

const stripe = require("stripe")(process.env.STRIPE_SEC)

module.exports = router;