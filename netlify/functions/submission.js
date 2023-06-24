const {Storage} = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const storage = new Storage({credentials: key});
const bucket = storage.bucket('build-a-vessel-submissions');

exports.handler = async (event) => {
    try {
        console.log(event.body);
        const data = JSON.stringify(event.body);
        console.log(data)
        const file = data.file;
        const fileName = data.fileName;
        const userName = data.userName;

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