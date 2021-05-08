import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import authReducer from './auth/authSlice';
import mfaReducer from './mfa/mfaSlice';
import storage from 'redux-persist/lib/storage';

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  keyPrefix: 'redux-',
  blacklist: ['isLoading', 'error'],
  whitelist: ['isAuthenticated', 'user'],
};

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  keyPrefix: 'redux-',
  version: 1,
  whitelist: ['theme', 'mfa'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  mfa: mfaReducer,
});

export { rootReducer, rootPersistConfig };
