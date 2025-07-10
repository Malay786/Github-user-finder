import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSortByStars } from '../reposSlice';

const RepositorySorting = ({ isDarkMode }) => {
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
            ? isDarkMode
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white'
              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
            : isDarkMode
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
            : 'bg-gradient-to-r from-[#D9A299] to-[#DCC5B2] hover:from-[#DCC5B2] hover:to-[#F0E4D3] text-black border border-[#DCC5B2]'
        }`}
      >
        <span className="text-lg">⭐</span>
        {sortByStars ? 'Show Original Order' : 'Sort by Stars'}
      </button>
    </div>
  );
};

export default RepositorySorting; 