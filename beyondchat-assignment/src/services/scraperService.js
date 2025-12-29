const axios = require('axios');
const cheerio = require('cheerio');;
//function to fetch and parse beyondchats blog
const scrapeBeyondChatsData = async () => {
    try {
        console.log('starting to fetch data from beyondchats...');
        const url = 'https://beyondchats.com/blogs/';
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);       
        const scrapedArticles = [];
        //inspecting the page structure
        //we are looping through article cards
        //i verified class names '.entry-card' using inspect element in chrome
        $('.entry-card').each((index, element) => {
            //fetching only 5 articles as per requirement
            if (index < 5) {
                const title = $(element).find('.entry-title a').text().trim();
                const link = $(element).find('.entry-title a').attr('href');
                const date = $(element).find('.ct-meta-element-date').text().trim();
                const desc = $(element).find('.entry-excerpt').text().trim();
                // validation to ensure empty data is not pushed
                if (title && link) {
                    scrapedArticles.push({
                        title: title,
                        description: desc,
                        // handling relative urls if present
                        link: link.startsWith('http') ? link : `https://beyondchats.com${link}`,
                        publishedDate: date,
                        source: 'beyondchats'
                    });
                }
            }
        });
        console.log(`scraped ${scrapedArticles.length} articles found`);
        return scrapedArticles;
    } catch (error) {
        console.log('error in scraping logic:', error.message);
        throw error;
    }
};
module.exports = { scrapeBeyondChatsData };