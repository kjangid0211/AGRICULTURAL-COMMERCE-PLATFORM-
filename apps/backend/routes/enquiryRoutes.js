const express = require('express');
const router = express.Router();
const { createEnquiry, getEnquiries, updateEnquiryStatus, deleteEnquiry } = require('../controllers/enquiryController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(createEnquiry)
  .get(protect, admin, getEnquiries);

router.route('/:id')
  .put(protect, admin, updateEnquiryStatus)
  .delete(protect, admin, deleteEnquiry);

module.exports = router;
