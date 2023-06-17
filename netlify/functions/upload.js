const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    const fileBuffer = Buffer.from(event.body, 'base64');
    const fileName = event.queryStringParameters.fileName;
    const uploadsPath = path.join(__dirname, '..', 'uploads', fileName);

    try {
        fs.writeFileSync(uploadsPath, fileBuffer);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error saving file to server' }),
        };
    }
};