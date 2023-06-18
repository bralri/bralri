const {Storage} = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const storage = new Storage({ credentials: key });
const bucket = storage.bucket('build-a-vessel-submissions');

exports.handler = async (event) => {
    try {
        const formData = event.body;
        console.log(formData)

        const file = formData.get('file');
        const fileName = file.name;
        const fileData = file.stream;

        const metadata = {
            contentType: 'model/gltf-binary',
            metadata: {
                userName: formData.get('fileName', ''),
            },
        }

        await bucket.file(fileName).save(fileData, {
            contentType: metadata.contentType,
            metadata: metadata.metadata,
        });

        return {
            statusCode: 200,
            headers: event.headers,
            body: JSON.stringify({ message: 'File uploaded successfully' }),
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error uploading file' }),
        }
    }
}