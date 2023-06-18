const { Storage } = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);

exports.handler = async (event, context) => {
    const storage = new Storage({ credentials: key });
    const bucket = storage.bucket('build-a-vessel-submissions');

    try {
        const [files] = await bucket.getFiles();

        const fileUrls = files.map((file) => {
            const publicUrl = `https://storage.googleapis.com/build-a-vessel-submissions/${file.name}`;
            return {
                name: file.name,
                publicUrl: publicUrl,
            };
        });

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ files: fileUrls }),
        };
    } catch (error) {
        console.error('Error fetching files from bucket:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching files from bucket' }),
        };
    }
};