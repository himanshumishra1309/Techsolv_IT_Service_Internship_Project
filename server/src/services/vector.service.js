import crypto from "crypto";
import { qdrant } from "../config/qdrant.js";
import { generateEmbedding } from "./embedding.service.js";

export const storeChunks = async (chunks,sessionId,videoId,metadata) => {
    const points = [];

    for (let i = 0; i < chunks.length; i++) {
        const vector = await generateEmbedding(chunks[i].pageContent);

        points.push({
            id: crypto.randomUUID(),

            vector,

            payload: {
                sessionId,
                videoId,
                chunkIndex: i,
                text: chunks[i].pageContent,
                platform: metadata.platform,
                title: metadata.title,
                creator: metadata.creator,
                views: metadata.views,
                likes: metadata.likes,
                comments: metadata.comments,
                engagementRate: metadata.engagementRate,
                followerCount: metadata.followerCount || null,
                uploadDate: metadata.uploadDate,
                duration: metadata.duration,
                hashtags: metadata.hashtags || [],
            },
        });
    }

    await qdrant.upsert("videos", {
        wait: true,
        points,
    });

    return true;
};