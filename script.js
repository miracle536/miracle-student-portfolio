document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  const taskForm = document.getElementById('task-form');
  if (taskForm) {
    const input = document.getElementById('task-input');
    const dateInput = document.getElementById('task-date');
    const list = document.getElementById('task-list');
    const empty = document.getElementById('empty-state');
    const count = document.getElementById('task-count');
    let tasks = [];
    try { tasks = JSON.parse(localStorage.getItem('miracleTasks') || '[]'); } catch (_) { tasks = []; }

    const save = () => localStorage.setItem('miracleTasks', JSON.stringify(tasks));
    const render = () => {
      list.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.done ? ' done' : '');
        const check = document.createElement('input');
        check.type = 'checkbox'; check.checked = task.done;
        check.setAttribute('aria-label', 'Mark task complete');
        check.addEventListener('change', () => { task.done = check.checked; save(); render(); });
        const content = document.createElement('span'); content.className = 'task-text';
        content.append(document.createTextNode(task.text));
        if (task.date) { const due = document.createElement('small'); due.textContent = 'Due: ' + task.date; content.append(due); }
        const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Delete';
        remove.addEventListener('click', () => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); });
        li.append(check, content, remove); list.append(li);
      });
      empty.hidden = tasks.length > 0;
      count.textContent = tasks.length + (tasks.length === 1 ? ' task' : ' tasks');
    };
    taskForm.addEventListener('submit', event => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      tasks.unshift({ id: Date.now(), text, date: dateInput.value, done: false });
      save(); render(); taskForm.reset(); input.focus();
    });
    render();
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = encodeURIComponent('Message from ' + data.get('name'));
    const body = encodeURIComponent('Name: ' + data.get('name') + '\\nEmail: ' + data.get('email') + '\\nPhone: ' + data.get('phone') + '\\n\\n' + data.get('message'));
    const status = document.getElementById('contact-status');
    status.textContent = 'Your message is ready. Connect an email service or replace this demo with your preferred form backend to send it.';
    // No email address is assumed or invented.
  });
});