import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from './userSlice';
import { fetchRepos, setPage, selectSortedRepos } from './reposSlice';
import RepositoryCard from './components/RepositoryCard';
import RepositorySorting from './components/RepositorySorting';
import Spinner from './components/Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';
import useDebounce from './hooks/useDebounce';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const userLoading = useSelector((state) => state.user.loading);
  const userError = useSelector((state) => state.user.error);
  const repos = useSelector((state) => state.repos.items);
  const sortedRepos = useSelector(selectSortedRepos);
  const reposLoading = useSelector((state) => state.repos.loading);
  const reposError = useSelector((state) => state.repos.error);
  const page = useSelector((state) => state.repos.page);
  const perPage = useSelector((state) => state.repos.perPage);

  // Local state for search input
  const [username, setUsername] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const observer = useRef();
  const [repoLanguages, setRepoLanguages] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Debounce the username input
  const debouncedUsername = useDebounce(username, 500); // 500ms delay

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper to determine if more repos can be loaded
  const hasMore = repos.length % perPage === 0 && repos.length > 0;

  // Handler to load more repos
  const fetchMoreRepos = () => {
    dispatch(setPage(page + 1));
  };

  useEffect(() => {
    if (user && user.login) {
      dispatch(fetchRepos({ username: user.login, page, perPage }));
    }
  }, [user, page, perPage, dispatch]);

  // Fetch language breakdowns for all visible repos
  useEffect(() => {
    const visibleRepos = sortedRepos;
    if (!user || !visibleRepos.length) return;
    let cancelled = false;
    const fetchLanguages = async () => {
      const newLangs = {};
      await Promise.all(
        visibleRepos.map(async (repo) => {
          if (repoLanguages[repo.id]) {
            newLangs[repo.id] = repoLanguages[repo.id];
            return;
          }
          try {
            const res = await fetch(`https://api.github.com/repos/${user.login}/${repo.name}/languages`, {
              headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
              },
            });
            if (!res.ok) return;
            const langs = await res.json();
            newLangs[repo.id] = langs;
          } catch {}
        })
      );
      if (!cancelled) {
        setRepoLanguages((prev) => ({ ...prev, ...newLangs }));
      }
    };
    fetchLanguages();
    return () => { cancelled = true; };
  }, [user, sortedRepos]);

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    dispatch(fetchUser(username));
    dispatch(setPage(1));
  };

  // Auto-search when debounced username changes
  useEffect(() => {
    if (debouncedUsername.trim()) {
      dispatch(fetchUser(debouncedUsername));
      dispatch(setPage(1));
    }
  }, [debouncedUsername, dispatch]);

  useEffect(() => {
    if (user && (user.name || user.login)) {
      document.title = user.name || user.login;
    } else {
      document.title = 'GitHub User Finder';
    }
  }, [user]);

          //className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D9A299] to-[#DCC5B2] hover:from-[#DCC5B2] hover:to-[#F0E4D3] dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">

  return (
    <div className={`min-h-screen w-full transition-all duration-300 ${
      isDarkMode ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-indigo-900' : 'bg-gradient-to-b from-[#FAF7F3] via-[#F0E4D3] to-[#D9A299]'
    }`}>
      <div className={`max-w-4xl w-full mx-auto p-6 rounded-3xl shadow-2xl h-full transition-all duration-300 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 ${
        isDarkMode 
          ? 'bg-slate-800/90 text-slate-100' 
          : 'bg-[#FAF7F3]/90 text-black'
      }`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold text-center bg-clip-text text-transparent ${
            isDarkMode 
              ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600' 
              : 'bg-gradient-to-r from-[#D9A299] via-[#DCC5B2] to-[#D9A299]'
          }`}>GitHub User Finder</h1>
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105
              ${isDarkMode
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                : 'bg-gradient-to-r from-[#D9A299] to-[#DCC5B2] hover:from-[#DCC5B2] hover:to-[#F0E4D3] text-black border border-[#DCC5B2]'}
            `}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter GitHub username"
              value={username}
              onChange={handleInputChange}
              className={`w-full px-6 py-4 rounded-2xl border-2 text-lg backdrop-blur-sm transition-all duration-300
                ${isDarkMode
                  ? 'border-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-700/80 text-white'
                  : 'border-[#DCC5B2] focus:outline-none focus:ring-4 focus:ring-[#D9A299]/20 focus:border-[#D9A299] bg-[#FAF7F3]/80 text-black'
                }
              `}
            />
            {/* Debouncing indicator */}
            {username && username !== debouncedUsername && (
              <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            )}
          </div>
          <button
            onClick={handleSearch}
            className={`px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2
              ${isDarkMode
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                : 'bg-gradient-to-r from-[#D9A299] to-[#DCC5B2] hover:from-[#DCC5B2] hover:to-[#F0E4D3] text-black border border-[#DCC5B2]'}
            `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
            Search
          </button>
        </div>
        {userLoading && <div className="flex justify-center"><Spinner size={48} className='text-[#D9A299] dark:text-black' /></div>}
        {userError && <p className="text-center text-red-500 font-medium bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-200 dark:border-red-800">{userError}</p>}
        {user && (
          <div className="flex flex-col items-center mb-10 p-8 rounded-3xl bg-gradient-to-br from-[#F0E4D3] to-[#DCC5B2] dark:from-slate-700/50 dark:to-indigo-900/50 border border-[#DCC5B2] dark:border-slate-600/30">
            <div className="relative">
              <img src={user.avatar_url} alt={user.login} className="w-28 h-28 rounded-full border-4 border-[#D9A299] shadow-2xl" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-slate-800"></div>
            </div>
            <h2 className={`text-3xl font-bold mt-4 ${
              isDarkMode ? 'text-slate-100' : 'text-gray-700'
            }`}>{user.name || user.login}</h2>
            {user.bio && <p className={`text-center mt-2 max-w-md font-medium ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>{user.bio}</p>}
            {user.location && (
              <p className={`flex items-center gap-2 mt-3 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-700'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {user.location}
              </p>
            )}
            <div className="flex gap-8 mt-4 text-black dark:text-slate-300">
              <span className={`flex items-center gap-2 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-700'
              }`}>
                <span className="text-2xl">👥</span>
                <span><b>{user.followers}</b> followers</span>
              </span>
              <span className={`flex items-center gap-2 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-700'
              }`}>
                <span className="text-2xl">📦</span>
                <span><b>{user.public_repos}</b> repos</span>
              </span>
            </div>
            <p className={`mt-4 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-700'
            }`}>
              <a href={user.html_url} target="_blank" rel="noopener noreferrer" className={`font-semibold transition-colors ${
                isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-[#D9A299] hover:text-[#DCC5B2]'
              }`}>
                @{user.login}
              </a>
            </p>
          </div>
        )}
        {user && (
          <div>
            <h3 className={`text-2xl font-bold mb-6 ${
              isDarkMode 
                ? 'text-slate-100' 
                : 'text-black bg-gradient-to-r from-[#D9A299] to-[#DCC5B2] bg-clip-text text-transparent'
            }`}>Public Repositories</h3>
            
            {/* Repository Sorting Component */}
            {repos.length > 0 && <RepositorySorting isDarkMode={isDarkMode} />}
            
            {reposError && <p className="text-red-500 font-medium bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-200 dark:border-red-800">{reposError}</p>}
            {!reposLoading && repos.length === 0 && <p className="text-black dark:text-slate-400 text-center p-8 bg-[#F0E4D3] dark:bg-slate-800/50 rounded-2xl border border-[#DCC5B2] dark:border-slate-700">No repositories found.</p>}
            

            
            <InfiniteScroll
              dataLength={repos.length}
              next={fetchMoreRepos}
              hasMore={hasMore}
              loader={<div className="flex justify-center my-6"><Spinner size={32} className="text-[#D9A299] dark:text-indigo-400" /></div>}
              endMessage={null}
              scrollThreshold={0.95}
            >
              <ul className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                {sortedRepos.map((repo, idx) => (
                  <RepositoryCard
                    key={`${repo.id}-${idx}`}
                    repo={repo}
                    languages={repoLanguages[repo.id]}
                  />
                ))}
              </ul>
            </InfiniteScroll>
          </div>
        )}
        {/* Loading bar for user or repo loading */}
        {(userLoading || reposLoading) && (
          <div className="absolute left-0 top-0 w-full h-1">
            <div className="h-full bg-gradient-to-r from-[#D9A299] to-[#DCC5B2] animate-pulse w-full"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
