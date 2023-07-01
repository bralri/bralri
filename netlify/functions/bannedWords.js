// bannedWords.js

const {getBannedWords} = require('./bannedWordsList');

exports.handler = async () => {
    try {
        const bannedWords = getBannedWords;
        return {
            statusCode: 200,
            body: JSON.stringify({ words: bannedWords }),
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to fetch banned words' }),
        }
    }
}