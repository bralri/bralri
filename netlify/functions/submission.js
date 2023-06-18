const {Storage} = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);

exports.handler = async (event) => {
const storage = new Storage({credentials: key});

try {
	const fileData = Buffer.from(event.body, 'binary');
	const fileName = event.headers['content-disposition'].split('filename=')[1].replace(/"/g, '');

	const metadata = {
		metadata: {
			userName: event.headers['user-name'],
		},
		contentType: 'text/plain',
	};

	await storage.bucket('build-a-vessel-submissions').file(fileName).save(fileData);
	await storage.bucket('build-a-vessel-submissions').file(fileName).setMetadata(metadata);

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