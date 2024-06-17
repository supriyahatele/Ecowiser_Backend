const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  stepNumber: { type: String, required: true },
  instruction: { type: String, required: true },
  image: { type: String }
});

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [StepSchema], required: true },
  image: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const RecipeModel = mongoose.model('Recipe', RecipeSchema);

module.exports = { RecipeModel };
