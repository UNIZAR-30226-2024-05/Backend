const azure = require('azure-storage');
require("dotenv").config();

const blobService = azure.createBlobService(process.env.AZURE_STORAGE_ACCOUNT_NAME, process.env.AZURE_STORAGE_ACCOUNT_KEY);
const containerName = process.env.AZURE_BLOB_CONTAINER_NAME;

function uploadFileToAzureBlobStorage(filePath, fileName) {
    return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromLocalFile(containerName, fileName, filePath, (error, result, response) => {
            if (error) {
                reject(error);
            } else {
                const fileUrl = blobService.getUrl(containerName, fileName);
                resolve(fileUrl);
            }
        });
    });
}

function deleteBlobFromAzureBlobStorage(fileName) {
    return new Promise((resolve, reject) => {
        blobService.deleteBlob(containerName, fileName, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
}

module.exports = { uploadFileToAzureBlobStorage, deleteBlobFromAzureBlobStorage };
