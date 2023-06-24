const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const { Readable } = require('stream');

const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const storage = new Storage({ credentials: key });
const bucket = storage.bucket('build-a-vessel-submissions');

const upload = multer({ storage });

exports.handler = async (event) => {
  try {
    const formData = await new Promise((resolve, reject) => {
      upload.single('file')(event, {}, (error) => {
        if (error) reject(error);
        const { file, body } = event;
        resolve({ file, body });
      });
    });

    const file = formData.file;
    const fileName = formData.fileName;
    const userName = formData.userName;
    console.log('fileName:', fileName);
    console.log('userName:', userName);

    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (error) => {
      console.error('Error uploading the file:', error);
      return {
        statusCode: 500,
        body: 'File upload failed.',
      };
    });

    blobStream.on('finish', () => {
      console.log('File uploaded successfully!');
      return {
        statusCode: 200,
        body: 'File uploaded successfully!',
      };
    });

    file.stream.pipe(blobStream);

    return {
      statusCode: 200,
      body: 'File upload in progress.',
    };
  } catch (error) {
    console.error('An error occurred while processing the request:', error);
    return {
      statusCode: 500,
      body: 'File upload failed.',
    };
  }
};
