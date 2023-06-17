const {Storage} = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);

exports.handler = async (event) => {
    const storage = new Storage({credentials: key});
    const fileName = event.headers['file-name'];

    try {
        const fileData = Buffer.from(event.body, 'binary');
        await storage.bucket('build-a-vessel-submissions').file(fileName).save(fileData);

        return {
            statusCode: 200,
            headers: event.headers,
            body: JSON.stringify({ message: 'File uploaded successfully' }),
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error uploading file' }),
        };
    }
}