import React, { useState } from "react";

function App() {
  const [mood, setMood] = useState("");
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const URL = import.meta.env.VITE_BACKEND_URL;

  const fetchMoodTracks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${URL}/api/${mood}`);
      const data = await res.json();
      setTracks(data.tracks || []);
    } catch (err) {
      console.error("Error fetching mood tracks:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-black text-white p-4 sm:p-8 font-sans">
      {/* Header Section */}
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 text-green-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
            Moodify
          </h1>
        </div>
        <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
          Discover the perfect soundtrack for your current mood.
        </p>
      </header>

      {/* Search Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center mb-6 sm:mb-8 gap-2 sm:gap-0">
        <input
          type="text"
          placeholder="Enter mood (happy, sad, etc)"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="px-4 py-2 sm:py-2 sm:rounded-l-full rounded-lg sm:rounded-r-none bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64 placeholder-gray-400"
        />
        <button
          onClick={fetchMoodTracks}
          className="px-4 py-2 sm:py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg sm:rounded-l-none sm:rounded-r-full transition duration-200 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
        >
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Search</span>
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-6 sm:py-8">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Results Section */}
      <div className="mb-8 sm:mb-12">
        {tracks.length > 0 && (
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
            Your Mood Playlist
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {tracks.map((track, index) => (
            <div
              key={index}
              className="bg-gray-800 bg-opacity-60 hover:bg-opacity-80 p-3 sm:p-4 rounded-lg transition duration-200 group"
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded flex items-center justify-center">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                  </div>
                  <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 bg-opacity-80 rounded flex items-center justify-center">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base mb-1 truncate text-white">
                    {track.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2 sm:mb-3 truncate">
                    by {track.artists}
                  </p>
                  <a
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs sm:text-sm text-green-500 hover:text-green-400 transition duration-200"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"></path>
                    </svg>
                    Play on Spotify
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-white">
          How it works
        </h2>
        <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
          Our algorithm analyzes Spotify's music library to find tracks that
          match your mood.
        </p>
        <p className="text-xs sm:text-sm text-gray-300">
          Try different moods to discover new music that fits your current state
          of mind.
        </p>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-gray-400">
        <p>Made with ❤️ by music lovers</p>
        <p className="mt-1">Powered by Spotify Web API</p>
      </footer>
    </div>
  );
}

export default App;
