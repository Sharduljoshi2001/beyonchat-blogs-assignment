//importing express to create our server
const express = require("express");
//mporting dotenv to read .env file variables
require("dotenv").config();
//importing cors to allow frontend to access our backend
const cors = require("cors");
// importing database connection logic (we will make this file next)
const connectDB = require("./config/db");
//creating the app
const app = express();
//using middleware to parse json data coming from frontend
app.use(express.json());
//allowing cross origin requests
app.use(cors());
//defining port from env or using 3000 as default
const PORT = process.env.PORT || 3000;
//simple route to check if server is working
const articleRoutes = require('./routes/articleRoutes');
app.get("/", (req, res) => {
  res.send("server is running perfectly");
});
// telling app to use article routes for any url starting with /api/articles
app.use('/api/articles', articleRoutes);
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   console.log(`TEST HEALTH: http://localhost:${PORT}/health`);
// });
// connectDB();
//connecting to the db first and listening to the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`TEST HEALTH: http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.log("failed to start server:", error);
  }
};
startServer();
