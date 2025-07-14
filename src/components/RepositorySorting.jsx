import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSortByStars } from '../reposSlice';

const RepositorySorting = () => {
  const dispatch = useDispatch();
  const sortByStars = useSelector((state) => state.repos.sortByStars);

  const handleToggleSort = () => {
    dispatch(toggleSortByStars());
  };

  return (
    <div className="flex justify-center mb-6">
      <button
        onClick={handleToggleSort}
        className={`px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
          sortByStars
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white dark:from-yellow-600 dark:to-orange-600 dark:hover:from-yellow-700 dark:hover:to-orange-700'
            : 'bg-gradient-to-r from-[#D9A299] to-[#DCC5B2] hover:from-[#DCC5B2] hover:to-[#F0E4D3] text-black border border-[#DCC5B2] dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-700 dark:hover:to-purple-700 dark:text-white dark:border-transparent'
        }`}
      >
        <span className="text-lg">⭐</span>
        {sortByStars ? 'Show Original Order' : 'Sort by Stars'}
      </button>
    </div>
  );
};

export default RepositorySorting; 