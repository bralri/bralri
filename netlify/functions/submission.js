// /.netlify/functions/submission.js

const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const os = require('os');
const path = require('path');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const bucket = 'build-a-vessel-submissions';
const storage = new Storage({ credentials: key });

exports.handler = async (event) => {
    try {
        const content = event.body;
        const _fileName = event.headers['file-name'];
        const _userName = event.headers['user-name'];
        const fileName = _fileName;
        const userName = _userName ? _userName : 'Anonymous';

        // Save to Google Cloud Storage
        await storage.bucket(bucket).file(fileName).save(content, {
            metadata: {
                metadata: {
                    userName: userName,
                },
                contentType: 'application/octet-stream',
            },
            resumable: false,
        });

        // Save to Netlify temporary folder
        const tempFilePath = path.join('/tmp', fileName);
        fs.writeFileSync(tempFilePath, content);

        // Read the file contents and log it
        const fileContents = fs.readFileSync(tempFilePath, 'utf-8');
        console.log('Temporary file contents:', fileContents);

        console.log('Temporary file path:', tempFilePath);
        console.log('Temporary file contents:', content.toString());

        return {
            statusCode: 200,
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