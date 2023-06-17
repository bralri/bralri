const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    const fileBuffer = Buffer.from(event.body, 'base64'); // File data is received as base64 encoded string
    const fileName = event.queryStringParameters.fileName; // Extract the file name from query parameters
    const uploadsPath = path.join(__dirname, '..', 'uploads', fileName); // Update the path to 'netlify/uploads'

    try {
        fs.writeFileSync(uploadsPath, fileBuffer); // Save the file to 'netlify/uploads'
        console.log('file saved')

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