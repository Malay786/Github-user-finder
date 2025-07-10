import React, { forwardRef } from 'react';

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  Go: '#00ADD8',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Rust: '#dea584',
  Dart: '#00B4AB',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Vue: '#41b883',
  SCSS: '#c6538c',
  // ... add more as needed
  Other: '#cccccc',
};

// Hash function to generate a color from a string
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

const getLanguageBarData = (languages, repoName) => {
  if (!languages || Object.keys(languages).length === 0) return [];
  const entries = Object.entries(languages);
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 5); // Only top 5
  const other = sorted.slice(5);
  let bar = top.map(([lang, bytes]) => ({
    lang,
    percent: (bytes / total) * 100,
    color: LANGUAGE_COLORS[lang] || stringToColor(`${repoName}-${lang}`),
    bytes,
  }));
  if (other.length) {
    const otherBytes = other.reduce((sum, [, bytes]) => sum + bytes, 0);
    bar.push({
      lang: 'Other',
      percent: (otherBytes / total) * 100,
      color: LANGUAGE_COLORS.Other,
      bytes: otherBytes,
    });
  }
  return bar;
};

const RepositoryCard = forwardRef(({ repo, languages }, ref) => {
  const barData = getLanguageBarData(languages, repo.name);
  return (
    <li
      ref={ref}
      className="bg-gradient-to-br from-[#FAF7F3] to-[#F0E4D3] dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#DCC5B2] dark:border-slate-600 hover:border-[#D9A299] dark:hover:border-indigo-500 h-78 max-h-78 min-h-78 backdrop-blur-sm"
    >
      <div className="flex flex-col flex-grow h-full">
        <div className="flex items-center justify-between mb-3">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black dark:text-slate-100 font-bold text-lg hover:text-[#D9A299] dark:hover:text-indigo-400 truncate transition-colors"
          >
            {repo.name}
          </a>
          <span className="text-black dark:text-slate-300 text-base font-medium flex items-center ml-3 shrink-0 bg-[#F0E4D3] dark:bg-slate-700 px-3 py-1 rounded-full">
            <span className="mr-1 text-yellow-500">⭐</span> {repo.stargazers_count}
          </span>
        </div>
        {repo.description && (
          <p className="text-black dark:text-slate-300 text-sm line-clamp-3 flex-shrink-0 overflow-hidden leading-relaxed">
            {repo.description}
          </p>
        )}
        {barData.length > 0 && (
          <div className="mt-6">
            {/* Language bar */}
            <div className="flex h-3 w-full rounded-full overflow-hidden mb-3 shadow-inner">
              {barData.map((item, idx) => (
                <div
                  key={item.lang}
                  style={{ width: `${item.percent}%`, background: item.color }}
                  className="h-full transition-all duration-300"
                  title={`${item.lang}: ${item.percent.toFixed(1)}%`}
                />
              ))}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {barData.map((item) => (
                <span key={item.lang} className="flex items-center gap-1 text-black dark:text-slate-300 bg-[#F0E4D3] dark:bg-slate-700 px-2 py-1 rounded-full max-w-full">
                  <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }}></span>
                  <span className="font-medium truncate tracking-tight">{item.lang} {item.percent >= 1 ? item.percent.toFixed(1) : '<1'}%</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </li>
  );
});

export default RepositoryCard; 