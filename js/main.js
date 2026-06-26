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

// ===== WhatsApp widget (FAB + modal + deep link) =====
(function () {
  var PHONE = '573116279068';
  var ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.738-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01a1.1 1.1 0 0 0-.792.372c-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/></svg>';

  function pageName() {
    var t = (document.title || 'Inicio').split(/[—|]/)[0].trim();
    return t || 'Inicio';
  }

  // Floating action button
  var fab = document.createElement('button');
  fab.className = 'wa-fab';
  fab.type = 'button';
  fab.setAttribute('aria-label', 'Contactar por WhatsApp');
  fab.innerHTML = '<span class="wa-pulse"></span>' + ICON;
  document.body.appendChild(fab);

  // Modal
  var overlay = document.createElement('div');
  overlay.className = 'wa-overlay';
  overlay.innerHTML =
    '<div class="wa-modal" role="dialog" aria-modal="true" aria-labelledby="waTitle">' +
      '<button class="wa-close" type="button" aria-label="Cerrar">&times;</button>' +
      '<div class="wa-head"><span class="wa-ic">' + ICON + '</span>' +
        '<h3 id="waTitle">Escríbeme por WhatsApp</h3></div>' +
      '<p class="wa-sub">Cuéntame quién eres y en qué puedo ayudarte. Te llevaré a WhatsApp con tu mensaje listo para enviar.</p>' +
      '<form class="wa-form" novalidate>' +
        '<div class="wa-field"><label for="waName">Tu nombre</label>' +
          '<input id="waName" type="text" placeholder="Nombre y apellido" autocomplete="name"></div>' +
        '<div class="wa-field"><label for="waEmail">Email</label>' +
          '<input id="waEmail" type="email" placeholder="nombre@empresa.com" autocomplete="email"></div>' +
        '<div class="wa-field"><label for="waTopic">¿En qué quieres transformarte?</label>' +
          '<select id="waTopic">' +
            '<option>Estrategia y modelo de negocio</option>' +
            '<option>Liderazgo y talento comercial</option>' +
            '<option>Productividad y ventas rentables</option>' +
            '<option>Innovación y transformación digital</option>' +
            '<option>Programa Alquimia Comercial</option>' +
          '</select></div>' +
        '<div class="wa-field"><label for="waReason">¿Por qué me contactas?</label>' +
          '<textarea id="waReason" placeholder="Cuéntame brevemente tu situación y objetivos"></textarea></div>' +
        '<div class="wa-err">Por favor completa tu nombre, un email válido y el motivo.</div>' +
        '<button type="submit" class="btn btn-wa wa-send">Enviar por WhatsApp <span class="arrow">→</span></button>' +
      '</form>' +
    '</div>';
  document.body.appendChild(overlay);

  var nameI = overlay.querySelector('#waName');
  var emailI = overlay.querySelector('#waEmail');
  var topicI = overlay.querySelector('#waTopic');
  var reasonI = overlay.querySelector('#waReason');
  var err = overlay.querySelector('.wa-err');
  var form = overlay.querySelector('.wa-form');

  function open() { overlay.classList.add('open'); setTimeout(function () { nameI.focus(); }, 220); }
  function close() { overlay.classList.remove('open'); err.style.display = 'none'; }

  fab.addEventListener('click', open);
  overlay.querySelector('.wa-close').addEventListener('click', close);
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  // any element with [data-wa] opens the modal; prepend the icon for pill buttons
  document.querySelectorAll('[data-wa]').forEach(function (b) {
    if (b.classList.contains('btn-wa')) b.insertAdjacentHTML('afterbegin', ICON);
    b.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameI.value.trim();
    var email = emailI.value.trim();
    var topic = topicI.value;
    var reason = reasonI.value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk || !reason) { err.style.display = 'block'; return; }
    var msg = '¡Hola Ana Isabel! Soy ' + name + '. Mi correo es ' + email +
              '. Me interesa: ' + topic + '. Te contacto porque: ' + reason +
              '. (Escribo desde la página "' + pageName() + '" de tu sitio web.)';
    var url = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank');
    close();
    form.reset();
  });
})();
