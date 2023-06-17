const { Storage } = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);

exports.handler = async (event) => {
    const storage = new Storage({ credentials: key });

    try {
        const fileData = Buffer.from(event.body, 'binary');
        const fileName = event.headers['content-disposition'].split('filename=')[1].replace(/"/g, '');
        await storage.bucket('build-a-vessel-submissions').file(fileName).save(fileData);

        const headers = {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${fileName}"`,
        };
        
        const [file] = await storage.bucket('build-a-vessel-submissions').file(fileName).download();
        const fileContent = file.toString('base64');

        return {
            statusCode: 200,
            headers: headers,
            body: fileContent,
            isBase64Encoded: true,
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error uploading file' }),
        };
    }
};