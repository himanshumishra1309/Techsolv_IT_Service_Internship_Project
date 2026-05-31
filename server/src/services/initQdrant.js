import { qdrant } from "../src/config/qdrant.js";

export const initQdrant = async () => {
  const exists = await qdrant.getCollections();

  const alreadyExists = exists.collections.some(
    (c) => c.name === "videos"
  );

  if (!alreadyExists) {
    await qdrant.createCollection("videos", {
      vectors: {
        size: 384,
        distance: "Cosine",
      },
    });

    console.log("Qdrant collection created");
  }
};