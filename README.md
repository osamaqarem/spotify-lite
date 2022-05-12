<p align="center">
  <a>
    <img width="100px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/icon.png">
  </a>
  <h1 align="center">Spotify Lite - React Native</h1>  
</p>

Based on the [Spotify Lite app for Android](https://play.google.com/store/apps/details?id=com.spotify.lite&referrer=adjust_reftag%3Dcc6cp0nuUCn33%26utm_source%3DLanding%2Bpage).

## Features

- Home feed (recently played, featured playlists and your top artists).
- Explore genres.
- Remote playback control
- View playlists, artists and albums.
- View your music library.
- Search.
- Like/follow.

## Try The App

You will need a [Spotify](https://www.spotify.com/us/) account to login.

### Android

You can download the latest APK [here](https://github.com/osamaq/spotify-lite/tree/master/docs/apk).

### iOS

You need to build from source. See [development](#Development).


### Notes

- For a real app, you don't want to perform authentication as done here. Consider using [react-native-inappbrowser](https://github.com/proyecto26/react-native-inappbrowser) or [react-native-app-auth](https://github.com/FormidableLabs/react-native-app-auth). With an in-app browser, an existing authentication session can be reused if it exists in the user's browser. It's also a sign of security to your users as the page cannot be manipulated via JavaScript by the developer.

## Screenshots

iOS

<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/iphone11/splash.png"> <img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/iphone11/home.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/iphone11/explore.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/iphone11/favorites.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/iphone11/playlist.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/iphone11/related-artists.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/iphone11/genre.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/iphone11/search-history.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/iphone11/results.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/iphone11/search.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/iphone11/see-all-songs.png">

### Android

<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/pixel3/splash.png"> <img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/pixel3/home.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/pixel3/explore.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/pixel3/favorites.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/pixel3/playlist.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/pixel3/related-artists.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/pixel3/genre.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/pixel3/search-history.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/pixel3/results.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/pixel3/search.png">
<img width="288px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/screenshots/pixel3/see-all-songs.png">

## Development

```bash
# Dependencies
yarn install

# iOS only
cd ios && pod install && cd ..

# Run iOS
npx react-native run-ios

# Run Android
npx react-native run-android

```

You can also refer to available [npm scripts](https://github.com/osamaq/spotify-lite/blob/b8f763b48ec95ed7e1b4cacfae750b57051cd68e/package.json#L5).


## TODO

- [ ] Details modal
- [ ] Settings Menu
- [ ] Logout
- [ ] Error UI
- [ ] Image placeholders / loading state
- [ ] Play a specific song/artist/playlist
- [ ] Music player screen
- [ ] Error boundary – Restart app button
- [ ] See All Artists - Navigate to artist
