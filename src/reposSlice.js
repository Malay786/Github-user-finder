import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export const fetchRepos = createAsyncThunk(
  'repos/fetchRepos',
  async ({ username, page = 1, perPage = 10 }) => {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });
    if (res.status === 403) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    if (!res.ok) throw new Error('Could not fetch repositories');
    return res.json();
  }
);

const reposSlice = createSlice({
  name: 'repos',
  initialState: {
    items: [],
    loading: false,
    error: '',
    page: 1,
    perPage: 10,
    sortByStars: false, // true = sort by stars, false = original order
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    toggleSortByStars(state) {
      state.sortByStars = !state.sortByStars;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepos.pending, (state, action) => {
        state.loading = true;
        state.error = '';
        // Only clear items if fetching the first page
        if (!action.meta.arg || action.meta.arg.page === 1) {
          state.items = [];
        }
      })
      .addCase(fetchRepos.fulfilled, (state, action) => {
        state.loading = false;
        // If page > 1, append; else, replace
        if (action.meta.arg && action.meta.arg.page > 1) {
          state.items = [...state.items, ...action.payload];
        } else {
          state.items = action.payload;
        }
      })
      .addCase(fetchRepos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setPage, toggleSortByStars } = reposSlice.actions;

// Selector to get sorted repos
export const selectSortedRepos = (state) => {
  const { items, sortByStars } = state.repos;
  
  if (!sortByStars) {
    return items; // Return original order
  }
  
  // Sort by stars (descending - most stars first)
  return [...items].sort((a, b) => b.stargazers_count - a.stargazers_count);
};

export default reposSlice.reducer; 