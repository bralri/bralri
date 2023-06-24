const {Storage} = require('@google-cloud/storage');
const {IncomingForm} = require('formidable');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const storage = new Storage({credentials: key});
const bucket = storage.bucket('build-a-vessel-submissions');

exports.handler = async (event) => {
    try {
        const form = IncomingForm({multiples: true});
        const formData = await new Promise((resolve, reject) => 
            {
                form.parse(event.body, (error, fields, files) => 
                    {
                        if (error) reject(error);
                        resolve({fields, files});
                    }
                );
            }
        );

        const file = formData.files.file;
        const fileName = formData.fields.fileName;
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