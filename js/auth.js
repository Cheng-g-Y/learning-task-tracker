import { clearMessage, showMessage } from './common.js';
import { configurationMessage, isConfigured, supabase } from './supabase.js';

const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const tabs = document.querySelectorAll('[data-auth-tab]');

function selectTab(tabName) {
  loginForm.classList.toggle('hidden', tabName !== 'login');
  registerForm.classList.toggle('hidden', tabName !== 'register');
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.authTab === tabName));
  clearMessage();
}

tabs.forEach((tab) => tab.addEventListener('click', () => selectTab(tab.dataset.authTab)));

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();
  if (!isConfigured) return showMessage(configurationMessage());

  const form = new FormData(loginForm);
  const { error } = await supabase.auth.signInWithPassword({
    email: form.get('email').trim(),
    password: form.get('password'),
  });

  if (error) return showMessage(`登录失败：${error.message}`);
  window.location.replace('dashboard.html');
});

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();
  if (!isConfigured) return showMessage(configurationMessage());

  const form = new FormData(registerForm);
  const { data, error } = await supabase.auth.signUp({
    email: form.get('email').trim(),
    password: form.get('password'),
  });

  if (error) return showMessage(`注册失败：${error.message}`);
  registerForm.reset();
  if (data.session) {
    showMessage('注册成功，正在进入任务面板……', 'success');
    window.location.replace('dashboard.html');
  } else {
    selectTab('login');
    showMessage('注册成功。请检查邮箱并完成确认，然后登录。', 'success');
  }
});

async function redirectLoggedInUser() {
  if (!isConfigured) return;
  const { data } = await supabase.auth.getSession();
  if (data.session) window.location.replace('dashboard.html');
}

redirectLoggedInUser();
