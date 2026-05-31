import { ApiError } from "../utils/ApiError.js";
import { YoutubeTranscript } from "youtube-transcript";
import youtubedl from "youtube-dl-exec";

export const getYoutubeVideoData = async (url) => {
    try {
        const parsedUrl = new URL(url);
        const videoId = parsedUrl.searchParams.get("v");
        const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        const transcriptData = await YoutubeTranscript.fetchTranscript(cleanUrl);
        const transcript = transcriptData.map(item => item.text).join(" ");

        console.log("transcript generated");

        const metadata = await youtubedl(cleanUrl, {dumpSingleJson: true});

        console.log("metadate generated");

        const videoMetadata = {
            title: metadata.title,
            creator: metadata.uploader,

            views: metadata.view_count,
            likes: metadata.like_count,
            comments: metadata.comment_count,

            duration: metadata.duration,
            uploadDate: metadata.upload_date,

            followerCount: metadata.channel_follower_count
        };

        const engagementRate =videoMetadata.views ? (((videoMetadata.likes || 0)+(videoMetadata.comments || 0))/videoMetadata.views)*100 : 0;

        videoMetadata.engagementRate = Number(engagementRate.toFixed(2));

        return {
            platform: "youtube",
            transcript,
            metadata: videoMetadata
        };

    } catch (error) {
        console.error(error);

        throw new ApiError(
            500,
            `Failed to process YouTube video: ${error.message}`
        );
    }
};