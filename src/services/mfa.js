import axios from 'axios';

export const getNew2FAService = async () => {
  try {
    const response = await axios.get(`/api/users/getNew2FA`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuestionsService = async () => {
  try {
    const response = await axios.get(`/api/users/getQuestions`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const manageMfaService = async (payload) => {
  try {
    const response = await axios.post(`/api/users/mfa`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const loginService = async (payload) => {
  try {
    const response = await axios.post(`/api/auth/login`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const registerService = async (payload) => {
  try {
    const response = await axios.post(`/api/auth/register`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserService = async () => {
  try {
    const response = await axios.get(`/api/users/getUser`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postPhisingDataService = async (payload) => {
  try {
    const response = await axios.post(`/api/users/postPhisingData`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPhisingDataService = async () => {
  try {
    const response = await axios.get(`/api/users/getPhisingData`);
    return response;
  } catch (error) {
    throw error;
  }
};

//verification pin
export const verifyVerificationPinService = async (payload) => {
  try {
    const response = await axios.post(
      `/api/users/checkVerificationPin`,
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//otp
export const verifyOTPService = async (payload) => {
  try {
    const response = await axios.post(
      `/api/users/checkVerificationPin`,
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// security question
export const verifySecurityQuestionService = async (payload) => {
  try {
    const response = await axios.post(
      `/api/users/checkSecurityQuestion`,
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

//email notification
export const verifyEmailNotificationService = async (payload) => {
  try {
    const response = await axios.post(`/api/users/verifyEmailOtp`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};

// Authenticator app
export const verifyAuthenticatorService = async (payload) => {
  try {
    const response = await axios.post(`/api/users/verify2FA`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
