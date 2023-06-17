const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

exports.handler = async (event) => {
    const fileBuffer = Buffer.from(event.body, 'binary');
    const fileName = event.headers['content-disposition'].match(/filename="(.+)"/)[1];
    const uploadsPath = path.join(__dirname, 'uploads', fileName);
    const archivePath = path.join(__dirname, '.', 'src', 'assets', 'models', 'vessels', 'archive', fileName);

    try {
        fs.writeFileSync(uploadsPath, fileBuffer);
        await moveFile(uploadsPath, archivePath);
        await triggerRedeploy();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error saving file to server' })
        };
    }
};

const moveFile = (sourcePath, destinationPath) => {
    const fs = require('fs');

    return new Promise((resolve, reject) => {
        fs.rename(sourcePath, destinationPath, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
};

const triggerRedeploy = async () => {
    const siteId = process.env.NETLIFY_SITE_ID;
    const deployHook = process.env.NETLIFY_DEPLOY_HOOK;

    console.log(siteId, deployHook)

    const response = await fetch(`https://api.netlify.com/build_hooks/${deployHook}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({site_id: siteId})
    });

    if (response.ok) {
        console.log('Redeployment triggered successfully');
    } else {
        console.log('Error triggering redeployment');
    }
};