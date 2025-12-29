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
module.exports = { scrapeArticles, getArticles };