const {DateTime} = require("luxon");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const {minify} = require("terser");

module.exports = (eleventyConfig) => {

    eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
        code,
        callback
    ){
        try {
            const minified = await minify(code);
            callback(null, minified.code);
        } catch (err) {
            console.log("Terser error: ", err);
            // Fail gracefully
            callback(null, code);
        }
    });

    eleventyConfig.addPlugin(pluginRSS);
    eleventyConfig.addLiquidFilter("dateToRfc822", pluginRSS.dateToRfc822);

    eleventyConfig.addGlobalData("rootURL", "https://www.bralri.net");

    eleventyConfig.addWatchTarget('./src/scss');
    eleventyConfig.addPassthroughCopy('./src/css');

    eleventyConfig.addPassthroughCopy('./src/assets');
    eleventyConfig.addPassthroughCopy('./src/js');

    eleventyConfig.addPassthroughCopy('./src/robots.txt');

    eleventyConfig.addPassthroughCopy('./src/site.webmanifest');
    eleventyConfig.addPassthroughCopy('./src/browserconfig.xml');
    eleventyConfig.addPassthroughCopy('./src/apple-touch-icon.png');
    eleventyConfig.addPassthroughCopy('./src/favicon.ico');

    eleventyConfig.addFilter("postDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
    });

    return {
        dir: {
            input: "src",
            output: "public"
        }
    };
}
