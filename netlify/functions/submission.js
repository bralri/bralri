const {Storage} = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);

exports.handler = async (event) => {
    const storage = new Storage({credentials: key});
    const bucket = storage.bucket('build-a-vessel-submissions');
    try {
        const fileData = Buffer.from(event.body, 'binary');
        console.log(fileData);
        const fileName = event.headers['content-disposition'].split('filename=')[1].replace(/"/g, '');

        const metadata = {
            metadata: {
                userName: event.headers['user-name'].split('username=')[1].replace(/"/g, ''),
            }
        };

        await bucket.file(fileName).save(fileData);
        await bucket.file(fileName).setMetadata(metadata);

        return {
            statusCode: 200,
            headers: event.headers,
            body: JSON.stringify({message: 'File uploaded successfully'}),
        }
	} catch (error) {
		console.error('Error uploading file:', error);
		return {
			statusCode: 500,
			body: JSON.stringify({message: 'Error uploading file'}),
		}
	}
};