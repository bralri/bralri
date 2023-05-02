const postURL = document.querySelectorAll(".postURL");
const snippetImage = document.querySelectorAll(".post-thumbnail");
let currentDirectory;

for (let i = 0; i < postURL.length; i++) {
    currentDirectory = postURL[i].href.split('/').slice(0, -1);

    if (currentDirectory.length > 5) {
        snippetImage[i].src = `/assets/img/works/${currentDirectory[4]}/${currentDirectory[5]}/post-thumbnail.webp`;
    } else {
        snippetImage[i].src = `/assets/img/works/${currentDirectory[4]}/post-thumbnail.webp`;
    }
}