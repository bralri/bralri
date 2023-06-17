const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    console.log(event);
    const fileBuffer = Buffer.from(event.body, 'base64');
    console.log(fileBuffer);
    const fileName = event.queryStringParameters.fileName;
    console.log(fileName, fileBuffer);
    const uploadsPath = path.join(process.cwd(), 'submissions', fileName);
    console.log(uploadsPath, fileName, fileBuffer);

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