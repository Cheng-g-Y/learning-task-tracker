import { requireUser, showMessage } from './common.js';
import { supabase } from './supabase.js';

const form = document.querySelector('#edit-task-form');
const taskId = new URLSearchParams(window.location.search).get('id');

async function loadCategories() {
  const { data, error } = await supabase.from('categories').select('id, name').order('name');
  if (error) throw error;
  const select = form.elements.category_id;
  data.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    select.append(option);
  });
}

async function loadTask() {
  const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).single();
  if (error) throw error;
  form.elements.title.value = data.title;
  form.elements.description.value = data.description || '';
  form.elements.due_date.value = data.due_date || '';
  form.elements.category_id.value = data.category_id || '';
  form.elements.completed.checked = data.completed;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const { error } = await supabase
    .from('tasks')
    .update({
      title: data.get('title').trim(),
      description: data.get('description').trim() || null,
      due_date: data.get('due_date') || null,
      category_id: data.get('category_id') || null,
      completed: form.elements.completed.checked,
    })
    .eq('id', taskId);
  if (error) return showMessage(`保存失败：${error.message}`);
  window.location.replace('dashboard.html');
});

async function initialize() {
  if (!taskId) {
    showMessage('缺少任务 ID，请返回任务面板重试。');
    form.classList.add('hidden');
    return;
  }
  const user = await requireUser();
  if (!user) return;
  try {
    await loadCategories();
    await loadTask();
  } catch (error) {
    showMessage(`读取任务失败：${error.message}`);
    form.classList.add('hidden');
  }
}

initialize();
