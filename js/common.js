import { configurationMessage, isConfigured, supabase } from './supabase.js';

export function showMessage(text, type = 'error') {
  const message = document.querySelector('#message');
  if (!message) return;
  message.textContent = text;
  message.className = `message ${type}`;
}

export function clearMessage() {
  const message = document.querySelector('#message');
  if (!message) return;
  message.textContent = '';
  message.className = 'message hidden';
}

export async function requireUser() {
  if (!isConfigured) {
    showMessage(configurationMessage());
    return null;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    window.location.replace('index.html');
    return null;
  }
  return data.session.user;
}

export function formatDate(date) {
  if (!date) return '未设置截止日期';
  return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium' }).format(
    new Date(`${date}T00:00:00`),
  );
}
