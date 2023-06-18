const {Storage} = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const storage = new Storage({credentials: key});
const bucket = storage.bucket('build-a-vessel-submissions');

exports.handler = async (event) => {
    try {
        const headers = event.headers;
        const fileData = event.body;
        const fileName = headers['content-disposition'].split('filename=')[1].replace(/"/g, '');
        const userName = headers['user-name'].split('username=')[1].replace(/"/g, '') || 'anonymous';

        const metadata = {
            contentType: 'model/gltf-binary',
            metadata: {
                userName: userName,
            }
        };

        await bucket.file(fileName).save(fileData, {
            metadata: metadata
        });

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({message: 'File uploaded successfully'}),
        }
	} catch (error) {
		console.error('Error uploading file:', error);

		return {
			statusCode: 500,
			body: JSON.stringify({message: 'Error uploading file'}),
		}
	}
}