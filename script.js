const btn = document.querySelector('.menu-toggle');
const menu = document.getElementById('mobile-menu');
btn?.addEventListener('click', () => {const open = menu.classList.toggle('open');btn.setAttribute('aria-expanded', String(open));});
document.getElementById('year').textContent = new Date().getFullYear();
