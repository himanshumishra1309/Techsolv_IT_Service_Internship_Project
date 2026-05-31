import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getInstagramReelData } from "../services/instagram.service.js";

export const processInstagramReel = asyncHandler(async(req, res) => {
    const {reelUrl} = req.body;

    if(!reelUrl){
        throw new ApiError(400, "Instagram reel is required");
    }

    const reelMetadata = await getInstagramReelData(reelUrl);

    if(!reelMetadata){
        throw new ApiError(500, "Reel metadata not received");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            reelMetadata,
            "Metadata fetched successfully"
        )
    )
})