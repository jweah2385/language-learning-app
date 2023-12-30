const express = require('express');

const translationController = require('../controllers/translations-controllers');

const router = express.Router();

router.get('/:tid', translationController.getTranslationById);
router.get('/user/:tid', translationController.getTranslationsByUserId);

router.post(
  '/',
  translationController.createTranslation
);

router.delete('/:tid', translationController.deleteTranslation)

module.exports = router;
