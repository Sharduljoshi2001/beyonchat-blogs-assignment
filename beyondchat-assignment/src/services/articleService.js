
const articleRepository = require('../repositories/articleRepository');
const scraperService = require('./scraperService');
//business logic to perform scraping and saving
const triggerScrapingProcess = async () => {
    try {
        //getting data from scraper service
        const articles = await scraperService.scrapeBeyondChatsData();
        if (articles.length === 0) {
            return { message: 'no articles found to save' };
        }
        //saving data using repository
        try {
            await articleRepository.createManyArticles(articles);
            return { message: 'articles scraped and saved successfully', count: articles.length };
        } catch (dbError) {
            //if error is mostly about duplicates (code 11000), we consider it partial success
            if (dbError.code === 11000 || dbError.writeErrors) {
                return { message: 'process complete, some duplicates were skipped' };
            }
            throw dbError;
        }
    } catch (error) {
        throw error;
    }
};
//business logic to fetch articles for frontend
const fetchAllArticles = async () => {
    return await articleRepository.getAllArticles();
};
module.exports = {
    triggerScrapingProcess,
    fetchAllArticles
};