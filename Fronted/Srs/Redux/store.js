import { configureStore, createSlice } from '@reduxjs/toolkit';

const savedUser = localStorage.getItem('imovies_user');
const savedToken = localStorage.getItem('imovies_token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('imovies_user', JSON.stringify(action.payload.user));
      localStorage.setItem('imovies_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('imovies_user');
      localStorage.removeItem('imovies_token');
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer
  }
});
