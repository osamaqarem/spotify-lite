import { COLORS } from "../../utils";
import { StyleSheet } from "react-native";

const MARGIN_BOTTOM = 38;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  rowScrollContainer: { flexDirection: "row", marginLeft: 9 },
  centeredText: {
    alignSelf: "center",
    color: "white",
    fontWeight: "bold",
  },
  headerText: {
    fontSize: 18.5,
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginHorizontal: 15,
    marginBottom: MARGIN_BOTTOM,
  },
  albumText: {
    width: "94%",
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "normal",
    color: COLORS.grey,
    top: 10,
    fontSize: 13,
  },
});

const albumDimensions = {
  ROW_SCROLLVIEW_HEIGHT: 180,
  ALBUM_DIMEN_RECENT: 166 - MARGIN_BOTTOM,
  ALBUM_DIMEN_FEATURED: 156,
};

export { styles, albumDimensions };
