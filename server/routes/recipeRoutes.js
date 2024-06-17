const express = require('express');
const { createRecipe, getAllRecipes, getRecipeById, updateRecipe, deleteRecipe, getAllRecipeOfUser } = require('../controllers/recipeController');
const { auth } = require('../middleware/auth');


const RecipeRouter = express.Router();
// const { auth } = require('../middlewares/auth.middleware');
// const { access } = require('../middlewares/access.middleware');

// to create Recipe
RecipeRouter.post('/createRecipe',auth,  createRecipe)

// to get All Recipe
RecipeRouter.get('/getAllRecipes', getAllRecipes)

// to get All Recipe of specific user
RecipeRouter.get('/getAllRecipe/user',auth, getAllRecipeOfUser)

// to get single Recipe by its id
RecipeRouter.get('/getRecipeById/:id',auth,  getRecipeById)

// to update  Recipe
RecipeRouter.patch('/updateRecipe/:id', auth,updateRecipe)

// to delete Recipe
RecipeRouter.delete('/deleteRecipe/:id',auth,  deleteRecipe)



module.exports ={RecipeRouter}