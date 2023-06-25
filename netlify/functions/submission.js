// /.netlify/functions/submission.js

const {Storage} = require('@google-cloud/storage');
const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const bucket = 'build-a-vessel-submissions';
const storage = new Storage({credentials: key});

exports.handler = async (event) => {
    try {
        const base64 = event.body;
        console.log("base64 body: ", base64);
        const buffer = Buffer.from(base64, 'base64');
        console.log("buffer from base64: ", buffer);
        const _fileName = event.headers['file-name'];
        const _userName = event.headers['user-name'];
        const fileName = _fileName;
        const userName = _userName ? _userName : 'Anonymous';

        await storage.bucket(bucket).file(fileName).save(buffer, {
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