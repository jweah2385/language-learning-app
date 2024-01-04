const express = require('express');
const simpleCardControllers = require('../controllers/simpleCard-controllers');

const router = express.Router();

router.get('/', simpleCardControllers.getSimpleCards)

router.get('/:cid', simpleCardControllers.getSimpleCardsById);

router.post('/', simpleCardControllers.createSimpleCard);

router.delete('/:cid', simpleCardControllers.deleteSimpleCard);

module.exports = router;
