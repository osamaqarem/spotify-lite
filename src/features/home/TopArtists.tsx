import React, { useContext } from "react";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { connect, ConnectedProps } from "react-redux";
import { RootStoreType } from "../../redux/store";
import AlbumItem from "./AlbumItem";
import { albumDimensions, styles } from "./styles";
import { setArtistId } from "../../redux/actions";
import { NavigationContext } from "react-navigation";
import { Routes } from "../../utils";

const TopArtists = ({
  userTopArtistsHeader,
  userTopArtists,
  setArtistId,
}: ReduxProps) => {
  const navigation = useContext(NavigationContext);

  const onArtistPressed = (id: string) => {
    setArtistId(id);
    navigation.navigate(Routes.DetailsStack.ArtistDetails);
  };

  return (
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
          userTopArtists.map(album => (
            <AlbumItem
              key={album.id}
              {...{
                album,
                onPress: onArtistPressed,
              }}
            />
          ))}
      </View>
    </>
  );
};

const mapStateToProps = (state: RootStoreType) => ({
  userTopArtists: state.personalizationReducer.userTopArtists,
  userTopArtistsHeader: state.personalizationReducer.userTopArtistsHeader,
});

const mapDispatchToProps = {
  setArtistId,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(TopArtists);
