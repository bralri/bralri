const { DateTime } = require("luxon");
const pluginRSS = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {

    eleventyConfig.addPlugin(pluginRSS);
    eleventyConfig.addLiquidFilter("dateToRfc822", pluginRSS.dateToRfc822);

    eleventyConfig.addWatchTarget('./src/scss');
    eleventyConfig.addPassthroughCopy('./src/css');

    eleventyConfig.addPassthroughCopy('./src/assets');
    eleventyConfig.addPassthroughCopy('./src/js');
    eleventyConfig.addPassthroughCopy('./src/admin');
    eleventyConfig.addPassthroughCopy('./src/favicon.ico');

    eleventyConfig.addFilter("postDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
    })

    return {
        dir: {
            input: "src",
            output: "public"
        }
    };
}