import NetInfo from "@react-native-community/netinfo"

class NetworkHelper {
  public isInternetReachable = false

  unsubscribe = NetInfo.addEventListener((state) => {
    // in iOS simulator, state.isInternetReachable is always false.
    if (__DEV__ && state.isConnected) {
      this.isInternetReachable = true
    } else {
      this.isInternetReachable = state.isInternetReachable ?? false
    }
  })
}

export default new NetworkHelper()
