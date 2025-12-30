const articleService = require('../services/articleService');
//api endpoint to start scraping
const scrapeArticles = async (req, res) => {
    try {
        //passing control to service layer
        const result = await articleService.triggerScrapingProcess();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'internal server error during scraping' });
    }
};
//api endpoint to get list
const getArticles = async (req, res) => {
    try {
        const data = await articleService.fetchAllArticles();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'failed to retrieve articles' });
    }
};
//api end point for updated data using llm
const rewriteArticles = async (req, res) => {
    try {
        //this process might take time, so we are loging it
        console.log('received request to rewrite articles...');
        const result = await articleService.processArticlesWithAI();
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'failed to process articles with ai' });
    }
};
module.exports = { 
    scrapeArticles, 
    getArticles,
    rewriteArticles 
};
