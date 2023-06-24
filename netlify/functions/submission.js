const {Storage} = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const storage = new Storage({credentials: key});
const bucketName = 'build-a-vessel-submissions';

exports.handler = async (event) => {
    try {
        const formData = JSON.parse(event.body);

        const file = formData.file;
        const fileName = formData.fileName;
        const userName = formData.userName;

        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(fileName);

        const metaData = {
            metaData: {
                userName: userName,
            },
            resumable: false,
        }

        await blob.save(file, metaData);

        console.log('File uploaded successfully!');

        return {
            statusCode: 200,
            body: 'File uploaded successfully!',
        }
    } catch (error) {
        console.error('An error occurred while processing the request:', error);

        return {
            statusCode: 500,
            body: 'File upload failed.',
        }
    }
}