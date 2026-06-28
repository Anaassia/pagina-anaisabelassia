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
            '<option>Consultoría Comercial</option>' +
            '<option>Mentoring y Coaching</option>' +
            '<option>Formación y Entrenamiento</option>' +
            '<option>Gestión de Proyectos</option>' +
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

  // any element with [data-wa] or .btn-wa-cta opens the modal
  document.querySelectorAll('[data-wa]').forEach(function (b) {
    if (b.classList.contains('btn-wa')) b.insertAdjacentHTML('afterbegin', ICON);
    b.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });
  document.querySelectorAll('.btn-wa-cta').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); open(); });
  });

  // Google Sheets endpoint (Google Apps Script Web App URL)
  var SHEETS_URL = 'GOOGLE_APPS_SCRIPT_URL';

  function saveToSheets(data) {
    if (SHEETS_URL === 'GOOGLE_APPS_SCRIPT_URL') return;
    try {
      fetch(SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (_) {}
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameI.value.trim();
    var email = emailI.value.trim();
    var topic = topicI.value;
    var reason = reasonI.value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk || !reason) { err.style.display = 'block'; return; }

    saveToSheets({
      fecha: new Date().toISOString(),
      nombre: name,
      email: email,
      tema: topic,
      motivo: reason,
      pagina: pageName()
    });

    var msg = '¡Hola Ana Isabel! Soy ' + name + '. Mi correo es ' + email +
              '. Me interesa: ' + topic + '. Te contacto porque: ' + reason +
              '. (Escribo desde la página "' + pageName() + '" de tu sitio web.)';
    var url = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank');
    close();
    form.reset();
  });
})();

// ===== "Sígueme" social band (internal pages only) =====
(function () {
  if (document.querySelector('.article')) return; // no mostrar en artículos de blog
  var footer = document.querySelector('footer');
  if (!footer) return;
  var IG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>';
  var YT = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>';
  var LI = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>';
  var sec = document.createElement('section');
  sec.className = 'follow pad-sm';
  sec.innerHTML =
    '<div class="wrap">' +
      '<span class="eyebrow">Sígueme</span>' +
      '<h2 class="serif">Sigamos la conversación en <em>redes</em>.</h2>' +
      '<p>Ideas sobre liderazgo, innovación y crecimiento rentable. Únete y no te pierdas nada.</p>' +
      '<div class="follow-links">' +
        '<a class="follow-ic" href="https://www.instagram.com/anaisabelassia/" target="_blank" rel="noopener" aria-label="Sígueme en Instagram"><span class="ic">' + IG + '</span><span class="lbl">Instagram</span></a>' +
        '<a class="follow-ic" href="https://www.youtube.com/@anaisabelassia" target="_blank" rel="noopener" aria-label="Sígueme en YouTube"><span class="ic">' + YT + '</span><span class="lbl">YouTube</span></a>' +
        '<a class="follow-ic" href="https://www.linkedin.com/in/anaisabelassia/" target="_blank" rel="noopener" aria-label="Sígueme en LinkedIn"><span class="ic">' + LI + '</span><span class="lbl">LinkedIn</span></a>' +
      '</div>' +
    '</div>';
  var allCtaBands = document.querySelectorAll('.cta-band');
  var ctaBand = allCtaBands.length ? allCtaBands[allCtaBands.length - 1] : null;
  var insertBefore = ctaBand || footer;
  insertBefore.parentNode.insertBefore(sec, insertBefore);
})();
