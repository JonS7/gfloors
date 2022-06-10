
const workTrigger = document.getElementById('work-trigger');
const closeGallery = document.getElementById('closeGallery');
const gallery = document.getElementById('gallery');

workTrigger.addEventListener('click', (e) => {
  workTrigger.classList.add('is-active');
  gallery.classList.add('is-active');
});


closeGallery.addEventListener('click', (e) => {
  workTrigger.classList.remove('is-active');
  gallery.classList.remove('is-active');
});