import React from "react";
import { FlatList, View } from "react-native";
import Playlist from "./Playlist";
import { SavedPlaylistsType } from "../redux/reducers/playlistReducer";
import { COLORS } from "../utils";

const ListOfPlaylists = ({
  currentUserPlaylists,
  savedTracksCount,
  username,
  onPlaylistPressed,
}: {
  currentUserPlaylists: SavedPlaylistsType[];
  savedTracksCount: number | null;
  username: string;
  onPlaylistPressed: (id: string) => void;
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
              onPlaylistPressed,
            }}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};
export default ListOfPlaylists;
