require ('dotenv').config("dotenv");
const express = require("express")
const mercadopago = require("mercadopago");
const app = express();
require('./db');
const userRoute= require("./routes/user");
const authRoute= require("./routes/auth");
const productRoute= require("./routes/product");
const cartRoute= require("./routes/cart");
const orderRoute= require("./routes/order");
const cors = require("cors");




mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN,
  });


const PORT = process.env.PORT;
app.use(express.json());

app.get("/api", () => {
    console.log("Hello World");
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);


app.listen({port: PORT}, () => {
    console.log(`http://localhost:${PORT}` ); 
});