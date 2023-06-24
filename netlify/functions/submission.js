// /.netlify/functions/submission.js

const {Storage} = require('@google-cloud/storage');
const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const bucket = 'build-a-vessel-submissions';
const storage = new Storage({credentials: key});

exports.handler = async (event) => {
    try {
        const content = event.body;
        console.log('content', content);
        const _fileName = event.headers['file-name'];
        const _userName = event.headers['user-name'];
        const fileName = _fileName;
        const userName = _userName ? _userName : `Anonymous`;

        await storage
            .bucket(bucket)
            .file(fileName)
            .save(
                content, 
                {
                    metadata: {
                        metadata: {
                            userName: userName,
                        },
                        contentType: 'application/octet-stream',
                    },
                    resumable: false,
                }
            );

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