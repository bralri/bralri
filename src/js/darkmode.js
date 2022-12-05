const body = document.querySelector('body');
const html = document.querySelector('html');
const btn = document.querySelector('.darkmode__btn');
const icon = document.querySelector('.darkmode__btn-icon');

function store(value) {
  localStorage.setItem('darkmode', value);
}

function load() {
  const darkmode = localStorage.getItem('darkmode');

  if (!darkmode) {
    store(false);
    icon.classList.add('fa-sun');
  } else if (darkmode == 'true') {
    html.classList.add('darkmode');
    body.classList.add('darkmode');
    icon.classList.add('fa-moon');
  } else if (darkmode == 'false') {
    icon.classList.add('fa-sun');
  }
}

load();

btn.addEventListener('click', () => {
  body.classList.toggle('darkmode');
  html.classList.toggle('darkmode');
  icon.classList.add('animated');

  store(body.classList.contains('darkmode'));
  store(html.classList.contains('darkmode'));

  if (body.classList.contains('darkmode')){
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  } else {
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
})