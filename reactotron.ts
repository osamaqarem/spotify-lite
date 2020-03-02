import Reactotron from "reactotron-react-native"
import AsyncStorage from "@react-native-community/async-storage"
import { reactotronRedux } from "reactotron-redux"

declare global {
  interface Console {
    tron: typeof console.log
    rtron: Required<typeof Reactotron>
  }
}

let reactotron

if (__DEV__) {
  reactotron = Reactotron.setAsyncStorageHandler!(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
    .configure() // controls connection & communication settings
    .use(reactotronRedux())
    .useReactNative({
      networking: {
        ignoreUrls: /https:\/\/clients3.google.com\/generate_204/,
      },
    }) // add all built-in react native plugins

  reactotron.connect()

  console.rtron = reactotron as Required<typeof Reactotron>
  console.tron = reactotron.logImportant!
}

export default reactotron as Required<typeof Reactotron>
