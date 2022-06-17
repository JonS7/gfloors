
const workTrigger = document.getElementById('work-trigger');
const closeGallery = document.getElementById('closeGallery');
const gallery = document.getElementById('gallery');
//const fixedToScroll = document.querySelector(".S-contact")
const body = document.body;

workTrigger.addEventListener('click', (e) => {
  //workTrigger.classList.add('is-active');
  gallery.classList.add('is-active');
  body.classList.add('slide-is-active');
});

closeGallery.addEventListener('click', (e) => {
  //workTrigger.classList.remove('is-active');
  //gallery.classList.remove('is-active');
  body.classList.remove('slide-is-active');
});

/* // using sticky pos instead
var observer = new IntersectionObserver(function(entries) {
  // isIntersecting is true when element and viewport are overlapping
  // isIntersecting is false when element and viewport don't overlap
  if(entries[0].isIntersecting === true) {
    console.log('Element has just become visible in screen')
    fixedToScroll.classList.add('bg-scroll');
  }
  else fixedToScroll.classList.remove('bg-scroll')
}, { threshold: [0] });

observer.observe(document.querySelector(".Site-footer"));
*/

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);