import React from "react";
import { FlatList, View } from "react-native";
import { SavedAlbumType } from "../redux/reducers/libraryReducer";
import { COLORS } from "../utils";
import Album from "./Album";

const ListOfAlbums = ({
  currentUserAlbums,
  onPlaylistPressed,
}: {
  currentUserAlbums: SavedAlbumType[];
  onPlaylistPressed: (id: string) => void;
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}>
      <FlatList
        data={currentUserAlbums}
        renderItem={({ item }) => (
          <Album album={item} onPlaylistPressed={onPlaylistPressed} />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

export default ListOfAlbums;
