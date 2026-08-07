// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('fade-out');
    setTimeout(() => preloader.remove(), 600);
  }, 1800);
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to top
  const backToTop = document.getElementById('back-to-top');
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Active section highlight
  highlightActiveSection();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

function highlightActiveSection() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

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

// Load existing bookings from localStorage
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
  return bookings.some(b => 
    b.data === date && 
    b.horario === horario && 
    (barbeiro === '' || b.barbeiro === barbeiro || b.barbeiro === '')
  );
}

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(bookingForm);
  const data = Object.fromEntries(formData.entries());

  // Validate slot
  if (isSlotTaken(data.data, data.horario, data.barbeiro)) {
    alert('⚠️ Este horário já está reservado' + (data.barbeiro ? ' para este barbeiro' : '') + '. Escolha outro horário!');
    return;
  }

  // Format date for display
  const dateObj = new Date(data.data + 'T12:00:00');
  const dateFormatted = dateObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const servicoLabels = {
    'corte-classico': 'Corte Clássico',
    'corte-rock': 'Corte Rock',
    'barba': 'Barba Completa',
    'combo': 'Combo Full Rock',
    'pigmentacao': 'Pigmentação',
    'tratamento': 'Tratamento Capilar'
  };

  const barbeiroLabels = {
    '': 'Qualquer barbeiro',
    'diogo': 'Diogo "Skull"',
    'rafa': 'Rafa "Guitar"',
    'leo': 'Leo "Horn"',
    'vic': 'Vic "Neon"'
  };

  // Save booking
  const booking = {
    ...data,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };
  saveBooking(booking);

  // Show success
  successMessage.innerHTML = `
    <strong>${data.nome}</strong>, seu horário está confirmado!<br><br>
    📅 <strong>${dateFormatted}</strong> às <strong>${data.horario}</strong><br>
    ✂️ ${servicoLabels[data.servico] || data.servico}<br>
    👤 ${barbeiroLabels[data.barbeiro] || data.barbeiro}<br>
    📱 Confirmação enviada para ${data.telefone}
  `;

  bookingForm.classList.add('hidden');
  bookingSuccess.classList.remove('hidden');

  // Simulate notification (optional visual feedback)
  console.log('🤘 Novo agendamento Los Santos:', booking);
});

function resetForm() {
  bookingForm.reset();
  bookingForm.classList.remove('hidden');
  bookingSuccess.classList.add('hidden');
}

// Make resetForm available globally
window.resetForm = resetForm;

// ===== SMOOTH REVEAL ON SCROLL =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .gallery-item, .contact-item, .about-content, .about-image').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Add revealed styles via JS
const style = document.createElement('style');
style.textContent = `
  .revealed {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// ===== PHONE MASK =====
const telefoneInput = document.getElementById('telefone');
if (telefoneInput) {
  telefoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 0) {
      value = '(' + value;
    }
    if (value.length > 3) {
      value = value.slice(0, 3) + ') ' + value.slice(3);
    }
    if (value.length > 10) {
      value = value.slice(0, 10) + '-' + value.slice(10);
    }
    e.target.value = value;
  });
}

// ===== CONSOLE EASTER EGG =====
console.log('%c🤘 LOS SANTOS BARBEARIA 🤘', 'color: #ff1a1a; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #ff1a1a;');
console.log('%cOnde o estilo encontra a atitude.', 'color: #b0b0b0; font-size: 12px;');
console.log('%cSite desenvolvido com rock n\' roll.', 'color: #666; font-size: 10px;');
