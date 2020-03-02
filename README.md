<p align="center">
  <a>
    <img width="100px" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/icon.png">
  </a>
  <h1 align="center">Spotify Lite - React Native</h1>  
</p>

[![Build Status](https://travis-ci.com/osamaq/react-native-spotify-lite.svg?token=zR9jL4Gd5mWdyyzMybgQ&branch=master)](https://travis-ci.com/osamaq/react-native-spotify-lite)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-%23ff69b4)

<p align="center">
  <!-- <a>
      <img width="400px" src="">
  </a> -->
</p>
<p align="center">
  <a >
      <img width="160px" style="margin: 10px 10px;" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/oss.png">
  </a>
  <a > 
      <img width="160px" style="margin: 10px 10px;" src="https://github.com/osamaq/spotify-lite/raw/master/docs/assets/apkbadge.png">
  </a>
</p>

Based on the [Spotify Lite app for Android](https://play.google.com/store/apps/details?id=com.spotify.lite&referrer=adjust_reftag%3Dcc6cp0nuUCn33%26utm_source%3DLanding%2Bpage).

<br />

## Features

- Authentication
- Recently Played
- Featured Playlists
- Top Artists
- Related Artists
- Explore
- Search for playlists, artists, albums and songs
- View your saved playlists, artists, albums and songs.
- Caching

**Note**: I don't plan on 100% feature matching the real app (PRs welcome for new features/bug fixes).

## Development

- Connect/start your preferred device/emulator.

```bash
# Clone this repo
$ git clone https://github.com/osamaq/spotify-lite.git
$ cd spotify-lite

# Install dependencies
$ yarn install
```

- iOS

```bash
# iOS only – install pods
$ cd ios && pod install && cd ..
$ yarn ios
```

- Android

```bash
# for android
$ yarn android
```

## TODO

- [ ] Details modal
- [ ] Like/Save
- [ ] Can we play music?
- [ ] Error UI
- [ ] Settings Menu
- [ ] Logout
- [ ] "You're offline" snackbar
- [ ] Image placeholders / loading state
