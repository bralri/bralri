const zoomBtn = document.querySelectorAll('.image');
const allImages = document.querySelectorAll('.img-container');
const imageView = document.querySelector('.img-view');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const imageBox = document.querySelector('.img-box');

let currentImageIdx = 0;

imageView.addEventListener('click', function() {
    this.style.display = "none";
    imageBox.style.display = "none";
})

zoomBtn.forEach(function(btn, index) {
    btn.addEventListener('click', function() {
        imageView.style.display = "block";
        imageBox.style.display = "block";

        currentImageIdx = index + 1;
        currentImageDisplay(currentImageIdx);
    })
})

function currentImageDisplay(position) {
    imageBox.style.background = `url(./img/${currentImageIdx}.png) center/cover no-repeat`;
}

prevBtn.addEventListener('click', function() {
    currentImageIdx --;
    if (currentImageIdx === 0) {
        currentImageIdx = allImages.length;
    }
    
    currentImageDisplay(currentImageIdx);
})

nextBtn.addEventListener('click', function() {
    currentImageIdx ++;
    if (currentImageIdx === allImages.length + 1) {
        currentImageIdx = 1;
    }
    
    currentImageDisplay(currentImageIdx);
})