// /.netlify/functions/submission.js

const {Storage} = require('@google-cloud/storage');
const {v4: uuidv4} = require('uuid');

exports.handler = async (event) => {
    try {
        const key = JSON.parse(process.env.STORAGE_KEY_JSON);
        const bucket = 'build-a-vessel-submissions';
        const storage = new Storage({credentials: key});

        const _fileName = event.headers['File-Name'];
        const _userName = event.headers['User-Name'];
        const fileName = _fileName ? _fileName : `vessel-${uuidv4()}.glb`;
        const userName = _userName ? _userName : `Anonymous`;

        const metaData = {
            metadata: {
                userName: userName,
            },
            resumable: false,
        };

        const fileBuffer = Buffer.from(event.body, 'binary');
        await storage.bucket(bucket).file(fileName).save(fileBuffer, metaData);

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