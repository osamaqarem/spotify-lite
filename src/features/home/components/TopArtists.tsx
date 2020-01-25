import React, { useContext } from "react";
import { Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import { connect, ConnectedProps } from "react-redux";
import { RootStoreType } from "../../../redux/types";
import AlbumItem from "./AlbumItem";
import { albumDimensions, styles } from "../styles";
import { setArtistId } from "../../../redux/actions";
import { NavigationContext } from "react-navigation";
import { Routes, btnScaleAnim } from "../../../utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

const TopArtists = ({
  userTopArtistsHeader,
  userTopArtists,
  setArtistId,
}: ReduxProps) => {
  const scale = new Animated.Value(1);
  const navigation = useContext(NavigationContext);

  const onArtistPressed = (id: string | undefined) => {
    if (id) {
      setArtistId(id);
      navigation.navigate(Routes.AppTabs.HomeStack.ArtistDetails);
    }
  };

  return (
    <>
      <Text style={[styles.centeredText, styles.headerText, { marginTop: 22 }]}>
        Your top artists
      </Text>
      <Animated.View
        style={[
          {
            width: albumDimensions.ALBUM_DIMEN_FEATURED + 70,
            alignSelf: "center",
            transform: [{ scale }],
          },
        ]}>
        <TouchableOpacity
          onPressIn={() => Animated.timing(scale, btnScaleAnim.in).start()}
          onPressOut={() => Animated.timing(scale, btnScaleAnim.out).start()}
          onPress={() => onArtistPressed(userTopArtistsHeader?.id)}>
          <FastImage
            source={{
              uri: userTopArtistsHeader?.url ?? "",
            }}
            style={{
              height: albumDimensions.ALBUM_DIMEN_FEATURED + 70,
              width: albumDimensions.ALBUM_DIMEN_FEATURED + 70,
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
      </Animated.View>
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