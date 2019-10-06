import AsyncStorage from "@react-native-community/async-storage";

export const storeTokens = async ({
  token,
  refreshToken,
}: {
  token: string;
  refreshToken: string;
}) => {
  try {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("refreshToken", refreshToken);
  } catch (e) {
    console.warn("storeTokens Error: " + e);
  }
};

export const getToken = async (key: "refreshToken" | "token") => {
  try {
    if (key === "token") {
      return await AsyncStorage.getItem("token");
    } else {
      return await AsyncStorage.getItem("refreshToken");
    }
  } catch (e) {
    console.warn("getToken Error: " + e);
  }
};
