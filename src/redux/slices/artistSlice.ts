import { createSlice } from "@reduxjs/toolkit"

type ArtistReducerType = {
  artistId: string | null
}

const initialState: ArtistReducerType = {
  artistId: null,
}

const artistSlice = createSlice({
  name: "artist",
  initialState,
  reducers: {
    setArtistId: (state, action) => ({ ...state, artistId: action.payload }),
  },
})

export const { setArtistId } = artistSlice.actions
export default artistSlice.reducer
