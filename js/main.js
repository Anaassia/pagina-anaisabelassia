// nav scroll state
const header = document.getElementById('header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll);
  onScroll();
}
// mobile menu
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
if (burger && menu) {
  burger.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}
// reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
// graceful hero image fallback
document.querySelectorAll('img[data-fallback]').forEach(img => {
  img.addEventListener('error', () => { img.style.display = 'none'; });
});
// contact form (demo)
function handleSubmit(e) {
  e.preventDefault();
  alert('¡Gracias! Tu mensaje ha sido registrado. (Demo — conecta este formulario a tu email o CRM para recibir los datos.)');
  e.target.reset();
  return false;
}
