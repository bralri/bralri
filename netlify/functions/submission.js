const {Storage} = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const storage = new Storage({credentials: key});
const bucket = storage.bucket('build-a-vessel-submissions');

exports.handler = async (event) => {
    try {
        const file = event.body.file;
        const fileName = event.body.fileName;

        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream();

        file.pipe(blobStream);

        await new Promise((resolve, reject) => 
            {
                blobStream.on('finish', resolve);
                blobStream.on('error', reject);
            }
        );

        return {
        statusCode: 200,
        body: 'File uploaded successfully!',
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: 'File upload failed.',
        }
    }
}