const express = require('express');
const router = express.Router();
const { getCmsByKey, updateCmsByKey } = require('../controllers/cmsController');
const { protect, admin } = require('../middleware/auth');

router.route('/:key')
  .get(getCmsByKey)
  .put(protect, admin, updateCmsByKey);

module.exports = router;
