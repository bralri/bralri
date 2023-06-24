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

        file.on('data', (chunk) => 
            {
                blobStream.write(chunk)
            }
        );
        file.on('end', () => 
            {
                blobStream.end();
                console.log('File uploaded successfully!');
            }
        );

        return {
            statusCode: 200,
            body: 'File upload in progress.',
        }
    } catch (error) {
        console.log('An error occurred while uploading the file:', error);
        return {
            statusCode: 500,
            body: 'File upload failed.',
        }
    }
}