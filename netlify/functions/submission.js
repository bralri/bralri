const {Storage} = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);

exports.handler = async (event) => {
    const storage = new Storage({credentials: key});

    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString().replace(/\//g, '.');

    const userName = event.headers['user-name'];
    const fileName = event.headers['content-disposition'].split('filename=')[1].replace(/"/g, '');

    const filePath = `${dateString}/${userName}/${fileName}`;

    try {
        const fileData = Buffer.from(event.body, 'binary');
        await storage.bucket('build-a-vessel-submissions').file(filePath).save(fileData);

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
};