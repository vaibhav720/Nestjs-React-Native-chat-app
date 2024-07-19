import axios, { InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ICredentials } from './auth/interfaces/UserDetails';

export const baseUrl = 'http://localhost:4000';

/**
 * Retrieve Config Credentials
 */
const _retrieveConfigCredentials = async (
  config: InternalAxiosRequestConfig<any>,
) => {
  try {
    const credentials = await AsyncStorage.getItem('credentials');

    if (credentials !== null) {
      const { token } = JSON.parse(credentials) as ICredentials;
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log(error);
  }

  return config;
};

/**
 * Get Config With Headers
 */
const getConfigWithHeaders = async (
  config: InternalAxiosRequestConfig<any>,
) => {
  config.headers['Content-Type'] = 'application/json';
  return _retrieveConfigCredentials(config);
};

axios.interceptors.request.use(
  (config) => getConfigWithHeaders(config),
  (error) => {
    return Promise.reject(error);
  },
);

export const { get, post, put, delete: del } = axios;
