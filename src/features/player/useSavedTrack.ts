import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import SpotifyApiService from "../../services/network/SpotifyApiService"
import SpotifyHttpException from "../../services/network/exceptions/SpotifyHttpException"
import SpotifyEndpoints from "../../services/network/SpotifyEndpoints"

interface Props {
  id: string
}

const useSavedTrack = ({ id }: Props) => {
  const [isSaved, setIsSaved] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      try {
        const [res] = await SpotifyApiService.checkSavedTracks(id)

        if (typeof res === "boolean") {
          setIsSaved(res)
        } else {
          setIsSaved(undefined)
          throw new SpotifyHttpException(
            "success",
            "not a boolean: " + JSON.stringify(res),
            SpotifyEndpoints.checkSavedTracks(id),
          )
        }
      } catch (e) {
        console.warn(e)
      }
    })()
  }, [id])

  return isSaved
}

export default useSavedTrack
