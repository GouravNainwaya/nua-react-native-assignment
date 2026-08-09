import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  getString(key: string) {
    return AsyncStorage.getItem(key);
  },
  setString(key: string, value: string) {
    return AsyncStorage.setItem(key, value);
  },
  remove(key: string) {
    return AsyncStorage.removeItem(key);
  },
};
