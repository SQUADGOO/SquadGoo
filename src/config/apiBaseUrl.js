import { Platform } from 'react-native';

/**
 * SquadGoo backend dev API (same as admin REACT_APP_API_URL).
 * Android emulator: 10.0.2.2 → host localhost. iOS simulator: localhost.
 */
const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:5000/api/`
  : 'https://apis.squadgoo.com/api/';
