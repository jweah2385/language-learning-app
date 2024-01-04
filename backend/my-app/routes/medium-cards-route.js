const express = require('express');
const mediumCardControllers = require('../controllers/mediumCard-controllers');

const router = express.Router();

router.get('/', mediumCardControllers.getMediumCards);

router.get('/:cid', mediumCardControllers.getMediumCardsById);

router.post('/', mediumCardControllers.createMediumCard);

router.delete('/:cid', mediumCardControllers.deleteMediumCard);

module.exports = router;
