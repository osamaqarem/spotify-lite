import AsyncStorage from "@react-native-community/async-storage"
import reactotron from "reactotron-react-native"

class SpotifyAsyncStoreService {
  private TOKEN_KEY = "TOKEN_KEY"
  private TRACK_DATA_KEY = "TRACK_DATA_KEY"

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

  async putTrackData(data: string) {
    try {
      await AsyncStorage.setItem(this.TRACK_DATA_KEY, data)
    } catch (e) {
      console.warn("StorageClient: Failed to put track data")
      __DEV__ && reactotron.log!(e)
    }
  }

  async getTrackData() {
    try {
      return await AsyncStorage.getItem(this.TRACK_DATA_KEY)
    } catch (e) {
      console.warn("StorageClient: Failed to get track data")
      __DEV__ && reactotron.log!(e)
    }
  }
}

export default new SpotifyAsyncStoreService()
