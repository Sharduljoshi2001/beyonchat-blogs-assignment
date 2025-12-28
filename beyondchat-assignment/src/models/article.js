const mongoose = require("mongoose");
//defining database structure for our articles
const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    link: {
      type: String,
      required: true,
      unique: true, // no duplicate articles
    },
    publishedDate: {
      type: String,
    },
    source: {
      type: String, // to know if it's from 'beyondchats' or 'google'
      default: "beyondchats",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Article', articleSchema);