const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(createOrder)
  .get(protect, admin, getOrders);

router.route('/:id')
  .get(getOrderById)
  .put(protect, admin, updateOrderStatus)
  .delete(protect, admin, deleteOrder);

module.exports = router;
