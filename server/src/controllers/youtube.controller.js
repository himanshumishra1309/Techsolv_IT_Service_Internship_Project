import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getYoutubeVideoData } from "../services/youtube.service.js";
import { ingestVideo } from "../services/ingestion.service.js";

export const analyzeYoutube = asyncHandler(async(req, res) => {
    const { url, sessionId, videoId } = req.body;

    if(!url || !sessionId || !videoId){
        throw new ApiError(400, "Youtube URL, sessionId, and videoId are required");
    }

    const { platform, transcript, metadata } = await getYoutubeVideoData(url);

    if(!transcript){
        throw new ApiError(500, "Error generating transcript");
    }

    const ingestionResult = await ingestVideo(transcript, metadata, sessionId, videoId);

    return res.status(200).json(
        new ApiResponse(
            200,
            { platform, transcript, metadata, ingestionResult },
            "Transcript generated and ingested successfully"
        )
    )
})