import React from "react";
import { FlatList, View } from "react-native";
import { AlbumType } from "../data/models";
import { COLORS } from "../utils";
import Artist from "./Artist";

const ListOfArtists = ({
  currentUserArtists,
}: {
  currentUserArtists: AlbumType[];
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}>
      <FlatList
        data={currentUserArtists}
        renderItem={artist => <Artist artist={artist} />}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

export default ListOfArtists;
