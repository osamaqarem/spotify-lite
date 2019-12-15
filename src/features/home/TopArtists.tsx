import React from "react";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { connect, ConnectedProps } from "react-redux";
import { RootStoreType } from "../../redux/store";
import AlbumItem from "./AlbumItem";
import { albumDimensions, styles } from "./styles";

const TopArtists = ({ userTopArtistsHeader, userTopArtists }: ReduxProps) => (
  <>
    <Text style={[styles.centeredText, styles.headerText, { marginTop: 30 }]}>
      Your top artists
    </Text>
    <View
      style={[
        {
          width: albumDimensions.ALBUM_DIMEN_MADE + 70,
          alignSelf: "center",
        },
      ]}>
      <FastImage
        source={{
          uri: (userTopArtistsHeader && userTopArtistsHeader.url) || "",
        }}
        style={{
          height: albumDimensions.ALBUM_DIMEN_MADE + 70,
          width: albumDimensions.ALBUM_DIMEN_MADE + 70,
          marginTop: 20,
        }}
      />
      <Text
        numberOfLines={2}
        style={[
          styles.centeredText,
          styles.albumText,
          { marginBottom: 25, fontSize: 15 },
        ]}>
        {userTopArtistsHeader && userTopArtistsHeader.name}
      </Text>
    </View>
    <View style={styles.content}>
      {userTopArtists &&
        userTopArtists.map((album: any, index: number) => (
          <AlbumItem
            key={index}
            {...{
              album,
              index,
              onPress: () => {},
            }}
          />
        ))}
    </View>
  </>
);

const mapStateToProps = (state: RootStoreType) => ({
  userTopArtists: state.personalizationReducer.userTopArtists,
  userTopArtistsHeader: state.personalizationReducer.userTopArtistsHeader,
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(TopArtists);
