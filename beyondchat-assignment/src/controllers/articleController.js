const articleService = require("../services/articleService");
//scraping aticles controller
const scrapeArticles = async (req, res) => {
  try {
    const result = await articleService.triggerScrapingProcess();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "scraping failed" });
  }
};
//getting articles controller
const getArticles = async (req, res) => {
  try {
    const data = await articleService.fetchAllArticles();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "fetch failed" });
  }
};
//updation controller
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body; //script will send this

    const updated = await articleService.updateArticleById(id, { description });
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "update failed" });
  }
};
//clearing article data controller
const clearData = async (req, res) => {
  try {
    await articleService.deleteAllArticles();
    res.status(200).json({ message: "all data cleared" });
  } catch (error) {
    res.status(500).json({ error: "failed to clear data" });
  }
};
module.exports = { scrapeArticles, getArticles, updateArticle, clearData };
