const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    const fileBuffer = Buffer.from(event.body, 'base64');
    const headers = event.headers;
    const contentDisposition = headers['content-disposition'];
    
    let fileName;
    if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = contentDisposition.match(filenameRegex);
        if (matches && matches[1]) {
            fileName = matches[1].trim().replace(/['"]/g, '');
        }
    }

    try {
        fs.writeFileSync(`../submissions/${fileName}`, fileBuffer);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully' }),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error saving file to server' }),
        };
    }
};