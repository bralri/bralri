const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    const fileBuffer = Buffer.from(event.body, 'base64');
    console.log("Buffer: ", fileBuffer);
    const fileName = event.queryStringParameters.fileName;
    console.log("File: ", fileName);
    const uploadsPath = path.join(process.cwd(), 'submissions', fileName);
    console.log("Upload Path: ", uploadsPath);

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