const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
//defining routes and linking them to controller functions
router.post('/scrape', articleController.scrapeArticles);
router.get('/', articleController.getArticles);
//put route for updating article
router.put('/:id', articleController.updateArticle);
//article deletion route
router.delete('/clear', articleController.clearData);
module.exports = router;  