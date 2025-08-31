import { requireAuth, currentUser, updateProfile, logout } from './storage.js';
requireAuth();
const form = document.getElementById('settingsForm');
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.onclick = logout;

function load() {
  const me = currentUser();
  form.name.value = me?.name || '';
  form.reminders_enabled.value = String(me?.reminders_enabled ?? 1);
  form.reminder_days.value = String(me?.reminder_days ?? 3);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  updateProfile({
    name: data.name,
    reminders_enabled: Number(data.reminders_enabled),
    reminder_days: Number(data.reminder_days)
  });
  alert('Saved!');
});

load();
