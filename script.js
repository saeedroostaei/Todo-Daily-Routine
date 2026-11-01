'use strict';

const progressCircle = document.getElementById('progress-circle');
const progressText = document.getElementById('progress-text');
const addBtn = document.getElementById('add-btn');
const taskInput = document.getElementById('task-input');
const taskTime = document.getElementById('task-time');
const taskPriority = document.getElementById('task-priority');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearAllTask = document.getElementById('clear-all-btn');
const editModal = document.getElementById('edit-modal');
const editInput = document.getElementById('edit-input');
const saveEdit = document.getElementById('save-edit-btn');
const cancelEdit = document.getElementById('cancel-edit-btn');
const themeToggle = document.getElementById('theme-toggle');

let currentTaskToEdit = null;

const updateProgress = function () {
  const numberTask = taskList.children.length;
  const completedTasks = taskList.querySelectorAll('.completed');
  progressText.textContent = completedTasks.length + '/' + numberTask;

  if (numberTask > 0 && completedTasks.length === numberTask) {
    progressCircle.style.backgroundColor = '#4caf50';
    progressCircle.style.borderColor = '#66bb6a';
  } else if (numberTask > 0 && completedTasks.length === 0) {
    progressCircle.style.backgroundColor = '#f44336';
    progressCircle.style.borderColor = '#ef5350';
  } else {
    progressCircle.style.backgroundColor = 'rgb(236, 110, 7)';
    progressCircle.style.borderColor = 'rgb(247, 150, 5)';
  }
};

const saveData = function () {
  const allTasks = [];
  const tasks = taskList.querySelectorAll('li');

  tasks.forEach(function (task) {
    const text = task.querySelector('span').innerText;
    const timeSpan = task.querySelector('.task-time-badge');
    const time = timeSpan ? timeSpan.innerText.replace('⏰ ', '') : '';
    const isCompleted = task.classList.contains('completed');
    const priority = task.dataset.priority || 'normal';

    allTasks.push({
      text: text,
      time: time,
      completed: isCompleted,
      priority: priority,
    });
  });

  localStorage.setItem('myTasks', JSON.stringify(allTasks));
};

const showToast = function (message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

const createTask = function (text, time, isCompleted, priority = 'normal') {
  const addLi = document.createElement('li');
  const iconDiv = document.createElement('div');
  const delBtn = document.createElement('button');
  const completeBtn = document.createElement('button');
  const editBtn = document.createElement('button');
  const infoDiv = document.createElement('div');
  const textSpan = document.createElement('span');
  const timeSpan = document.createElement('span');

  addLi.dataset.time = time;
  addLi.dataset.priority = priority;
  addLi.classList.add(`priority-${priority}`);

  iconDiv.className = 'task_icon';
  delBtn.className = 'btn-delete';
  completeBtn.className = 'btn-complete';
  editBtn.className = 'btn-edit';
  infoDiv.className = 'task-info';

  textSpan.innerText = text;
  infoDiv.appendChild(textSpan);

  if (time !== '') {
    timeSpan.className = 'task-time-badge';
    timeSpan.innerText = '⏰ ' + time;
    infoDiv.appendChild(timeSpan);
  }

  iconDiv.appendChild(delBtn);
  iconDiv.appendChild(completeBtn);
  iconDiv.appendChild(editBtn);
  addLi.appendChild(infoDiv);
  addLi.appendChild(iconDiv);
  taskList.appendChild(addLi);

  delBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>`;
  completeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`;
  editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>`;

  if (isCompleted) {
    addLi.classList.add('completed');
  }

  delBtn.addEventListener('click', function () {
    addLi.classList.add('fade-out');
    setTimeout(() => {
      addLi.remove();
      updateProgress();
      saveData();
    }, 300);
  });

  completeBtn.addEventListener('click', function () {
    addLi.classList.toggle('completed');
    updateProgress();
    saveData();
  });

  editBtn.addEventListener('click', function () {
    currentTaskToEdit = textSpan;
    editInput.value = textSpan.innerText;
    editModal.classList.add('active');
  });
};

saveEdit.addEventListener('click', function () {
  if (currentTaskToEdit !== null) {
    currentTaskToEdit.innerText = editInput.value;
    editModal.classList.remove('active');
    currentTaskToEdit = null;
    saveData();
  }
});

cancelEdit.addEventListener('click', function () {
  editModal.classList.remove('active');
  currentTaskToEdit = null;
});

const loadTasks = function () {
  const storedTasks = JSON.parse(localStorage.getItem('myTasks'));
  if (storedTasks) {
    storedTasks.forEach(function (task) {
      createTask(task.text, task.time, task.completed, task.priority);
    });
  }
  updateProgress();
};

addBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const valueInput = taskInput.value;
  const timeInput = taskTime.value;
  const priorityInput = taskPriority.value;

  if (valueInput === '' && timeInput === '') return;

  createTask(valueInput, timeInput, false, priorityInput);

  taskInput.value = '';
  taskTime.value = '';
  updateProgress();
  saveData();
  showToast('تسک با موفقیت اضافه شد', 'success');
});

filterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    const filterValue = btn.dataset.filter;
    filterBtns.forEach(function (f) {
      f.classList.remove('active');
    });
    btn.classList.add('active');

    const allTasks = taskList.querySelectorAll('li');
    allTasks.forEach(function (task) {
      if (filterValue === 'all') {
        task.style.display = 'flex';
      } else if (filterValue === 'active') {
        task.style.display = task.classList.contains('completed')
          ? 'none'
          : 'flex';
      } else if (filterValue === 'completed') {
        task.style.display = task.classList.contains('completed')
          ? 'flex'
          : 'none';
      }
    });
  });
});

clearAllTask.addEventListener('click', function () {
  taskList.innerHTML = '';
  updateProgress();
  saveData();
  showToast('همه تسک‌ها پاک شدند', 'danger');
});

themeToggle.addEventListener('click', function () {
  document.body.classList.toggle('light-mode');
});

setInterval(function () {
  const now = new Date();
  const currentTime =
    now.getHours().toString().padStart(2, '0') +
    ':' +
    now.getMinutes().toString().padStart(2, '0');
  const allTasks = taskList.querySelectorAll('li');

  allTasks.forEach(function (task) {
    const taskTimeValue = task.dataset.time;
    const isCompleted = task.classList.contains('completed');

    if (taskTimeValue !== '' && !isCompleted && taskTimeValue === currentTime) {
      if (!task.classList.contains('alerted')) {
        showToast(
          '⏰ زمان انجام کار: ' + task.querySelector('span').innerText,
          'warning',
        );
        task.classList.add('alerted');
      }
    }
  });
}, 10000);

loadTasks();
