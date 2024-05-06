require("dotenv").config();
const { BlobServiceClient } = require("@azure/storage-blob");

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const imgContainerName = process.env.AZURE_BLOB_IMAGENES_CONTAINER_NAME;
const audioContainerName = process.env.AZURE_BLOB_AUDIOS_CONTAINER_NAME;

async function uploadFileToAzureBlobStorage(fileName, fileData, fileType, mimeType) {
    let containerClient = blobServiceClient.getContainerClient(audioContainerName);
    if (fileType === "image") {
        containerClient = blobServiceClient.getContainerClient(imgContainerName);
    }

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.upload(fileData, fileData.length, {
        blobHTTPHeaders: {
            blobContentType: mimeType,
            blobContentDisposition: `inline; filename="${fileName}"`
        }
    });
    return blockBlobClient.url; 
}

async function deleteImgFromAzureBlobStorage(imgName) {
    const containerClient = blobServiceClient.getContainerClient(imgContainerName);
    const blockBlobClient = containerClient.getBlockBlobClient(imgName);
    await blockBlobClient.delete();
}

async function deleteAudioFromAzureBlobStorage(audioName) {
    const containerClient = blobServiceClient.getContainerClient(audioContainerName);
    const blockBlobClient = containerClient.getBlockBlobClient(audioName);
    await blockBlobClient.delete();
}

module.exports = { uploadFileToAzureBlobStorage, deleteImgFromAzureBlobStorage, deleteAudioFromAzureBlobStorage };
