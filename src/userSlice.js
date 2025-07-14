import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export const fetchUser = createAsyncThunk('user/fetchUser', async (username) => {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  });
  if (res.status === 403) {
    throw new Error('API rate limit exceeded. Please try again later.');
  }
  if (!res.ok) throw new Error('User not found');
  const userData = await res.json();
  return userData;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = '';
        state.data = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer; 