import { clearMessage, formatDate, requireUser, showMessage } from './common.js';
import { supabase } from './supabase.js';

const categoryForm = document.querySelector('#category-form');
const taskForm = document.querySelector('#task-form');
const categoryFilter = document.querySelector('#category-filter');
const newTaskCategory = document.querySelector('#new-task-category');
const taskList = document.querySelector('#task-list');
const emptyState = document.querySelector('#empty-state');
const taskCount = document.querySelector('#task-count');
const logoutButton = document.querySelector('#logout-button');
let currentUser;
let categories = [];

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function categoryOptions(includeAll = false) {
  const first = includeAll
    ? '<option value="">全部课程</option>'
    : '<option value="">未分类</option>';
  return first + categories
    .map((category) => `<option value="${category.id}">${escapeHtml(category.name)}</option>`)
    .join('');
}

async function loadCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  categories = data;
  categoryFilter.innerHTML = categoryOptions(true);
  newTaskCategory.innerHTML = categoryOptions();
}

async function loadTasks() {
  let query = supabase
    .from('tasks')
    .select('id, title, description, due_date, completed, category_id, categories(name)')
    .order('created_at', { ascending: false });
  if (categoryFilter.value) query = query.eq('category_id', categoryFilter.value);

  const { data, error } = await query;
  if (error) throw error;
  renderTasks(data);
}

function renderTasks(tasks) {
  taskCount.textContent = `${tasks.length} 个任务`;
  emptyState.classList.toggle('hidden', tasks.length !== 0);
  taskList.innerHTML = tasks.map((task) => `
    <article class="task-card ${task.completed ? 'done' : ''}">
      <div class="task-main">
        <label class="checkbox-label">
          <input class="task-toggle" type="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
          <span class="task-title">${escapeHtml(task.title)}</span>
        </label>
        <p>${escapeHtml(task.description || '暂无描述')}</p>
        <div class="task-meta">
          <span>${escapeHtml(task.categories?.name || '未分类')}</span>
          <span>${formatDate(task.due_date)}</span>
        </div>
      </div>
      <div class="task-actions">
        <a class="button ghost" href="edit.html?id=${task.id}">编辑</a>
        <button class="button danger delete-task" type="button" data-id="${task.id}">删除</button>
      </div>
    </article>
  `).join('');
}

categoryForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();
  const form = new FormData(categoryForm);
  const { error } = await supabase.from('categories').insert({
    name: form.get('name').trim(),
    user_id: currentUser.id,
  });
  if (error) return showMessage(`添加分类失败：${error.message}`);
  categoryForm.reset();
  try {
    await loadCategories();
    showMessage('课程分类已添加。', 'success');
  } catch (loadError) {
    showMessage(`刷新分类失败：${loadError.message}`);
  }
});

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearMessage();
  const form = new FormData(taskForm);
  const { error } = await supabase.from('tasks').insert({
    title: form.get('title').trim(),
    description: form.get('description').trim() || null,
    due_date: form.get('due_date') || null,
    category_id: form.get('category_id') || null,
    user_id: currentUser.id,
  });
  if (error) return showMessage(`添加任务失败：${error.message}`);
  taskForm.reset();
  await loadTasks();
  showMessage('任务已保存。', 'success');
});

categoryFilter.addEventListener('change', () => loadTasks().catch((error) => {
  showMessage(`加载任务失败：${error.message}`);
}));

taskList.addEventListener('change', async (event) => {
  if (!event.target.matches('.task-toggle')) return;
  const { error } = await supabase
    .from('tasks')
    .update({ completed: event.target.checked })
    .eq('id', event.target.dataset.id);
  if (error) {
    event.target.checked = !event.target.checked;
    return showMessage(`更新任务失败：${error.message}`);
  }
  await loadTasks();
});

taskList.addEventListener('click', async (event) => {
  if (!event.target.matches('.delete-task')) return;
  if (!window.confirm('确定删除这个任务吗？')) return;
  const { error } = await supabase.from('tasks').delete().eq('id', event.target.dataset.id);
  if (error) return showMessage(`删除任务失败：${error.message}`);
  await loadTasks();
  showMessage('任务已删除。', 'success');
});

logoutButton.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.replace('index.html');
});

async function initialize() {
  currentUser = await requireUser();
  if (!currentUser) return;
  document.querySelector('#user-email').textContent = currentUser.email;
  try {
    await loadCategories();
    await loadTasks();
  } catch (error) {
    showMessage(`加载数据失败：${error.message}`);
  }
}

initialize();
