import NetInfo from "@react-native-community/netinfo";

const isInternetReachable = async () => {
  const state = await NetInfo.fetch();

  return state.isInternetReachable;
};

const NetworkHelper = {
  isInternetReachable,
};

export default NetworkHelper;
