
const workTrigger = document.getElementById('work-trigger');
const closeGallery = document.getElementById('closeGallery');
const gallery = document.getElementById('gallery');
const body = document.body;

workTrigger.addEventListener('click', (e) => {
  gallery.classList.add('is-active');
  body.classList.add('slide-is-active');
});

closeGallery.addEventListener('click', (e) => {
  body.classList.remove('slide-is-active');
});

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);



// deal with browser back button when gallery open
window.addEventListener('hashchange', function() {
    if(!location.hash && body.classList.contains('slide-is-active')) {
        closeGallery.click();
      }
}, false);