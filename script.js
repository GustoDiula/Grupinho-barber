
// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('fade-out');
    setTimeout(() => preloader.remove(), 600);
  }, 1400);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 400);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// ===== TAB SWITCHING (this is what makes it a single-file, single-page site) =====
function showTab(tabName, scrollToId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.add('active');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('data-tab') === tabName);
  });

  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
  document.body.style.overflow = '';

  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

  if (scrollToId) {
    // Let the tab render first, then smooth-scroll to the sub-section (e.g. Contato)
    setTimeout(() => {
      const el = document.getElementById(scrollToId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  history.replaceState(null, '', '#' + tabName);
}

// Open the right tab if the page was loaded with a hash (e.g. shared link ending in #galeria)
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  const valid = ['home', 'servicos', 'sobre', 'galeria', 'agendamento'];
  if (valid.includes(hash)) {
    showTab(hash);
  } else {
    document.querySelector('.nav-link[data-tab="home"]').classList.add('active');
  }
});

// ===== BACK TO TOP =====
document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== DATE MIN (today) =====
const dateInput = document.getElementById('data');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

// ===== BOOKING FORM =====
const bookingForm = document.getElementById('booking-form');
const bookingSuccess = document.getElementById('booking-success');
const successMessage = document.getElementById('success-message');

function getBookings() {
  return JSON.parse(localStorage.getItem('losSantosBookings') || '[]');
}
function saveBooking(booking) {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem('losSantosBookings', JSON.stringify(bookings));
}
function isSlotTaken(date, horario, barbeiro) {
  const bookings = getBookings();
  return bookings.some(b => b.data === date && b.horario === horario && (barbeiro === '' || b.barbeiro === barbeiro || b.barbeiro === ''));
}

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(bookingForm);
  const data = Object.fromEntries(formData.entries());

  if (isSlotTaken(data.data, data.horario, data.barbeiro)) {
    alert('⚠️ Este horário já está reservado' + (data.barbeiro ? ' para este barbeiro' : '') + '. Escolha outro horário!');
    return;
  }

  const dateObj = new Date(data.data + 'T12:00:00');
  const dateFormatted = dateObj.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  const servicoLabels = { 'corte-classico': 'Corte Clássico', 'corte-rock': 'Corte Rock', 'barba': 'Barba Completa', 'combo': 'Combo Full Rock', 'pigmentacao': 'Pigmentação', 'tratamento': 'Tratamento Capilar' };
  const barbeiroLabels = { '': 'Qualquer barbeiro', 'diogo': 'Diogo "Skull"', 'rafa': 'Rafa "Guitar"', 'leo': 'Leo "Horn"', 'vic': 'Vic "Neon"' };

  const booking = { ...data, id: Date.now(), createdAt: new Date().toISOString() };
  saveBooking(booking);

  successMessage.innerHTML = `
    <strong>${data.nome}</strong>, seu horário está confirmado!<br><br>
    📅 <strong>${dateFormatted}</strong> às <strong>${data.horario}</strong><br>
    ✂️ ${servicoLabels[data.servico] || data.servico}<br>
    👤 ${barbeiroLabels[data.barbeiro] || data.barbeiro}<br>
    📱 Confirmação enviada para ${data.telefone}
  `;

  bookingForm.classList.add('hidden');
  bookingSuccess.classList.remove('hidden');
});

function resetForm() {
  bookingForm.reset();
  bookingForm.classList.remove('hidden');
  bookingSuccess.classList.add('hidden');
}
window.resetForm = resetForm;
window.showTab = showTab;

// ===== PHONE MASK =====
const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  if (value.length > 0) value = '(' + value;
  if (value.length > 3) value = value.slice(0, 3) + ') ' + value.slice(3);
  if (value.length > 10) value = value.slice(0, 10) + '-' + value.slice(10);
  e.target.value = value;
});

