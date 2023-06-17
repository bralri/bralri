const { Storage } = require('@google-cloud/storage');
import {submissionName} from '../../public/js/vessels.min.js'
console.log(submissionName)
const key = JSON.parse(process.env.STORAGE_KEY_JSON);

exports.handler = async (event) => {
  const storage = new Storage({ credentials: key });

  try {
    const fileData = Buffer.from(event.body, 'binary');
    const fileName = event.headers['content-disposition'].split('filename=')[1].replace(/"/g, '');
    const userName = submissionName[0]; // Replace with the actual user name or retrieve it from the request
    const currentDate = getCurrentDate(); // Function to get the current date in the format 'dd/mm/yyyy'

    const folderPath = `${currentDate}/${userName}`; // Folder hierarchy based on date and userName

    // Check if the folders exist, and create them if they don't
    await ensureFoldersExist(storage.bucket('build-a-vessel-submissions'), folderPath);

    const filePath = `${folderPath}/${fileName}`; // Full file path within the folder structure

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
};

// Function to get the current date in the format 'dd/mm/yyyy'
function getCurrentDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Function to ensure the folder structure exists in the bucket
async function ensureFoldersExist(bucket, folderPath) {
  const folders = folderPath.split('/');
  let currentPath = '';
  
  for (const folder of folders) {
    currentPath += folder;

    // Check if the folder exists
    const [files] = await bucket.getFiles({ prefix: currentPath });

    if (files.length === 0) {
      // Create the folder if it doesn't exist
      await bucket.file(`${currentPath}/`).save('');
    }

    currentPath += '/';
  }
}