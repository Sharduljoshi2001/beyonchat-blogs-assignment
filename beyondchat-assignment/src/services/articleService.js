
const articleRepository = require('../repositories/articleRepository');
const scraperService = require('./scraperService');
const googleService = require('./googleService');
const llmService = require('./llmService');
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
//function to perform the ai rewrite process
const processArticlesWithAI = async () => {
    try {
        //getting all existing articles from db
        const articles = await articleRepository.getAllArticles();
        //filtering only those which are from original source(to avoid re-writing already written ones)
        const pendingArticles = articles.filter(art => art.source === 'beyondchats');
        console.log(`found ${pendingArticles.length} articles to process`);
        let updatedCount = 0;
        //looping through each article
        //using for...of loop to handle async/await properly
        for (const article of pendingArticles) {
            try {
                //searching google for the title
                const relatedLinks = await googleService.getRelatedLinks(article.title);
                if (relatedLinks.length === 0) {
                    console.log(`no google results for: ${article.title}`);
                    continue;
                }
                //scraping content from those 2 google links
                let aggregatedContent = "";
                for (const linkObj of relatedLinks) {
                    const content = await scraperService.scrapeGenericContent(linkObj.link);
                    aggregatedContent += `Source: ${linkObj.link}\nContent: ${content}\n\n`;
                }
                //sending to llm for rewriting
                if (aggregatedContent.length > 100) {
                   const newContent = await llmService.rewriteArticleWithAI(article.title, aggregatedContent);
                   if (newContent) {
                       //updating the database
                       await articleRepository.updateArticleContent(article._id, newContent);
                       console.log(`successfully updated: ${article.title}`);
                       updatedCount++;
                   }
                }
            } catch (innerError) {
                console.log(`failed to process article ${article.title}:`, innerError.message);
                //continue loop even if one fails
            }
        }
        return { message: 'ai processing completed', updated: updatedCount };
    } catch (error) {
        throw error;
    }
};
module.exports = {
    triggerScrapingProcess,
    fetchAllArticles,
    processArticlesWithAI 
};
