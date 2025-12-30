const google = require("googlethis");
//function to search on google and get top 2 links
const getRelatedLinks = async (query) => {
  try {
    console.log(`searching google for ${query}`);
    const options = {
      page: 0,
      safe: false,
      additional_params: {
        hl: "en", //host language should be englsh
      },
    };
    const response = await google.search(query, options);
    //googlethis returns many things (knowledge panel, ads, etc.),we only want organic results
    if (response.results.length > 0) {
      //taking the top 2 results
      const topResults = response.results.slice(0, 2);
      //returning clean data (title and url)
      return topResults.map((result) => ({
        title: result.title,
        link: result.url,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.log("google search faile:", error.message);
    return [];
  }
};
module.exports = { getRelatedLinks };
