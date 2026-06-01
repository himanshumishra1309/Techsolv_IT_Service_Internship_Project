import { splitTranscript } from "./chunk.service.js";
import { storeChunks } from "./vector.service.js";

export const ingestVideo = async (transcript,metadata,sessionId,videoId) => {
    const chunks = await splitTranscript(transcript);

    await storeChunks(chunks, sessionId, videoId, metadata);

    return {
        totalChunks: chunks.length,
        sessionId,
        videoId,
    };
};