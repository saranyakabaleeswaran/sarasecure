import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  user: null,
  error: '',
  isDarkModeEnabled: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    enableDarkmode: (state) => {
      state.isDarkModeEnabled = !state.isDarkModeEnabled;
    },
    disableDarkMode: (state) => {
      state.isDarkModeEnabled = false;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = true;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthenticationFalse: (state) => {
      state.isAuthenticated = false;
    },
  },
});

export const {
  setUser,
  startLoading,
  stopLoading,
  enableDarkmode,
  disableDarkMode,
  setAuthenticated,
  setAuthenticationFalse,
} = authSlice.actions;

export const selectLoadingState = (state) => state.auth.isLoading;
export const selectIsDarkModeState = (state) => state.auth.isDarkModeEnabled;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
