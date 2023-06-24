// /.netlify/functions/submission.js

const {Storage} = require('@google-cloud/storage');
const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const bucket = 'build-a-vessel-submissions';
const storage = new Storage({credentials: key});

exports.handler = async (event) => {
    try {
        const content = event.body.toString('utf8'); // Convert binary data to UTF-8 string
        const _fileName = event.headers['file-name'];
        const _userName = event.headers['user-name'];
        const fileName = _fileName;
        const userName = _userName ? _userName : 'Anonymous';

        await storage.bucket(bucket).file(fileName).save(content, {
            metadata: {
                metadata: {
                    userName: userName,
                },
                contentType: 'application/json', // Set the content type to JSON
            },
            resumable: false,
        });

        return {
            statusCode: 200,
            body: 'File uploaded successfully!',
        };
    } catch (error) {
        console.error('An error occurred while uploading the file:', error);
        return {
            statusCode: 500,
            body: 'File upload failed.',
        };
    }
}