const primaryHeader = document.querySelector('.primary-header');
const iconHamburger = document.querySelector('.icon-hamburger');
const iconClose = document.querySelector('.icon-close');
const navToggle = document.querySelector('.mobile-nav-toggle');
const primaryNav = document.querySelector('.primary-navigation');

navToggle.addEventListener('click', () => {

    primaryNav.hasAttribute('data-visible')
        ? navToggle.setAttribute('aria-expanded', false)
        : navToggle.setAttribute('aria-expanded', true)

    primaryNav.toggleAttribute('data-visible');

    primaryHeader.toggleAttribute('data-overlay');
})

// const links = document.querySelectorAll('a');
// for (let i = 0; i < links.length; i++) {
//     let newText = links[i].textContent.concat(` <sup><i class="fa-solid fa-arrow-up-right-from-square icon-grey"></i></sup>`);
//     console.log(newText);
// }