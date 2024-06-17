const { RecipeModel } = require("../models/recipeModel");

// Add a new recipe
const createRecipe = async (req, res) => {
  // console.log(req)
  const { title, description, ingredients, steps, image } = req.body;

  // Validate inputs
  if (!Array.isArray(ingredients) || !Array.isArray(steps)) {
    return res
      .status(400)
      .json({ msg: "Ingredients and steps must be arrays" });
  }

  try {
    const newRecipe = new RecipeModel({
      title,
      description,
      ingredients,
      steps,
      image,
      createdBy: req.userId,
    });
    const recipe = await newRecipe.save();
    return res.json(recipe);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Get all recipes
const getAllRecipes = async (req, res) => {
  const { page = 1, limit = 8, search } = req.query;

  try {
    let filter = {};
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { ingredients: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const recipes = await RecipeModel.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const count = await RecipeModel.countDocuments();
    const totalPages = Math.ceil(count / limit);
    return res.status(200).json({
      totalPages: totalPages,
      currentPage: parseInt(page),
      recipes,
      totalRecipe: count,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};
// Get a  recipes of specific user
const getAllRecipeOfUser = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const recipes = await RecipeModel.find({ createdBy: req.userId })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalRecipes = await RecipeModel.countDocuments({ createdBy: req.userId });

    return res.status(200).json({
      totalPages: Math.ceil(totalRecipes / limit),
      currentPage: parseInt(page),
      recipes
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Get a specific recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    return res.status(200).json(recipe);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Update a recipe
const updateRecipe = async (req, res) => {
  const { title, description, ingredients, steps, image } = req.body;

  // Validate inputs
  if (ingredients && !Array.isArray(ingredients)) {
    return res.status(400).json({ msg: "Ingredients must be an array" });
  }
  if (steps && !Array.isArray(steps)) {
    return res.status(400).json({ msg: "Steps must be an array" });
  }

  try {
    let recipe = await RecipeModel.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    if (recipe.createdBy.toString() !== req.userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const updatedFields = { title, description, ingredients, steps, image };
    recipe = await RecipeModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    return res.status(200).json(recipe);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server error");
  }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    if (recipe.createdBy.toString() !== req.userId) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await RecipeModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ msg: "Recipe removed" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send({err:err.message});
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getAllRecipeOfUser,
};
