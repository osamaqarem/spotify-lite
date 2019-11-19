import React from "react";
import { Text, ToastAndroid, View } from "react-native";
import FastImage from "react-native-fast-image";
import {
  ScrollView,
  Switch,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { COLORS } from "../../utils";

const cover = { url: require("../../data/assets/exampleCover.jpg") };

const PlayListDetailsHeader = () => (
  <View
    style={{
      height: 50,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
    }}>
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <View
        style={{
          height: 10,
          width: 10,
          backgroundColor: COLORS.grey,
          position: "absolute",
          left: 15,
        }}
      />
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          letterSpacing: 0.6,
          color: COLORS.white,
        }}>
        Psyche Pop & Surf Rock
      </Text>
      <View
        style={{
          height: 10,
          width: 10,
          backgroundColor: COLORS.green,
          position: "absolute",
          right: 15,
        }}></View>
      <View
        style={{
          height: 10,
          width: 10,
          backgroundColor: "crimson",
          position: "absolute",
          right: 35,
        }}></View>
    </View>
  </View>
);

const PlaylistDetailsScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}>
      <PlayListDetailsHeader />
      <View
        style={{
          top: 80,
          position: "absolute",
          alignSelf: "center",
          alignItems: "center",
        }}>
        <FastImage
          style={{
            height: 175,
            width: 175,
          }}
          source={cover.url}></FastImage>
        <View style={{ top: 20, alignItems: "center" }}>
          <Text
            style={{
              color: COLORS.white,
              fontSize: 18,
              fontWeight: "bold",
              letterSpacing: 0.6,
            }}>
            Psyche Pop & Surf Rock
          </Text>
          <Text
            style={{
              top: 5,
              color: COLORS.lightGrey,
              fontSize: 14,
              letterSpacing: 0.6,
            }}>
            by Delicieuse Musique
          </Text>
        </View>
      </View>
      <ShuffleButton />
      <View
        style={{
          flex: 1,
          top: 410,
          marginHorizontal: 10,
          // backgroundColor: "crimson",
        }}>
        <DownloadHeader />
        <ScrollView>
          {albumData.map((track, index) => (
            <Track key={index} title={track.name} artist={track.artist} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const DownloadHeader = () => (
  <View
    style={{
      flexDirection: "row",
      marginBottom: 10,
    }}>
    <Text
      style={{
        flex: 1,
        color: COLORS.darkWhite,
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1,
      }}>
      Download
    </Text>
    <Switch
      value={false}
      style={{ flex: 1 }}
      onValueChange={() =>
        ToastAndroid.showWithGravity(
          "Not implemented",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        )
      }
      thumbColor={COLORS.grey}
      trackColor={{ false: COLORS.darkGrey, true: "green" }}
    />
  </View>
);

const Track = ({ title, artist }: { title: string; artist: string }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 12.5,
    }}>
    <View
      style={{
        flex: 1,
        flexDirection: "column",
      }}>
      <Text
        style={{
          color: COLORS.white,
          fontSize: 16,
          letterSpacing: 0.6,
        }}>
        {title}
      </Text>
      <Text
        style={{ color: COLORS.lightGrey, fontSize: 12.5, letterSpacing: 0.6 }}>
        {artist}
      </Text>
    </View>
    <DotsView />
  </View>
);

const DotsView = () => (
  <View style={{ flexDirection: "column", marginRight: 10 }}>
    <View
      style={{
        height: 2.5,
        width: 2.5,
        borderRadius: 2,
        backgroundColor: COLORS.grey,
        marginBottom: 5.5,
      }}
    />
    <View
      style={{
        height: 2.5,
        width: 2.5,
        borderRadius: 2,
        backgroundColor: COLORS.grey,
        marginBottom: 5.5,
      }}
    />
    <View
      style={{
        height: 2.5,
        width: 2.5,
        borderRadius: 2,
        backgroundColor: COLORS.grey,
      }}
    />
  </View>
);

const ShuffleButton = () => {
  return (
    <View style={{ top: 350, position: "absolute", alignSelf: "center" }}>
      <TouchableWithoutFeedback
        style={{
          width: 230,
          height: 50,
          backgroundColor: COLORS.green,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 32,
        }}>
        <Text
          style={{
            color: COLORS.white,
            fontSize: 14,
            letterSpacing: 2,
            fontWeight: "bold",
          }}>
          SHUFFLE PLAY
        </Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

const albumData = [
  { name: "Be on My Side", artist: "Kip Nelson" },
  { name: "Personal", artist: "Blue Material" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
  { name: "Morning Song", artist: "Babe Rainbow" },
];

export default PlaylistDetailsScreen;
