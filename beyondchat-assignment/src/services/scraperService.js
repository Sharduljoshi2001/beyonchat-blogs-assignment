const axios = require("axios");
const cheerio = require("cheerio");
//function to fetch and parse beyondchats blog
const scrapeBeyondChatsData = async () => {
  try {
    console.log("starting to fetch data from beyondchats...");
    const url = "https://beyondchats.com/blogs/";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const scrapedArticles = [];
    //inspecting the page structure
    //we are looping through article cards
    //i verified class names '.entry-card' using inspect element in chrome
    $(".entry-card").each((index, element) => {
      //fetching only 5 articles as per requirement
      if (index < 5) {
        const title = $(element).find(".entry-title a").text().trim();
        const link = $(element).find(".entry-title a").attr("href");
        const date = $(element).find(".ct-meta-element-date").text().trim();
        const desc = $(element).find(".entry-excerpt").text().trim();
        // validation to ensure empty data is not pushed
        if (title && link) {
          scrapedArticles.push({
            title: title,
            description: desc,
            // handling relative urls if present
            link: link.startsWith("http")
              ? link
              : `https://beyondchats.com${link}`,
            publishedDate: date,
            source: "beyondchats",
          });
        }
      }
    });
    console.log(`scraped ${scrapedArticles.length} articles found`);
    return scrapedArticles;
  } catch (error) {
    console.log("error in scraping logic:", error.message);
    throw error;
  }
};
//generic scraper for external websies
const scrapeGenericContent = async (url) => {
  try {
    console.log(`scraping content from: ${url}`);
    // adding headers so websites think we are a real browser (user-agent)
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);
    //extracting text from all paragraph tags
    let content = "";

    $("p").each((index, element) => {
      //avoiding very short lines (like 'menu', 'copyright')
      const text = $(element).text().trim();
      if (text.length > 50) {
        content += text + " ";
      }
    });
    //limiting content length to avoid confusing the ai with too much text
    return content.slice(0, 3000);
  } catch (error) {
    console.log(`failed to scrape ${url}:`, error.message);
    // return empty string if scraping fails
    return "";
  }
};
module.exports = {
  scrapeBeyondChatsData,
  scrapeGenericContent,
};
