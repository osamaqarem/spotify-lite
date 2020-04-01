import NetInfo from "@react-native-community/netinfo"

class NetworkHelper {
  public isInternetReachable = false

  unsubscribe = NetInfo.addEventListener(state => {
    this.isInternetReachable = state.isInternetReachable ?? false
  })
}

export default new NetworkHelper()
