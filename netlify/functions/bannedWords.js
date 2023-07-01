// bannedWords.js

exports.handler = async () => {
    try {
        const bannedWords = process.env.BANNED_WORDS;
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