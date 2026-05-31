import { ApiError } from "../utils/ApiError.js";
import youtubedl from "youtube-dl-exec";
import fs from "fs";
import { exec } from "child_process";
import path from "path";

const ensureTempDir = () => {
    if (!fs.existsSync("./temp")) {
        fs.mkdirSync("./temp");
    }
};

export const downloadInstagramAudio = async (url) => {
    ensureTempDir();

    const mp3Path = `./temp/${Date.now()}.mp3`;
    const wavPath = mp3Path.replace(".mp3", ".wav");

    try {
        await youtubedl(url, {
            extractAudio: true,
            audioFormat: "mp3",
            output: mp3Path,
        });

        const ffmpegCmd = `ffmpeg -y -i "${mp3Path}" -ar 16000 -ac 1 "${wavPath}"`;

        await new Promise((resolve, reject) => {
            exec(ffmpegCmd, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        return { mp3Path, wavPath };
    } catch (error) {
        throw new ApiError(500, `Audio download failed: ${error.message}`);
    }
};

export const getTranscriptFromAudio = (audioPath) => {
    return new Promise((resolve, reject) => {
        const modelPath = process.env.WHISPER_MODEL_PATH;

        const binaryPath = process.env.WHISPER_PATH;

        const outputPath = audioPath.replace(".wav", "");

        const cmd = `${binaryPath} -m "${modelPath}" -f "${audioPath}" -l auto -otxt -of "${outputPath}" -nt`;

        exec(cmd, (err) => {
            if (err) return reject(err);

            try {
                const text = fs.readFileSync(`${outputPath}.txt`, "utf8");
                resolve(text);
            } catch (readErr) {
                reject(readErr);
            }
        });
    });
};

const extractHashtags = (text = "") => {
    return [...text.matchAll(/#(\w+)/g)].map((m) => m[1]);
};

export const getInstagramReelData = async (reelUrl) => {
    try {
        const info = await youtubedl(reelUrl, {
            dumpSingleJson: true,
            noWarnings: true,
            noCheckCertificates: true,
            preferFreeFormats: true,
        });

        const likes = info.like_count || 0;
        const comments = info.comment_count || 0;
        const views = info.view_count || null;

        const estimatedViews =
            views || Math.max(likes * 20, comments * 200);

        const engagementRate =
            ((likes + comments) / estimatedViews) * 100;

        const metadata = {
            title: info.title,
            creator: info.uploader,
            channel: info.channel,
            description: info.description,
            duration: info.duration,
            uploadDate: info.upload_date,
            likes,
            comments,
            thumbnail: info.thumbnail,
            hashtags: extractHashtags(info.description),
            commentsData: info.comments || [],
            videoUrl:
                info.requested_downloads?.[0]?.requested_formats?.[0]?.url ||
                null,
            views: estimatedViews,
            engagementRate: Number(engagementRate.toFixed(2)),
        };

        const { mp3Path, wavPath } = await downloadInstagramAudio(reelUrl);
        const transcript = await getTranscriptFromAudio(wavPath);

        try {
            if (fs.existsSync(mp3Path)) fs.unlinkSync(mp3Path);
            if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath);
        } catch (e) {
            console.warn("Cleanup failed:", e.message);
        }

        return {
            platform: "instagram",
            metadata,
            transcript,
        };
    } catch (error) {
        throw new ApiError(
            500,
            `Instagram extraction failed: ${error.message}`
        );
    }
};