// /.netlify/functions/submission.js

const {Storage} = require('@google-cloud/storage');

exports.handler = async (event) => {
    try {
        const key = JSON.parse(process.env.STORAGE_KEY_JSON);
        const bucket = 'build-a-vessel-submissions';
        const storage = new Storage({credentials: key});

        const content = event.body;
        const _fileName = event.headers['file-name'];
        const _userName = event.headers['user-name'];
        const _contentType = event.headers['content-type'];
        const fileName = _fileName;
        const userName = _userName ? _userName : `Anonymous`;

        const metaData = {
            metadata: {
                userName: userName,
                type: _contentType,
            },
            resumable: false,
        };

        await storage.bucket(bucket).file(fileName).save(content, metaData);

        return {
            statusCode: 200,
            body: 'File uploaded successfully!'
        }
    } catch (error) {
        console.error('An error occurred while uploading the file:', error);
        return {
            statusCode: 500,
            body: 'File upload failed.'
        }
    }
}