const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
//triggering scraping route
router.post('/scrape', articleController.scrapeArticles);
//fetching all articles route
router.get('/', articleController.getArticles);
//creating new ai scripted article route
router.post('/', articleController.createArticle);
//updating existing article route
router.put('/:id', articleController.updateArticle);
//delete all (for user experience purpose)
router.delete('/clear', articleController.clearData);
module.exports = router;