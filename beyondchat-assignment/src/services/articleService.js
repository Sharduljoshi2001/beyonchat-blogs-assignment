const articleRepository = require("../repositories/articleRepository");
const scraperService = require("./scraperService");
const Article = require("../models/article");
//scraping logic
const triggerScrapingProcess = async () => {
  try {
    const articles = await scraperService.scrapeBeyondChatsData();
    if (articles.length === 0) return { message: "no articles found" };
    try {
      await articleRepository.createManyArticles(articles);
      return { message: "scraped and saved", count: articles.length };
    } catch (dbError) {
      if (dbError.code === 11000 || dbError.writeErrors) {
        return { message: "partial success, duplicates skipped" };
      }
      throw dbError;
    }
  } catch (error) {
    throw error;
  }
};
//geting all articles
const fetchAllArticles = async () => {
  return await articleRepository.getAllArticles();
};
//updating article
const updateArticleById = async (id, data) => {
  //data contains{description, source}
  return await articleRepository.updateArticleContent(id, data.description);
};
//deleting articles(sirf debugging purpose k liye)
const deleteAllArticles = async () => {
    return await articleRepository.deleteAll(); 
};
const createNewArticle = async (data) => {
  const article = new Article(data);
  return await article.save();
};
module.exports = {
  triggerScrapingProcess,
  fetchAllArticles,
  updateArticleById,
  deleteAllArticles,
  createNewArticle
};
