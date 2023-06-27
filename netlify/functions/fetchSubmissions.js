// /.netlify/functions/fetchSubmission.js

const {Storage} = require('@google-cloud/storage');
const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const storage = new Storage({credentials: key});
const bucket = storage.bucket('build-a-vessel-submissions');

exports.handler = async () => {
    try {
        const [files] = await bucket.getFiles();
        const fileData = files.map((file) => {
            const urlPath = `${process.env.SUB_URL}/${file.name}`;

            const dateString = file.metadata.timeCreated;
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            let createdBy = file.metadata.metadata.userName;

            return {
                name: file.name,
                createdBy: createdBy,
                url: urlPath,
                dateCreated: day + "/" + month + "/" + year
            }
        });

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({files: fileData}),
        }
    } catch (error) {
        console.error('Error fetching files from bucket:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Error fetching files from bucket'}),
        }
    }
}