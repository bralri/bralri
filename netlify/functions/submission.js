const {Storage} = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);

exports.handler = async (event) => {
    // Create a new Google Cloud Storage client
    const storage = new Storage({credentials: key});

    try {
        // Get the file data from the request body
        const fileData = Buffer.from(event.body, 'binary');

        // Set the name for the file in the storage bucket
        const fileName = event.headers['content-disposition'].split('filename=')[1].replace(/"/g, '');

        // Upload the file to the storage bucket
        await storage.bucket('build-a-vessel-submission').file(fileName).save(fileData);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully' }),
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error uploading file' }),
        };
    }
};