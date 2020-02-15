import Reactotron, { overlay } from "reactotron-react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { reactotronRedux } from "reactotron-redux";

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
  .configure() // controls connection & communication settings
  .use(overlay()) // Image overlay
  .use(reactotronRedux())
  .useReactNative(); // add all built-in react native plugins

if (__DEV__) {
  reactotron.connect();
}

export default reactotron;
