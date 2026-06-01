import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const splitTranscript = async (transcript) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments([transcript]);

    return chunks;
};