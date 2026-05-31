import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getYoutubeVideoData } from "../services/youtube.service.js";

export const analyzeYoutube = asyncHandler(async(req, res) => {
    const {url} = req.body;

    if(!url){
        throw new ApiError(400, "Youtube URL is required");
    }

    const transcript = await getYoutubeVideoData(url);

    if(!transcript){
        throw new ApiError(500, "Error generating transcript");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {transcript},
            "Transcript generated successfully"
        )
    )
})