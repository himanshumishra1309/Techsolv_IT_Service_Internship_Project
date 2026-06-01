import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getInstagramReelData } from "../services/instagram.service.js";
import { ingestVideo } from "../services/ingestion.service.js";

export const processInstagramReel = asyncHandler(async(req, res) => {
    const { reelUrl, sessionId, videoId } = req.body;

    if(!reelUrl || !sessionId || !videoId){
        throw new ApiError(400, "Instagram reel, sessionId, and videoId are required");
    }

    const reelData = await getInstagramReelData(reelUrl);

    if(!reelData){
        throw new ApiError(500, "Reel metadata not received");
    }

    const ingestionResult = await ingestVideo(reelData.transcript, reelData.metadata, sessionId, videoId);

    return res.status(200).json(
        new ApiResponse(
            200,
            { ...reelData, ingestionResult },
            "Metadata fetched and ingested successfully"
        )
    )
})