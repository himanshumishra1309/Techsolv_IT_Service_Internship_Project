import { ApiError } from "../utils/ApiError.js";
import youtubedl from "youtube-dl-exec";

export const getInstagramData = async (reelUrl) => {
  try {
    const info = await youtubedl(reelUrl, {
      dumpSingleJson: true,
      noWarnings: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
    });

    const metadata = {
      title: info.title,
      creator: info.uploader,
      channel: info.channel,
      description: info.description,
      duration: info.duration,
      uploadDate: info.upload_date,
      likes: info.like_count,
      comments: info.comment_count,
      thumbnail: info.thumbnail,
      hashtags: extractHashtags(info.description),
      commentsData: info.comments || [],
      videoUrl:
        info.requested_downloads?.[0]?.requested_formats?.[0]?.url || null,
    };

    return metadata;
  } catch (error) {
    throw new ApiError(500, `Instagram extraction failed: ${error.message}`);
  }
};

const extractHashtags = (text = "") => {
  return [...text.matchAll(/#(\w+)/g)].map((match) => match[1]);
};