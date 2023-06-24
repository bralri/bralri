const {Storage} = require('@google-cloud/storage');
const FormData = require('form-data');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const storage = new Storage({credentials: key});
const bucket = storage.bucket('build-a-vessel-submissions');

exports.handler = async (event) => {
    try {
        const formData = new FormData();
        formData.parse(event.body);
        console.log('formData: ', formData);

        const file = formData.get('file');
        console.log('file: ', file);
        const fileName = formData.get('fileName');
        console.log('fileName: ', fileName);

        const blob = bucket.file(fileName);
        const blobStream = blob.createWriteStream();

        blobStream.on('error', (error) => {
            console.error('Error uploading the file:', error);
            return {
                statusCode: 500,
                body: 'File upload failed.',
            };
        });

        blobStream.on('finish', () => {
            console.log('File uploaded successfully!');
            return {
                statusCode: 200,
                body: 'File uploaded successfully!',
            };
        });

        file.on('data', (chunk) => 
            {
                blobStream.write(chunk)
            }
        );
        file.on('end', () => 
            {
                blobStream.end();
            }
        );

        return {
            statusCode: 200,
            body: 'File upload in progress.',
        }
    } catch (error) {
        console.error('An error occurred while processing the request:', error);
        return {
            statusCode: 500,
            body: 'File upload failed.',
        };
    }
}