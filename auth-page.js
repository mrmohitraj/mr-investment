/* ===================================================================
   MR COIN WALA — AUTH PAGES LOGIC
=================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Redirect already-logged-in users away from auth pages
  if(Auth.isLoggedIn() && (CURRENT_PAGE === 'login.html' || CURRENT_PAGE === 'signup.html')){
    // allow, but show a hint - not forcing redirect so the demo can be re-tested
  }

  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const phone = document.getElementById('loginPhone');
      const password = document.getElementById('loginPassword');
      let valid = true;
      [phone, password].forEach(f => f.closest('.form-group').classList.remove('invalid'));
      if(!/^\d{10}$/.test(phone.value.trim())){
        phone.closest('.form-group').classList.add('invalid'); valid = false;
      }
      if(password.value.length < 4){
        password.closest('.form-group').classList.add('invalid'); valid = false;
      }
      if(!valid) return;
      const result = Auth.login(phone.value.trim(), password.value);
      if(!result.ok){ showToast(result.error, 'error'); return; }
      showToast('Welcome back, ' + result.user.name.split(' ')[0] + '!', 'success');
      setTimeout(()=> location.href = 'index.html', 700);
    });
  }

  const signupForm = document.getElementById('signupForm');
  if(signupForm){
    const roleButtons = document.querySelectorAll('.role-btn');
    let selectedRole = 'buyer';
    roleButtons.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        roleButtons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        selectedRole = btn.getAttribute('data-role');
      });
    });

    signupForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('signupName');
      const phone = document.getElementById('signupPhone');
      const email = document.getElementById('signupEmail');
      const password = document.getElementById('signupPassword');
      let valid = true;
      [name, phone, password].forEach(f => f.closest('.form-group').classList.remove('invalid'));

      if(name.value.trim().length < 2){ name.closest('.form-group').classList.add('invalid'); valid = false; }
      if(!/^\d{10}$/.test(phone.value.trim())){ phone.closest('.form-group').classList.add('invalid'); valid = false; }
      if(password.value.length < 4){ password.closest('.form-group').classList.add('invalid'); valid = false; }
      if(!valid) return;

      const result = Auth.signup({
        name: name.value.trim(), phone: phone.value.trim(),
        email: email.value.trim(), password: password.value, role: selectedRole
      });
      if(!result.ok){ showToast(result.error, 'error'); return; }
      showToast('Account created! Welcome, ' + result.user.name.split(' ')[0], 'success');
      setTimeout(()=> location.href = selectedRole === 'seller' ? 'seller-dashboard.html' : 'index.html', 800);
    });
  }
});
