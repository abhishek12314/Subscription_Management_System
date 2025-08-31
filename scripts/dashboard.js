import { requireAuth, listSubs, addSub, updateSub, deleteSub, checkReminders, exportJSON, importJSON, logout } from './storage.js';

const userId = requireAuth();
const tbody = document.querySelector('#subsTable tbody');
const search = document.getElementById('searchInput');
const filter = document.getElementById('statusFilter');
const addBtn = document.getElementById('addBtn');
const modal = document.getElementById('modal');
const cancelBtn = document.getElementById('cancelBtn');
const form = document.getElementById('subForm');
const modalTitle = document.getElementById('modalTitle');
const upcomingList = document.getElementById('upcomingList');
const notice = document.getElementById('notice');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) logoutBtn.onclick = logout;

function openModal(editing = null) {
  modal.classList.remove('hidden');
  if (editing) {
    modalTitle.textContent = 'Edit Subscription';
    form.id.value = editing.id;
    form.service_name.value = editing.service_name;
    form.amount.value = editing.amount;
    form.billing_date.value = editing.billing_date;
    form.status.value = editing.status;
  } else {
    modalTitle.textContent = 'Add Subscription';
    form.reset();
    form.id.value = '';
    form.status.value = 'ACTIVE';
  }
}
function closeModal() { modal.classList.add('hidden'); }

cancelBtn.addEventListener('click', closeModal);
addBtn.addEventListener('click', () => openModal());

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const isEdit = !!data.id;
  try {
    if (isEdit) {
      updateSub(userId, data.id, {
        service_name: data.service_name,
        amount: Number(data.amount),
        billing_date: data.billing_date,
        status: data.status
      });
    } else {
      addSub(userId, data);
    }
    closeModal();
    load();
  } catch (e) { alert(e.message); }
});

search.addEventListener('input', load);
filter.addEventListener('change', load);

exportBtn.addEventListener('click', () => {
  const blob = new Blob([exportJSON(userId)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'subscriptions.json'; a.click();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', async () => {
  const file = importFile.files[0];
  if (!file) return;
  const text = await file.text();
  try {
    importJSON(userId, text);
    load();
  } catch (e) { alert('Import failed: ' + e.message); }
  importFile.value = '';
});

function renderUpcoming(list) {
  if (!list.length) {
    upcomingList.innerHTML = '<li>No upcoming in the reminder window.</li>';
    return;
  }
  upcomingList.innerHTML = list.map(s => `<li>${s.service_name} — due ${s.billing_date}</li>`).join('');
}

function renderNotice(msg) {
  if (!msg) { notice.style.display = 'none'; notice.textContent = ''; return; }
  notice.textContent = msg;
  notice.style.display = 'block';
}

function load() {
  const q = search.value.trim();
  const status = filter.value;
  const subs = listSubs(userId, { q, status });
  tbody.innerHTML = '';
  const upcoming = [];
  subs.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.service_name}</td>
      <td>₹${Number(s.amount).toFixed(2)}</td>
      <td>${s.billing_date}</td>
      <td>${s.status}</td>
      <td>
        <button class="btn" data-edit="${s.id}">Edit</button>
        <button class="btn" data-del="${s.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
    const days = (new Date(s.billing_date) - new Date()) / (1000 * 60 * 60 * 24);
    if (days >= 0 && days <= 7) upcoming.push(s);
  });
  renderUpcoming(upcoming);
  tbody.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-edit');
      const s = subs.find(x => String(x.id) === String(id));
      openModal(s);
    });
  });
  tbody.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-del');
      if (confirm('Delete this subscription?')) {
        deleteSub(userId, id);
        load();
      }
    });
  });
}

async function runReminderCheck() {
  const due = await checkReminders();
  if (due.length) {
    renderNotice(`You have ${due.length} upcoming payment(s) within your reminder window.`);
  } else {
    renderNotice('');
  }
}

document.getElementById("addBtn").addEventListener("click", () => {
  window.location.href = "/add-subscription.html";
});


load();
runReminderCheck();
// Check hourly while the page is open
setInterval(runReminderCheck, 60 * 60 * 1000);
