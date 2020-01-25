import React from "react";
import { FlatList, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import PlaylistRowFav from "../features/favorites/favorite-playlists/components/PlaylistFavRow";
import { SavedPlaylistsType } from "../redux/reducers/playlistReducer";
import { COLORS } from "../utils";
import Playlist, { playlistStyle } from "./Playlist";

const ListOfPlaylists = ({
  currentUserPlaylists,
  savedTracksCount,
  username,
  onPlaylistPressed,
  onFavSongsPressed,
}: {
  currentUserPlaylists: SavedPlaylistsType[];
  savedTracksCount: number | null;
  username: string;
  onPlaylistPressed: (id: string) => void;
  onFavSongsPressed: () => void;
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}>
      <FlatList
        ListHeaderComponent={
          <TouchableOpacity
            onPress={onFavSongsPressed}
            style={{
              marginLeft: playlistStyle.left,
              marginVertical: playlistStyle.vertical,
              marginBottom: -playlistStyle.vertical * 2,
            }}>
            <PlaylistRowFav savedTracksCount={savedTracksCount} />
          </TouchableOpacity>
        }
        data={currentUserPlaylists}
        renderItem={({ item }) => (
          <Playlist
            {...{
              item,
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
