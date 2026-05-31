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

    const likes = data.like_count || 0;
    const comments = data.comment_count || 0;

    const views = data.view_count || null;

    const estimatedViews = views || Math.max(likes * 20, comments * 200);

    const engagementRate = ((likes + comments) / estimatedViews) * 100;

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
      videoUrl: info.requested_downloads?.[0]?.requested_formats?.[0]?.url || null,
      views: estimatedViews,
      engagementRate: engagementRate
    };

    return metadata;
  } catch (error) {
    throw new ApiError(500, `Instagram extraction failed: ${error.message}`);
  }
};

const extractHashtags = (text = "") => {
  return [...text.matchAll(/#(\w+)/g)].map((match) => match[1]);
};