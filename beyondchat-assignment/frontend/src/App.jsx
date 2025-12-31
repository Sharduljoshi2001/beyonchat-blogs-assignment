import { useState, useEffect } from 'react';
import axios from 'axios';
//Reusable Card Component
const ArticleCard = ({ article, isAi }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full ${
      isAi ? 'border-purple-100' : 'border-blue-100'
    }`}>
      {/*Card Header*/}
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
      {/*Card Body*/}
      <div className="p-5 flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug hover:text-indigo-600">
          <a href={article.link} target="_blank" rel="noreferrer">
            {article.title}
          </a>
        </h3>
        {/*Content Preview*/}
        <div className="text-sm text-gray-600 prose prose-sm">
          {isAi ? (
             <div className="line-clamp-6" dangerouslySetInnerHTML={{ __html: article.description }} />
          ) : (
             <p className="line-clamp-6">{article.description || "No description available."}</p>
          )}
        </div>
      </div>
      {/*Card Footer*/}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 mt-auto flex justify-between items-center">
        <a 
          href={article.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          Read Full Article &rarr;
        </a>
        {isAi && (
          <span className="text-[10px] uppercase tracking-wider text-purple-600 font-bold">
            Gemini Powered
          </span>
        )}
      </div>
    </div>
  );
};
export default function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/articles');
      setArticles(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to connect to Backend. Is it running on Port 3001?');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchArticles();
  }, []);
  //Filtering Logic
  const originalArticles = articles.filter(a => a.source === 'beyondchats');
  const aiArticles = articles.filter(a => a.source === 'generative-ai');
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      {/* --- HEADER --- */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">BeyondChats</span>
            {/* <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">Phase 3 UI</span> */}
          </div>
          <button 
            onClick={fetchArticles}
            className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all shadow-sm active:scale-95"
          >
            Refresh Data
          </button>
        </div>
      </header>
      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/*Loading / Error States*/}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}
        {error && (
           <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r">
             <p className="text-red-700 font-medium">{error}</p>
           </div>
        )}
        {/* --- SPLIT GRID LAYOUT --- */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/*LEFT COLUMN: Original Scraped Data */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div>
                  <h2 className="text-xl font-bold text-blue-900">Original Articles</h2>
                  <p className="text-sm text-blue-700">Raw data scraped from BeyondChats</p>
                </div>
                <span className="bg-white text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 shadow-sm">
                  Count: {originalArticles.length}
                </span>
              </div>

              <div className="grid gap-6">
                {originalArticles.length > 0 ? (
                  originalArticles.map(article => (
                    <ArticleCard key={article._id} article={article} isAi={false} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No original articles found.</p>
                    <p className="text-xs text-gray-400 mt-1">Run "POST /api/articles/scrape"</p>
                  </div>
                )}
              </div>
            </div>
            {/*RIGHT COLUMN: AI Enhanced Data */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div>
                  <h2 className="text-xl font-bold text-purple-900">AI Enhanced</h2>
                  <p className="text-sm text-purple-700">Rewritten & enriched by Gemini</p>
                </div>
                <span className="bg-white text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 shadow-sm">
                  Count: {aiArticles.length}
                </span>
              </div>
              <div className="grid gap-6">
                {aiArticles.length > 0 ? (
                  aiArticles.map(article => (
                    <ArticleCard key={article._id} article={article} isAi={true} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No AI articles found.</p>
                    <p className="text-xs text-gray-400 mt-1">Run "node scripts/runAssignment.js"</p>
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