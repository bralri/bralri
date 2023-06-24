// /.netlify/functions/submission.js

const {Storage} = require('@google-cloud/storage');
const key = JSON.parse(process.env.STORAGE_KEY_JSON);
const bucket = 'build-a-vessel-submissions';
const storage = new Storage({credentials: key});

// exports.handler = async (event) => {
//     try {
//         const key = JSON.parse(process.env.STORAGE_KEY_JSON);
//         const bucket = 'build-a-vessel-submissions';
//         const storage = new Storage({credentials: key});

//         const content = event.body;
//         console.log('content', content);
//         const _fileName = event.headers['file-name'];
//         const _userName = event.headers['user-name'];
//         const fileName = _fileName;
//         const userName = _userName ? _userName : `Anonymous`;

//         await storage
//             .bucket(bucket)
//             .file(fileName)
//             .save(
//                 content, 
//                 {
//                     metadata: {
//                         metadata: {
//                             userName: userName,
//                         },
//                         contentType: 'application/octet-stream',
//                     },
//                     resumable: false,
//                 }
//             );

//         return {
//             statusCode: 200,
//             body: 'File uploaded successfully!'
//         }
//     } catch (error) {
//         console.error('An error occurred while uploading the file:', error);
//         return {
//             statusCode: 500,
//             body: 'File upload failed.'
//         }
//     }
// }

exports.handler = async (event) => {
    try {
        const _file = event.body.file;
        const _fileName = _file.originalname;
        const _userName = event.headers['user-name'];
        const userName = _userName ? _userName : 'Anonymous';

        if (!_fileName.toLowerCase().endsWith('.glb')) {
            console.alert('Invalid file format. Only .glb files are allowed.');
            return {
                statusCode: 400,
                body: 'Invalid file format. Only .glb files are allowed.',
            }
        }

        await storage.bucket(bucket).file(_fileName).save(_file.buffer, 
            {
                metadata: {
                    metadata: {
                        userName: userName,
                    },
                    contentType: 'application/octet-stream',
                },
                resumable: false,
            }
        );

        return {
            statusCode: 200,
            body: 'file upload successfull!',
        }
    } catch (error) {
        console.error('error: ', error);
        return {
            statusCode: 500,
            body: 'file upload failed.',
        }
    }
}