const express = require('express');
const router = express.Router();
const { getCanchas } = require('../controllers/canchaController');

router.get('/', getCanchas);

module.exports = router;