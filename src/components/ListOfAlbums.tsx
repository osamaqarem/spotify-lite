import React from "react";
import { FlatList, View } from "react-native";
import { SavedAlbumType } from "../redux/reducers/libraryReducer";
import { COLORS } from "../utils";
import Album from "./Album";

const ListOfAlbums = ({
  currentUserAlbums,
}: {
  currentUserAlbums: SavedAlbumType[];
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}>
      <FlatList
        data={currentUserAlbums}
        renderItem={album => <Album album={album} />}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

export default ListOfAlbums;
