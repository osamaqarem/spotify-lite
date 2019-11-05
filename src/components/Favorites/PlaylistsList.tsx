import React from "react";
import { View, StyleSheet, FlatList, Text, Image } from "react-native";
import { COLORS } from "../../utils";
import FastImage from "react-native-fast-image";

type RenderItemType = { item: any; index: number };

const renderItem = ({ item, index }: RenderItemType, username: string) => {
  return (
    <View
      style={{
        marginLeft: 15,
        marginVertical: 10,
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
      }}>
      {index === 0 && (
        <>
          <FastImage
            source={require("../../assets/savedTracks.jpg")}
            style={{
              height: 50,
              width: 50,
            }}
          />
          <View
            style={{
              marginLeft: 10,
              justifyContent: "center",
              paddingRight: "50%",
              marginBottom: 25,
            }}>
            <Text style={styles.playlistTitle}>Favorite Songs</Text>
            <Text style={styles.playlistOwner}>
              {/* {totalRecords} favorite songs */}
              545 favorite songs
            </Text>
          </View>
        </>
      )}
      {item.url ? (
        <FastImage
          source={{
            uri: item.url,
          }}
          style={{
            height: 50,
            width: 50,
          }}
        />
      ) : (
        <FastImage
          source={require("../../assets/noPlaylistImage.jpg")}
          style={{
            height: 50,
            width: 50,
          }}
        />
      )}
      <View
        style={{
          marginLeft: 10,
          justifyContent: "center",
        }}>
        <Text style={styles.playlistTitle}>{item.name}</Text>
        <Text style={styles.playlistOwner}>
          by {item.owner === username ? "you" : item.owner}
        </Text>
      </View>
    </View>
  );
};

const PlaylistsList = ({ data, username }: { data: any; username: string }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item, index }: RenderItemType) => {
          return renderItem({ item, index }, username);
        }}
        keyExtractor={(item, index) => {
          return index + "";
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  playlistTitle: {
    color: COLORS.textLight,
    textAlignVertical: "center",
    fontSize: 16,
  },
  playlistOwner: {
    color: COLORS.textDim,
    textAlignVertical: "center",
  },
});

export default PlaylistsList;
