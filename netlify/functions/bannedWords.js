// bannedWords.js

const bannedWords = process.env.BANNED_WORDS;

exports.handler = async () => {
    try {
        return {
            statusCode: 200, 
            body: JSON.stringify(bannedWords)
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Failed to fetch banned words'})
        }
    }
}