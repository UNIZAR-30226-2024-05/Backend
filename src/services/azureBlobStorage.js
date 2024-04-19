require("dotenv").config();
const { BlobServiceClient } = require("@azure/storage-blob");

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const imgContainerName = process.env.AZURE_BLOB_IMAGENES_CONTAINER_NAME;
const audioContainerName = process.env.AZURE_BLOB_AUDIOS_CONTAINER_NAME;

async function uploadFileToAzureBlobStorage(fileName, fileData, fileType, mimeType) {
    let containerClient;
    if (fileType === "image") {
        containerClient = blobServiceClient.getContainerClient(imgContainerName);
    } else {
        containerClient = blobServiceClient.getContainerClient(audioContainerName);
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

async function deleteBlobsFromAzureBlobStorage(imgName, audiosNames) {
    let containerClient = blobServiceClient.getContainerClient(imgContainerName);
    let blockBlobClient = containerClient.getBlockBlobClient(imgName);
    await blockBlobClient.delete();

    containerClient = blobServiceClient.getContainerClient(audioContainerName);
    audiosNames.forEach(async (audio) => {
        blockBlobClient = containerClient.getBlockBlobClient(audio);
        await blockBlobClient.delete();
    });
}

module.exports = { uploadFileToAzureBlobStorage, deleteBlobsFromAzureBlobStorage };
