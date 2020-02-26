import { useEffect, useState, useReducer, useCallback } from "react";
import { from, Subscription, zip } from "rxjs";
import { switchMap } from "rxjs/operators";
import {
  AlbumType,
  Artist,
  ErrorResponse,
  Track,
  ProfileResponse,
} from "../../data/models/spotify";
import { redoLogin } from "../../redux/actions";
import {
  TrackType,
  PlaylistDetailsType,
} from "../../redux/reducers/playlistReducer";
import { REST_API, COLORS } from "../../utils/constants";
import ImageColors from "react-native-image-colors";

type Props = {
  token: string | null;
  artistId: string | null;
  profile: ProfileResponse | null;
  redoLogin: typeof redoLogin;
};

type ArtistDetails = PlaylistDetailsType & { relatedArtists: AlbumType[] };

const initialState = {
  dominantColor: COLORS.background,
  isLoading: true,
};

const useArtistDetails = ({ token, artistId, profile, redoLogin }: Props) => {
  const [artistDetails, setArtistDetails] = useState<null | ArtistDetails>(
    null,
  );
  const [{ isLoading, dominantColor }, setState] = useReducer(
    // eslint-disable-next-line
    (state = initialState, payload: typeof initialState) => ({ ...payload }),
    { isLoading: true, dominantColor: COLORS.background },
  );

  const setDefaultColors = () => {
    setState({
      dominantColor: COLORS.tabBar,
      isLoading: false,
    });
  };

  const handleGradientColor = useCallback(async (url: string | undefined) => {
    if (url) {
      try {
        const colors = await ImageColors.getColors(url, { average: true });
        if (colors.platform === "android") {
          setState({
            dominantColor: colors.average,
            isLoading: false,
          });
        } else {
          setState({
            dominantColor: colors.background,
            isLoading: false,
          });
        }
      } catch (e) {
        console.warn(e);
        setDefaultColors();
      }
    } else {
      setDefaultColors();
    }
  }, []);

  // fetch data
  useEffect(() => {
    let subscription: Subscription | undefined;

    const fetchData = async () => {
      try {
        if (artistId) {
          const artist$ = from(
            fetch(REST_API.getArtistById(artistId), {
              method: "GET",
              headers: {
                authorization: `Bearer ${token}`,
              },
            }),
          ).pipe(switchMap(res => res.json()));

          const topTracks$ = from(
            fetch(REST_API.getArtistTopTracks(artistId, profile!.country), {
              method: "GET",
              headers: {
                authorization: `Bearer ${token}`,
              },
            }),
          ).pipe(switchMap(res => res.json()));

          const relatedArtists$ = from(
            fetch(REST_API.getRelatedArtistsById(artistId), {
              method: "GET",
              headers: {
                authorization: `Bearer ${token}`,
              },
            }),
          ).pipe(switchMap(res => res.json()));

          subscription = zip(artist$, topTracks$, relatedArtists$).subscribe(
            async ([artist, topTracks, relatedArtistsList]: [
              Artist | ErrorResponse,
              { tracks: Track[] } | ErrorResponse,
              { artists: Artist[] } | ErrorResponse,
            ]) => {
              if ("error" in artist) {
                throw artist.error.message;
              }
              if ("error" in topTracks) {
                throw topTracks.error.message;
              }
              if ("error" in relatedArtistsList) {
                throw relatedArtistsList.error.message;
              }

              const tracks: TrackType[] = topTracks.tracks.map(item => ({
                artistName:
                  item.artists[0].name ?? "No track returned by spotify :(",
                name: item.name ?? "No track",
              }));

              const relatedArtists: AlbumType[] = relatedArtistsList.artists.map(
                artist => ({
                  name: artist.name,
                  imageURL: artist.images[0]?.url,
                  id: artist.id,
                }),
              );

              setArtistDetails({
                imageUrl: artist.images[0].url,
                name: artist.name,
                ownerName: artist.name,
                tracks,
                relatedArtists,
              });

              await handleGradientColor(artist.images[0]?.url);
            },
          );
        }
      } catch (err) {
        if (err.message.includes("expired")) {
          redoLogin();
        } else {
          console.warn(err);
        }
      }
    };

    // only run the effect if details are currently null
    if (!artistDetails) {
      fetchData();
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [token, artistId, artistDetails, profile, redoLogin, handleGradientColor]);

  return { artistDetails, isLoading, dominantColor };
};

export default useArtistDetails;
