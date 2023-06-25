// /.netlify/functions/submission.js

const {Storage} = require('@google-cloud/storage');
const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const bucket = 'build-a-vessel-submissions';
const storage = new Storage({credentials: key});

exports.handler = async (event) => {
    try {
        const base64 = event.body;
        const content = Buffer.from(base64, 'base64');
        const _fileName = event.headers['file-name'];
        const _userName = event.headers['user-name'];
        const fileName = _fileName;
        const userName = _userName || 'Anonymous';

        // Check if the file name already exists in the bucket
        const fileExists = await storage.bucket(bucket).file(fileName).exists();

        // If the file exists, append a number before the file extension
        let finalFileName = fileName;
        let counter = 1;
        while (fileExists[0]) {
        const fileExtensionIndex = fileName.lastIndexOf('.');
        const fileExtension = fileName.slice(fileExtensionIndex);
        const baseFileName = fileName.slice(0, fileExtensionIndex);
        finalFileName = `${baseFileName} (${counter})${fileExtension}`;
        counter++;
        fileExists = await storage.bucket(bucket).file(finalFileName).exists();
        }

        await storage.bucket(bucket).file(fileName).save(content, {
            metadata: {
                metadata: {
                    userName: userName,
                },
                contentType: 'application/octet-stream',
            },
            resumable: false,
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Vary': '',
            },
            body: 'File uploaded successfully!',
        }
    } catch (error) {
        console.error('An error occurred while uploading the file:', error);
        return {
            statusCode: 500,
            body: 'File upload failed.',
        }
    }
}