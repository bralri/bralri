const rootURL = "https://www.bralri.net"
const postURL = document.querySelectorAll(".postURL");
const snippetImage = document.querySelectorAll(".post-thumbnail");
let metaImage = document.querySelectorAll('meta[property="og:image"]')[0];
let twitterMetaImage = document.querySelectorAll('meta[name="twitter:image"]')[0];
let snippetThumbnail, metaThumbnail, imageFolder, assetURL, postType;

for (let i = 0; i < postURL.length; i++) {
    snippetThumbnail = postURL[i].href.split('/').slice(0, -1);

    if (snippetThumbnail.length > 5) {
        assetURL = `/assets/img/${snippetThumbnail[3]}/${snippetThumbnail[4]}/${snippetThumbnail[5]}/post-thumbnail.webp`;
        snippetImage[i].src = assetURL;
    } else {
        assetURL = `/assets/img/${snippetThumbnail[3]}/${snippetThumbnail[4]}/post-thumbnail.webp`
        snippetImage[i].src = assetURL;
    }
}

let currentURL = window.location.href.split('/');
for (let i = 0; i < currentURL.length; i++) {

    postType = currentURL[3];

    if (currentURL.length > 6) {
        imageFolder = currentURL[5];
        postFolder = currentURL[4];

        metaThumbnail = rootURL + `/assets/img/${postType}/${postFolder}/${imageFolder}/post-thumbnail.webp`;
        metaImage.content = metaThumbnail;
        twitterMetaImage.content = metaThumbnail;
    } else {
        imageFolder = currentURL[4];
        metaThumbnail = rootURL + `/assets/img/${postType}/${imageFolder}/post-thumbnail.webp`;
        metaImage.content = metaThumbnail;
        twitterMetaImage.content = metaThumbnail;
    }
}