const articleService = require("../services/articleService");
//scraping articles
const scrapeArticles = async (req, res) => {
  try {
    const result = await articleService.triggerScrapingProcess();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "scraping failed" });
  }
};
//getting all articles
const getArticles = async (req, res) => {
  try {
    const data = await articleService.fetchAllArticles();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "fetch failed" });
  }
};
//creating a new article
const createArticle = async (req, res) => {
  try {
    //script sends title, description, link, source='generative-ai'
    const articleData = req.body; 
    const newArticle = await articleService.createNewArticle(articleData);
    res.status(201).json(newArticle);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create new AI article" });
  }
};
//updating an existing article
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updated = await articleService.updateArticleById(id, { description });
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "update failed" });
  }
};
//clearing all data
const clearData = async (req, res) => {
  try {
    await articleService.deleteAllArticles();
    res.status(200).json({ message: "all data cleared" });
  } catch (error) {
    res.status(500).json({ error: "failed to clear data" });
  }
};
module.exports = { 
  scrapeArticles, 
  getArticles, 
  createArticle,
  updateArticle, 
  clearData 
};