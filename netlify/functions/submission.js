const {Storage} = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);

exports.handler = async (event) => {
    const storage = new Storage({credentials: key});

    try {
        const fileData = Buffer.from(event.body, 'binary');
        const fileName = event.headers['file-name'];
        const userName = event.headers['user-name'];
        await storage.bucket('build-a-vessel-submissions').file(`${userName}-${fileName}`).save(fileData);
        const [file] = await storage.bucket('build-a-vessel-submissions').file(`${userName}-${fileName}`).download();
        const fileContent = file.toString('base64');

        return {
            statusCode: 200,
            headers: event,headers,
            body: fileContent,
            isBase64Encoded: true,
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Error uploading file'}),
        };
    }
};