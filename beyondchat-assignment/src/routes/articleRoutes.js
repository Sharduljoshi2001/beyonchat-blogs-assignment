const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
//defining routes and linking them to controller functions
//post request because we are creating data in db
router.post('/scrape', articleController.scrapeArticles);
// post request to trigger ai rewrite (phase 2)
router.post('/rewrite', articleController.rewriteArticles);
//get request to fetch data
router.get('/', articleController.getArticles);
module.exports = router;