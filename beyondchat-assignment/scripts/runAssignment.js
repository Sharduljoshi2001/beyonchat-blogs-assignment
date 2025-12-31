//loading env variables because we need gemini key here
require("dotenv").config();
const axios = require("axios");
//importing our logic services
const googleService = require("../src/services/googleService");
const scraperService = require("../src/services/scraperService");
const llmService = require("../src/services/llmService");
//backend url
const API_BASE_URL = 'https://olympic-shane-sharduls-org-2001-3f0c7b1c.koyeb.app/api/articles';

const startPhase2Process = async () => {
  console.log("--- STARTING PHASE 2 AUTOMATION SCRIPT ---");
  try {
    //fetching articles from api
    console.log("1. Fetching articles from Backend API...");
    const response = await axios.get(API_BASE_URL);
    const articles = response.data;
    //filtering original articles only (source: beyondchats)
    const pendingArticles = articles.filter(
      (art) => art.source === "beyondchats"
    );
    console.log(`> Found ${pendingArticles.length} articles to process.\n`);
    for (const article of pendingArticles) {
      console.log(`>>> Processing: "${article.title}"`);
      try {
        //searching related links
        const links = await googleService.getRelatedLinks(article.title);
        //scraping external links
        let aggregatedContent = "";
        if (links.length > 0) {
          for (const linkObj of links) {
            const content = await scraperService.scrapeGenericContent(linkObj.link);
            if (content)
              aggregatedContent += `Source: ${linkObj.link}\nContent: ${content}\n\n`;
          }
        }
        //fallback content if scraping fails
        const finalContent = aggregatedContent || `Context: Tech trends about ${article.title}`;
        //ai rewrite
        const newContent = await llmService.rewriteArticleWithAI(
          article.title,
          finalContent
        );
        if (newContent) {
          //publishing using create api (POST) instead of update (PUT)
          console.log("   > Creating NEW AI article via API...");

          await axios.post(API_BASE_URL, {
            title: article.title,         
            description: newContent,       
            link: article.link,           
            source: "generative-ai"        
          });

          console.log(" Successfully Created AI Version!\n");
        }
      } catch (err) {
        console.log(` Failed to process ${article.title}:`, err.message);
      }
    }
    console.log("--- PHASE 2 COMPLETED SUCCESSFULLY ---");
  } catch (error) {
    console.error("Script Fatal Error:", error.message);
  }
};
startPhase2Process();