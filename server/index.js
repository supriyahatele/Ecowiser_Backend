require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { dbToConnection } = require('./config/dbConnection');
const { UserRouter } = require('./routes/userRoutes');
const { RecipeRouter } = require('./routes/recipeRoutes');

const app = express();
app.use(express.json());
app.use(cors())

app.use("/user", UserRouter)
app.use("/recipe", RecipeRouter)
app.listen(process.env.PORT, () => {
  dbToConnection()
  console.log('server is running!')
})