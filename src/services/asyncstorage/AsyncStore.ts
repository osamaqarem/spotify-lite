import AsyncStorage from "@react-native-community/async-storage"
import reactotron from "reactotron-react-native"

class AsyncStore {
  private TOKEN_KEY = "TOKEN_KEY"

  async putToken(token: string) {
    try {
      await AsyncStorage.setItem(this.TOKEN_KEY, token)
    } catch (e) {
      console.warn("StorageClient: Failed to put token")
      __DEV__ && reactotron.log!(e)
    }
  }

  async getToken() {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY)
    } catch (e) {
      console.warn("StorageClient: Failed to get token")
      __DEV__ && reactotron.log!(e)
    }
  }

  async get(key: string) {
    try {
      return await AsyncStorage.getItem(key)
    } catch (e) {
      console.warn("StorageClient: Failed to get " + key)
      __DEV__ && reactotron.log!(e)
    }
  }

  async put(key: string, value: string) {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      console.warn("StorageClient: Failed to put pair " + `[${key}, ${value}]`)
      __DEV__ && reactotron.log!(e)
    }
  }
}

export default new AsyncStore()
