const {Storage} = require('@google-cloud/storage');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);

exports.handler = async (event) => {
    const storage = new Storage({credentials: key});

    try {
        const fileData = Buffer.from(event.body, 'binary');
        const fileName = event.headers['content-disposition'].split('filename=')[1].replace(/"/g, '');
        const userName = event.headers['user-name'];
        const currentDate = getCurrentDate();

        const folderPath = `${currentDate}/${userName}`;
        await ensureFoldersExist(storage.bucket('build-a-vessel-submissions'), folderPath);
        const filePath = `${folderPath}/${fileName}`;
        await storage.bucket('build-a-vessel-submissions').file(filePath).save(fileData);

        return {
            statusCode: 200,
            headers: event.headers,
            body: fileData.toString('base64'),
            isBase64Encoded: true,
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error uploading file' }),
        };
    }
}

const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

const ensureFoldersExist = async (bucket, folderPath) => {
    const folders = folderPath.split('/');
    let currentPath = '';

    for (const folder of folders) {
        currentPath += folder;

        const [files] = await bucket.getFiles({ prefix: currentPath });

        if (files.length === 0) {
            await bucket.file(`${currentPath}/`).save('');
        }

        currentPath += '/';
    }
}