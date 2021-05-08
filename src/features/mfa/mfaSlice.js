import { createSlice } from '@reduxjs/toolkit';
import {
  getNew2FAService,
  getQuestionsService,
  getUserService,
  manageMfaService,
  getPhisingDataService,
  postPhisingDataService,
} from '../../services/mfa';
import QRCode from 'qrcode';

const initialState = {
  isLoading: false,
  secret: '',
  error: '',
  questions: [],
  phisingData: [],
  mfaDetails: {},
};

export const mfaSlice = createSlice({
  name: 'mfa',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setSecret: (state, action) => {
      state.secret = action.payload;
    },
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setMfaDetails: (state, action) => {
      state.mfaDetails = action.payload;
    },
    setPhisingData: (state, action) => {
      state.phisingData = action.payload;
    },
  },
});

export const {
  startLoading,
  setSecret,
  setError,
  setQuestions,
  setMfaDetails,
  setPhisingData,
} = mfaSlice.actions;

export const selectLoadingState = (state) => state.mfa.isLoading;
export const selectSecretState = (state) => state.mfa.secret;
export const selectErrorInMfa = (state) => state.mfa.error;
export const selectQuestions = (state) => state.mfa.questions;
export const selectMfaDetails = (state) => state.mfa.mfaDetails;
export const selectPhisingData = (state) => state.mfa.phisingData;

export default mfaSlice.reducer;

export function getNew2FAAction() {
  return async (dispatch) => {
    dispatch(mfaSlice.actions.startLoading());
    try {
      const response = await getNew2FAService();
      const url = await QRCode.toDataURL(response.data.otpauth_url);
      dispatch(mfaSlice.actions.setSecret(url));
      dispatch(mfaSlice.actions.stopLoading());
    } catch (error) {
      dispatch(mfaSlice.actions.setError(error));
    }
  };
}

export function getQuestionsAction() {
  return async (dispatch) => {
    dispatch(mfaSlice.actions.startLoading());
    try {
      const response = await getQuestionsService();
      dispatch(mfaSlice.actions.setQuestions(response.data));
      dispatch(mfaSlice.actions.stopLoading());
    } catch (error) {
      dispatch(mfaSlice.actions.setError(error));
    }
  };
}

export function manageMfaAction(payload) {
  return async (dispatch) => {
    dispatch(mfaSlice.actions.startLoading());
    try {
      await manageMfaService(payload);
      dispatch(mfaSlice.actions.stopLoading());
    } catch (error) {
      dispatch(mfaSlice.actions.setError(error));
    }
  };
}

export function getUserAction() {
  return async (dispatch) => {
    dispatch(mfaSlice.actions.startLoading());

    try {
      let _result = await getUserService();
      dispatch(mfaSlice.actions.qr_url(_result.data.mfa.otpauth_url));
      dispatch(mfaSlice.actions.stopLoading());
    } catch (error) {
      dispatch(mfaSlice.actions.setError(error));
    }
  };
}

export function setSecretAction(payload) {
  return async (dispatch) => {
    dispatch(mfaSlice.actions.startLoading());

    try {
      const url = await QRCode.toDataURL(payload);
      dispatch(mfaSlice.actions.setSecret(url));
      dispatch(mfaSlice.actions.stopLoading());
    } catch (error) {
      dispatch(mfaSlice.actions.setError(error));
    }
  };
}

export function getPhisingDataAction() {
  return async (dispatch) => {
    dispatch(mfaSlice.actions.startLoading());

    try {
      let _result = await getPhisingDataService();
      dispatch(mfaSlice.actions.setPhisingData(_result.data));
      dispatch(mfaSlice.actions.stopLoading());
    } catch (error) {
      dispatch(mfaSlice.actions.setError(error));
    }
  };
}

export function postPhisingDataAction(payload) {
  return async (dispatch) => {
    dispatch(mfaSlice.actions.startLoading());

    try {
      let _result = await postPhisingDataService(payload);
      if (_result.status === 200) {
        dispatch(getPhisingDataAction());
        dispatch(mfaSlice.actions.stopLoading());
      }
    } catch (error) {
      dispatch(mfaSlice.actions.setError(error));
    }
  };
}
