import { ApiError } from "../utils/ApiError.js";
import {YoutubeTranscript} from "youtube-transcript"

export const getYoutubeTranscript = async(url) => {
    try {
        const transcriptData = await YoutubeTranscript.fetchTranscript(url);
        const transcript = transcriptData.map(item => item.text).join(" ");
        return transcript;
    } catch (error) {
        throw new ApiError(500, error)
    }
}