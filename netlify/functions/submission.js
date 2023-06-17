const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    console.log(event);
    const fileBuffer = Buffer.from(event.body, 'base64');
    console.log("Buffer: ", fileBuffer);
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

    console.log("File: ", fileName);
    const uploadsDirectory = path.join(process.env.LAMBDA_TASK_ROOT, 'submissions');
    const filePath = path.join(uploadsDirectory, fileName);
    console.log("Upload Path: ", filePath);

    try {
        fs.mkdirSync(uploadsDirectory, { recursive: true });
        fs.writeFileSync(filePath, fileBuffer);

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