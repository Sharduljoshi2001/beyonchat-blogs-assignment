require("dotenv").config();
const axios = require("axios");
const googleService = require("../src/services/googleService");
const scraperService = require("../src/services/scraperService");
const llmService = require("../src/services/llmService");
//backend url
const API_BASE_URL =
  "https://olympic-shane-sharduls-org-2001-3f0c7b1c.koyeb.app/api/articles";
//delay helper to prevent blocking/rate-limiting
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const startPhase2Process = async () => {
  console.log("--- STARTING PHASE 2 AUTOMATION SCRIPT ---");
  try {
    //fetching articles
    console.log("1. Fetching articles from Backend API...");
    const response = await axios.get(API_BASE_URL);
    const articles = response.data;
    //filtering original articles only
    const pendingArticles = articles.filter(
      (art) => art.source === "beyondchats"
    );
    console.log(`> Found ${pendingArticles.length} articles to process.\n`);
    for (const article of pendingArticles) {
      console.log(`>>> Processing: "${article.title}"`);
      try {
        //searching & scraping
        const links = await googleService.getRelatedLinks(article.title);
        let aggregatedContent = "";
        if (links.length > 0) {
          for (const linkObj of links) {
            //small delay to be polite to websites
            await sleep(1000);
            const content = await scraperService.scrapeGenericContent(
              linkObj.link
            );
            if (content)
              aggregatedContent += `Source: ${linkObj.link}\nContent: ${content}\n\n`;
          }
        }
        const finalContent =
          aggregatedContent || `Context: Tech trends about ${article.title}`;
        //ai rewrite
        const newContent = await llmService.rewriteArticleWithAI(
          article.title,
          finalContent
        );
        if (newContent) {
          console.log("   > Creating NEW AI article via API...");
          await axios.post(API_BASE_URL, {
            title: article.title,
            description: newContent,
            link: `${article.link}?variant=ai-enhanced`,
            source: "generative-ai",
          });
          console.log(" Successfully Created AI Version!\n");
        }
      } catch (err) {
        console.log(` Failed to process ${article.title}:`, err.message);
        if (err.response) console.log("Server Reason:", err.response.data);
      }
      //waiting between articles to avoid 429 Errors
      await sleep(2000);
    }
    console.log("--- PHASE 2 COMPLETED SUCCESSFULLY ---");
  } catch (error) {
    console.error("Script Fatal Error:", error.message);
  }
};

startPhase2Process();
