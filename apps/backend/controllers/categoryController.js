const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const { isAdmin } = req.query;
    let query = { status: 'active' };

    if (isAdmin === 'true') {
      query = {};
    }

    const categories = await Category.find(query).sort({ displayOrder: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, image, status, displayOrder } = req.body;

    const categoryExists = await Category.findOne({ slug });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category with this slug already exists' });
    }

    const category = new Category({
      name,
      slug,
      image,
      status,
      displayOrder,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, slug, image, status, displayOrder } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name !== undefined ? name : category.name;
      category.slug = slug !== undefined ? slug : category.slug;
      category.image = image !== undefined ? image : category.image;
      category.status = status !== undefined ? status : category.status;
      category.displayOrder = displayOrder !== undefined ? displayOrder : category.displayOrder;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
