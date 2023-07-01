// /.netlify/functions/submission.js

const {Storage} = require('@google-cloud/storage');
const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const bucket = 'build-a-vessel-submissions';
const storage = new Storage({credentials: key});

exports.handler = async (event) => {
    try {
        const _base64 = event.body;
        const _content = Buffer.from(_base64, 'base64');
        const _fileName = event.headers['file-name'];
        const _userName = event.headers['user-name'];
        const _contentType = event.headers['content-type'];

        await storage.bucket(bucket).file(_fileName).save(_content, {
            metadata: {
                metadata: {
                    userName: _userName,
                },
                contentType: _contentType,
            },
            resumable: false,
        });

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