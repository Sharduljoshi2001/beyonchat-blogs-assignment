const articleService = require("../services/articleService");
const googleService = require("../services/googleService");  
const scraperService = require("../services/scraperService"); 
const llmService = require("../services/llmService");
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
const generateAiForPending = async (req, res) => {
  console.log("Creating AI Articles triggered via API...");
  try {
    //fetching original articles
    const allArticles = await articleService.fetchAllArticles();
    const originalArticles = allArticles.filter(a => a.source === 'beyondchats');
    if (originalArticles.length === 0) {
      return res.status(400).json({ message: "No original articles found to process" });
    }
    let processedCount = 0;
    for (const article of originalArticles) {
      //checking if ai version already exists to avoid duplicates
      const exists = allArticles.find(a => a.link === `${article.link}?variant=ai-enhanced`);
      if (exists) continue;

      try {
        //searching & scraping context
        const links = await googleService.getRelatedLinks(article.title);
        let aggregatedContent = "";
        if (links.length > 0) {
            const firstLink = links[0]; // Only scrape 1 link to be fast
            const content = await scraperService.scrapeGenericContent(firstLink.link);
            if (content) aggregatedContent += `Source: ${firstLink.link}\nContent: ${content}\n\n`;
        }
        const finalContent = aggregatedContent || `Context: Tech trends about ${article.title}`;
        //generating ai Content
        const newContent = await llmService.rewriteArticleWithAI(article.title, finalContent);

        //saving to DB
        if (newContent) {
           await articleService.createNewArticle({
            title: article.title,
            description: newContent,
            link: `${article.link}?variant=ai-enhanced`,
            source: "generative-ai"
          });
          processedCount++;
        }
      } catch (innerErr) {
        console.error(`Skipped ${article.title}: ${innerErr.message}`);
      }
    }
    res.status(200).json({ message: "AI Generation Complete", count: processedCount });
  } catch (error) {
    console.error("AI Gen Error:", error);
    res.status(500).json({ error: "Server failed to generate AI content" });
  }
};
module.exports = { 
  scrapeArticles, 
  getArticles, 
  createArticle,
  updateArticle, 
  clearData,
  generateAiForPending
};