function openSlideMenu() {
    document.getElementById('slide-menu').style.width = '250px';
    //document.getElementById('main').style.marginLeft = '250px';
    document.getElementById('nav-button').style.visibility = 'hidden';
}

function closeSlideMenu() {
    document.getElementById('slide-menu').style.width = '0px';
    //document.getElementById('main').style.marginLeft = '0px';
    document.getElementById('nav-button').style.visibility = 'visible';
}