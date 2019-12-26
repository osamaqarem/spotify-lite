import React from "react";
import { FlatList, View } from "react-native";
import Playlist from "./Playlist";
import { SavedPlaylistsType } from "../redux/reducers/playlistReducer";
import { COLORS } from "../utils";

const ListOfPlaylists = ({
  currentUserPlaylists,
  savedTracksCount,
  username,
}: {
  currentUserPlaylists: SavedPlaylistsType[];
  savedTracksCount: number | null;
  username: string;
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}>
      <FlatList
        data={currentUserPlaylists}
        renderItem={({ item, index }) => (
          <Playlist
            {...{
              item,
              index,
              username,
              savedTracksCount: savedTracksCount,
            }}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};
export default ListOfPlaylists;
