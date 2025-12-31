import { useState, useEffect } from 'react';
import axios from 'axios';
// --- CONFIGURATION ---
const API_BASE_URL = 'https://olympic-shane-sharduls-org-2001-3f0c7b1c.koyeb.app/api/articles';
// --- COMPONENTS ---
const ArticleCard = ({ article, isAi }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full ${
      isAi ? 'border-purple-100' : 'border-blue-100'
    }`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b flex justify-between items-start ${
        isAi ? 'bg-purple-50 border-purple-100' : 'bg-blue-50 border-blue-100'
      }`}>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          isAi ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'
        }`}>
          {isAi ? 'AI Enhanced' : 'Original'}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(article.createdAt).toLocaleDateString()}
        </span>
      </div>
      {/* Body */}
      <div className="p-5 flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug hover:text-indigo-600">
          <a href={article.link} target="_blank" rel="noreferrer">
            {article.title}
          </a>
        </h3>
        <div className="text-sm text-gray-600 prose prose-sm">
          {isAi ? (
             <div className="line-clamp-6" dangerouslySetInnerHTML={{ __html: article.description }} />
          ) : (
             <p className="line-clamp-6">{article.description || "No description available."}</p>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 mt-auto flex justify-between items-center">
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
          Read Full Article &rarr;
        </a>
        {isAi && (
          <span className="text-[10px] uppercase tracking-wider text-purple-600 font-bold">Gemini Powered</span>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(""); // To show live progress
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch Data
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setArticles(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleMagicButton = async () => {
    if(!window.confirm("This will Clear Data, Scrape New Articles, and Generate AI Content. Continue?")) return;

    try {
      setIsProcessing(true);
      // Step 1: Clear Old Data
      setStatusMsg("🧹 Cleaning Database...");
      await axios.delete(`${API_BASE_URL}/clear`);
      setArticles([]); // Clear UI immediately
      // Step 2: Scrape Original Articles
      setStatusMsg("📄 Scraping BeyondChats (Please wait)...");
      await axios.post(`${API_BASE_URL}/scrape`);
      // Refresh UI to show Left Side (Originals)
      const resAfterScrape = await axios.get(API_BASE_URL);
      setArticles(resAfterScrape.data);
      // Step 3: Trigger AI Generation
      setStatusMsg("✨ Gemini AI is writing articles (Taking a few seconds)...");
      await axios.post(`${API_BASE_URL}/generate-ai`);
      // Final Refresh to show Right Side (AI)
      const resFinal = await axios.get(API_BASE_URL);
      setArticles(resFinal.data);
      setStatusMsg("");
      alert("Success! Dashboard Updated.");

    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Error occurred. Server might be busy.");
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
      setStatusMsg("");
    }
  };

  const originalArticles = articles.filter(a => a.source === 'beyondchats');
  const aiArticles = articles.filter(a => a.source === 'generative-ai');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">BeyondChats</span>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Progress Message */}
             {statusMsg && (
               <span className="text-xs font-medium text-indigo-600 animate-pulse bg-indigo-50 px-3 py-1 rounded-full">
                 {statusMsg}
               </span>
             )}

             {/* THE ONE AND ONLY BUTTON */}
             <button 
              onClick={handleMagicButton}
              disabled={isProcessing}
              className={`text-sm px-6 py-2 rounded-lg font-bold text-white shadow-md transition-all active:scale-95 ${
                isProcessing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {isProcessing ? 'Processing...' : '🚀 Launch Dashboard'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Loading Spinner */}
        {(loading || isProcessing) && articles.length === 0 && (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-500 animate-pulse">Fetching latest insights...</p>
          </div>
        )}

        {/* Split View */}
        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            
            {/* Left: Original */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h2 className="text-lg font-bold text-blue-900">Original Data</h2>
                <span className="text-xs bg-white px-2 py-1 rounded shadow-sm text-blue-800 font-bold">{originalArticles.length} items</span>
              </div>
              <div className="grid gap-6">
                {originalArticles.map(article => (
                  <ArticleCard key={article._id} article={article} isAi={false} />
                ))}
              </div>
            </div>

            {/* Right: AI */}
            <div className="flex flex-col gap-4">
               <div className="flex justify-between items-center bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h2 className="text-lg font-bold text-purple-900">AI Enhanced</h2>
                <span className="text-xs bg-white px-2 py-1 rounded shadow-sm text-purple-800 font-bold">{aiArticles.length} items</span>
              </div>
              <div className="grid gap-6">
                {aiArticles.length > 0 ? (
                  aiArticles.map(article => (
                    <ArticleCard key={article._id} article={article} isAi={true} />
                  ))
                ) : (
                  // Empty State for Right Side while loading
                  <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-purple-200 rounded-xl bg-purple-50/50">
                    {isProcessing ? (
                       <>
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
                         <p className="text-sm text-purple-600 font-medium">Generating AI Content...</p>
                       </>
                    ) : (
                       <p className="text-sm text-gray-400">Waiting for AI generation...</p>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}