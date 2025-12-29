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
        //i verified class names '.div-block-10' using inspect element in chrome
        $('.div-block-10').each((index, element) => {
            //fetching only 5 articles as per requirement
            if (index < 5) {
                const title = $(element).find('h5').text().trim();
                const link = $(element).find('a').attr('href');
                const date = $(element).find('.blog-date').text().trim();
                const desc = $(element).find('.paragraph-2').text().trim();
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