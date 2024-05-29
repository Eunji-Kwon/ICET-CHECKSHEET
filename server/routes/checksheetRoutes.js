const express = require('express');
const router = express.Router();
const checksheetController = require('../controllers/checksheetController');

router.post('/create', checksheetController.create);
router.get('/', checksheetController.getAll);
router.get('/:id', checksheetController.getOne);
router.patch('/:id', checksheetController.update);

module.exports = router;
