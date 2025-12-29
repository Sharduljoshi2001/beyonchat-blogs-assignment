const Article = require("../models/article");
//function to save multiple articles in db
const createManyArticles = async (articleData) => {
  try {
    const result = await Article.insertMany(articleData, { ordered: false });
    return result;
  } catch (error) {
    throw error;
  }
};
// function to get all articles sorted by latest
const getAllArticles = async () => {
  try {
    return await Article.find().sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};
//function to find article by link (helper for checking duplicates manually if needed)
const findArticleByLink = async (link) => {
  return await Article.findOne({ link });
};
module.exports = {
  createManyArticles,
  getAllArticles,
  findArticleByLink,
};
