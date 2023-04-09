const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-image");
const modalCaption = document.getElementById("modal-caption");
const prevBtn = document.querySelector(".modal-prev");
const nextBtn = document.querySelector(".modal-next");
const images = document.querySelectorAll(".photo-grid-image");
let currentIndex;

images.forEach((image, index) => {
    image.addEventListener("click", () => {
        if (window.innerWidth > 50 * 16) {
            modal.style.display = "block";
            modalImg.src = image.src;
            modalCaption.textContent = image.title;
            currentIndex = index;
        }
    });
});

const closeModal = () => {
    modal.style.display = "none";
};

const showImage = index => {
    if (index < 0) {
        index = images.length - 1;
    } else if (index >= images.length) {
        index = 0;
    }

    modalImg.src = images[index].src;
    modalCaption.textContent = images[index].title;
    currentIndex = index;
};

prevBtn.addEventListener("click", event => {
    event.preventDefault();
    showImage(currentIndex - 1);
});

nextBtn.addEventListener("click", event => {
    event.preventDefault();
    showImage(currentIndex + 1);
});

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