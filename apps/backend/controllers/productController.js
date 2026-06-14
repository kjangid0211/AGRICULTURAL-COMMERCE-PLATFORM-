const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const { category, search, mode, isAdmin } = req.query;
    let query = { status: 'active' };

    if (isAdmin === 'true') {
      query = {};
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (mode === 'B2B') {
      query.b2bVisibility = true;
    } else if (mode === 'B2C') {
      query.b2cVisibility = true;
    }

    const products = await Product.find(query).populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name, category, image, price, description, shortDescription, specifications, stock, status, b2bVisibility, b2cVisibility, minOrderQty
    } = req.body;

    const product = new Product({
      name,
      category,
      image,
      price,
      description,
      shortDescription,
      specifications: specifications || [],
      stock,
      status,
      b2bVisibility,
      b2cVisibility,
      minOrderQty
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      name, category, image, price, description, shortDescription, specifications, stock, status, b2bVisibility, b2cVisibility, minOrderQty
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name !== undefined ? name : product.name;
      product.category = category !== undefined ? category : product.category;
      product.image = image !== undefined ? image : product.image;
      product.price = price !== undefined ? price : product.price;
      product.description = description !== undefined ? description : product.description;
      product.shortDescription = shortDescription !== undefined ? shortDescription : product.shortDescription;
      product.specifications = specifications !== undefined ? specifications : product.specifications;
      product.stock = stock !== undefined ? stock : product.stock;
      product.status = status !== undefined ? status : product.status;
      product.b2bVisibility = b2bVisibility !== undefined ? b2bVisibility : product.b2bVisibility;
      product.b2cVisibility = b2cVisibility !== undefined ? b2cVisibility : product.b2cVisibility;
      product.minOrderQty = minOrderQty !== undefined ? minOrderQty : product.minOrderQty;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
