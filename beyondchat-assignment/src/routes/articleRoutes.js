const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
//defining routes and linking them to controller functions
//post request because we are creating data in db
router.post('/scrape', articleController.scrapeArticles);
//get request to fetch data
router.get('/', articleController.getArticles);
module.exports = router;