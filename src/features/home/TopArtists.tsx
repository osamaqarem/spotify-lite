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
import { TouchableOpacity } from "react-native-gesture-handler";

const TopArtists = ({
  userTopArtistsHeader,
  userTopArtists,
  setArtistId,
}: ReduxProps) => {
  const navigation = useContext(NavigationContext);

  const onArtistPressed = (id: string | undefined) => {
    if (id) {
      setArtistId(id);
      navigation.navigate(Routes.DetailsRoutes.ArtistDetails);
    }
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
        <TouchableOpacity
          onPress={() => onArtistPressed(userTopArtistsHeader?.id)}>
          <FastImage
            source={{
              uri: userTopArtistsHeader?.url ?? "",
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
            {userTopArtistsHeader?.name}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {userTopArtists?.map(album => (
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
