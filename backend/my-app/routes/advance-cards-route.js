const express = require('express');
const advanceCardControllers = require('../controllers/advanceCard-controllers');

const router = express.Router();

router.get('/', advanceCardControllers.getAdvanceCards);

router.get('/:cid', advanceCardControllers.getAdvanceCardsById);

router.post('/', advanceCardControllers.createAdvanceCard);

router.delete('/:cid', advanceCardControllers.deleteAdvanceCard);

module.exports = router;
