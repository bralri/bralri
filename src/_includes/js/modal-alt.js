const modal = document.getElementById("image-modal-paper");
const modalImg = document.getElementById("modal-image-paper");
// const modalCaption = document.getElementById("modal-caption");
const prevBtn = document.querySelector(".modal-prev");
const nextBtn = document.querySelector(".modal-next");
const images = document.querySelectorAll(".photo-grid-image-paper");
let currentIndex;

// Get the image index from the URL parameter
const getImageIndexFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const image = parseInt(params.get('image'));
    if (isNaN(image) || image <= 0 || image > images.length) {
        return -1;
    }
    return image - 1;
}

// Show the modal with the image related to the given index
const showImage = index => {
    if (index < 0) {
        index = images.length - 1;
    } else if (index >= images.length) {
        index = 0;
    }

    const imageURL = images[index].src;
    modalImg.src = imageURL;
    // modalCaption.textContent = images[index].alt;
    currentIndex = index;
    updateUrl(index);

    document.body.style.overflow = "hidden"; // Disable page scrolling
};

// Update the URL parameter when changing the image in the modal
const updateUrl = index => {
    const image = index + 1;
    const newUrl = `${window.location.origin}${window.location.pathname}?image=${image}`;
    window.history.pushState({
        path: newUrl
    }, '', newUrl);
};

// Get the image index from the URL parameter and show the related image in the
// modal
const indexFromUrl = getImageIndexFromUrl();
if (indexFromUrl !== -1) {
    const imageId = parseInt(indexFromUrl) + 1;
    const imageIndex = Array.from(images).findIndex(image => image.dataset.imageId === imageId.toString());
    if (imageIndex !== -1) {
        showImage(imageIndex);
    }
}

// Add click and keydown event listeners to the images
images.forEach((image, index) => {
    image.addEventListener("click", () => {
        if (window.innerWidth > 50 * 16) {
            modal.style.display = "block";
            showImage(index);
        }
    });

    image.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.keycode === 13) {
            if (window.innerWidth > 50 * 16) {
                modal.style.display = "block";
                showImage(index);
            }
        }
    });
});

// Add click event listeners to the modal navigation buttons
prevBtn.addEventListener("click", event => {
    event.preventDefault();
    showImage(currentIndex - 1);
});

nextBtn.addEventListener("click", event => {
    event.preventDefault();
    showImage(currentIndex + 1);
});

// Add click and keydown event listeners to the modal
modal.addEventListener("click", e => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" || event.keyCode === 27) {
        closeModal();
    } else if (event.key === "ArrowLeft" || event.keyCode === 37) {
        showImage(currentIndex - 1);
    } else if (event.key === "ArrowRight" || event.keyCode === 39) {
        showImage(currentIndex + 1);
    }
});

modalImg.addEventListener("click", () => {
    closeModal();
});

// Function to close the modal and update the URL
const closeModal = () => {
    modal.style.display = "none";
    window.history.pushState({
        path: window.location.origin + window.location.pathname
    }, '', window.location.origin + window.location.pathname);

    document.body.style.overflow = "auto"; // Enable page scrolling
};

window.addEventListener("DOMContentLoaded", function () {
    const indexFromUrl = getImageIndexFromUrl();
    if (indexFromUrl !== -1) {
        images[indexFromUrl].click();
    }
});