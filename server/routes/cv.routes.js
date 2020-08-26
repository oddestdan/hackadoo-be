const express = require('express');
const controller = require('../controllers/cv.controllers');

const router = express.Router();

router.post('/cv/:id', controller.cv);

module.exports = router;
