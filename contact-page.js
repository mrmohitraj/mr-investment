/* ===================================================================
   MR COIN WALA — CONTACT FORM + FAQ ACCORDION LOGIC
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cName');
      const email = document.getElementById('cEmail');
      const message = document.getElementById('cMessage');
      let valid = true;
      [name,email,message].forEach(f=>f.closest('.form-group').classList.remove('invalid'));
      if(name.value.trim().length < 2){ name.closest('.form-group').classList.add('invalid'); valid=false; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){ email.closest('.form-group').classList.add('invalid'); valid=false; }
      if(message.value.trim().length < 10){ message.closest('.form-group').classList.add('invalid'); valid=false; }
      if(!valid){ showToast('Please fill all fields correctly', 'error'); return; }

      const messages = Storage.get('contactMessages', []);
      messages.unshift({ name:name.value.trim(), email:email.value.trim(), message:message.value.trim(), date:new Date().toISOString() });
      Storage.set('contactMessages', messages);
      showToast('Message sent! We will get back to you soon.', 'success');
      form.reset();
    });
  }

  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });
});
