
function showPanel(id, tab) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  tab.classList.add('active');
}
function toggleAcc(hd) {
  const bd = hd.nextElementSibling;
  const open = hd.classList.contains('open');
  document.querySelectorAll('.acc-hd').forEach(h => h.classList.remove('open'));
  document.querySelectorAll('.acc-bd').forEach(b => b.classList.remove('open'));
  if (!open) { hd.classList.add('open'); bd.classList.add('open'); }
}

const KEY = 'ccb_mp_v3';
const WA  = '5511986072453';

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || '{}');
    document.querySelectorAll('#main-checklist li').forEach(li => {
      if (s[li.dataset.idx]) { li.classList.add('done'); li.querySelector('.chk').classList.add('on'); }
    });
    const n  = localStorage.getItem('ccb_nome3') || '';
    const co = localStorage.getItem('ccb_co3') || '';
    const fn = localStorage.getItem('ccb_fn3') || '';
    if (n) document.getElementById('nome-input').value = n;
    if (co) {
      const sel = document.getElementById('co-input');
      const opt = [...sel.options].find(o => o.value === co || o.text === co);
      if (opt) { sel.value = opt.value; }
      else { sel.value = '__outra__'; document.getElementById('co-outra-input').style.display='block'; document.getElementById('co-outra-input').value = co; }
    }
    if (fn) {
      const sel = document.getElementById('funcao-input');
      const opt = [...sel.options].find(o => o.value === fn || o.text === fn);
      if (opt) { sel.value = opt.value; }
      else { sel.value = '__outra__'; document.getElementById('funcao-outra-input').style.display='block'; document.getElementById('funcao-outra-input').value = fn; }
    }
  } catch(e) {}
  updateProg();
}
function saveState() {
  const s = {};
  document.querySelectorAll('#main-checklist li').forEach(li => { s[li.dataset.idx] = li.classList.contains('done'); });
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    localStorage.setItem('ccb_nome3', document.getElementById('nome-input').value);
    // salvar CO
    var _coSel = document.getElementById('co-input');
    var _coVal = _coSel ? (_coSel.value === '__outra__' ? (document.getElementById('co-outra-input').value||'') : _coSel.value) : '';
    localStorage.setItem('ccb_co3', _coVal);
    // salvar Funcao
    var _fnSel = document.getElementById('funcao-input');
    var _fnVal = _fnSel ? (_fnSel.value === '__outra__' ? (document.getElementById('funcao-outra-input').value||'') : _fnSel.value) : '';
    localStorage.setItem('ccb_fn3', _fnVal);
  } catch(e) {}
}
function toggleChk(chk) {
  const li = chk.closest('li');
  const on = !li.classList.contains('done');
  li.classList.toggle('done', on);
  chk.classList.toggle('on', on);
  saveState(); updateProg();
}
function checkBtn() {
  const n = document.getElementById('nome-input').value.trim();
  const btn = document.getElementById('btn-enviar');
  const hint = document.getElementById('btn-hint');
  if (!btn) return;
  const ok = n.length > 2;
  btn.disabled = !ok;
  if (hint) hint.style.display = ok ? 'none' : 'block';
}
function updateProg() {
  const total = document.querySelectorAll('#main-checklist li').length;
  const done  = document.querySelectorAll('#main-checklist li.done').length;
  document.getElementById('progress-bar').style.width = Math.round(done/total*100) + '%';
  document.getElementById('progress-label').textContent = done + ' de ' + total + ' itens concluídos';
  const msg = document.getElementById('done-msg');
  if (msg) msg.style.display = done === total ? 'block' : 'none';
  checkBtn();
}
function getCOValor() {
  const sel = document.getElementById('co-input');
  if (sel.value === '__outra__') return document.getElementById('co-outra-input').value.trim();
  return sel.value;
}
function getFuncaoValor() {
  const sel = document.getElementById('funcao-input');
  if (sel.value === '__outra__') return document.getElementById('funcao-outra-input').value.trim();
  return sel.value;
}
function toggleOutraCO(sel) {
  document.getElementById('co-outra-input').style.display = sel.value === '__outra__' ? 'block' : 'none';
}
function toggleOutraFuncao(sel) {
  document.getElementById('funcao-outra-input').style.display = sel.value === '__outra__' ? 'block' : 'none';
}
function enviarWA() {
  const nome   = document.getElementById('nome-input').value.trim();
  const co     = getCOValor();
  const funcao = getFuncaoValor();
  if (!nome) { alert('Preencha seu nome antes de enviar.'); return; }
  const d = new Date();
  const data = d.toLocaleDateString('pt-BR');
  const hora = d.toLocaleTimeString('pt-BR', {hour:'2-digit',minute:'2-digit'});
  const msg = encodeURIComponent(
    '✅ *CONCLUSÃO DE TREINAMENTO*\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '*Módulo:* Manutenção Preventiva — SIGA\n' +
    '*Administração:* Vinhedo\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '*Nome:* ' + nome + '\n' +
    (co     ? '*Casa de Oração:* ' + co + '\n' : '') +
    (funcao ? '*Função:* ' + funcao + '\n' : '') +
    '*Data:* ' + data + ' às ' + hora + '\n' +
    '━━━━━━━━━━━━━━━━━━━━\n' +
    '☑ Todos os 10 itens concluídos.\n' +
    'Que Deus abençoe! 🙏'
  );
  window.open('https://wa.me/' + WA + '?text=' + msg, '_blank');
}

// ── ADMIN ─────────────────────────────────────────────────────────────────
const ADMIN_SENHA = 'ccb2026';
let _adminB64 = null, _adminFilename = '', _adminHTMLNovo = '';

document.addEventListener('click', function(e) {
  // Não interferir em cliques em elementos interativos
  const tag = e.target.tagName;
  if (['BUTTON','A','INPUT','SELECT','TEXTAREA','LABEL'].includes(tag)) return;
  if (e.target.closest('button,a,input,select,textarea,label')) return;
  const f = document.getElementById('admin-secret-field');
  if (f) f.focus();
});

function adminCheckSenha(input) {
  if (input.value.toLowerCase() === ADMIN_SENHA) {
    input.value = '';
    _adminB64 = null; _adminFilename = ''; _adminHTMLNovo = '';
    ['admin-pdf-info','admin-label-input','admin-desc-input',
     'admin-btn-embed','admin-status','admin-btn-download'].forEach(id => {
      const el = document.getElementById(id);
      el.style.display = 'none';
      if (el.tagName === 'INPUT') el.value = '';
      if (id === 'admin-status') el.textContent = '';
    });
    document.getElementById('admin-file-input').value = '';
    document.getElementById('admin-panel').classList.add('open');
  }
}

function fecharAdmin() {
  document.getElementById('admin-panel').classList.remove('open');
}

function adminFileChosen(input) {
  const file = input.files[0];
  if (!file) return;
  _adminFilename = file.name;
  const info = document.getElementById('admin-pdf-info');
  info.textContent = '📄 ' + file.name + ' (' + (file.size/1024).toFixed(0) + ' KB)';
  info.style.display = 'block';
  document.getElementById('admin-label-input').style.display = 'block';
  document.getElementById('admin-desc-input').style.display = 'block';
  document.getElementById('admin-btn-embed').style.display = 'block';
  document.getElementById('admin-status').style.display = 'none';
  document.getElementById('admin-btn-download').style.display = 'none';
  const reader = new FileReader();
  reader.onload = e => { _adminB64 = e.target.result.split(',')[1]; };
  reader.readAsDataURL(file);
}

// Drag & drop
document.addEventListener('DOMContentLoaded', function() {
  const dz = document.getElementById('admin-dz');
  if (!dz) return;
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.style.borderColor = 'var(--ch1)'; });
  dz.addEventListener('dragleave', () => { dz.style.borderColor = '#ccc'; });
  dz.addEventListener('drop', e => {
    e.preventDefault(); dz.style.borderColor = '#ccc';
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      adminFileChosen({ files: [file] });
    }
  });
});

function adminEmbutir() {
  if (!_adminB64) { alert('Aguarde o PDF carregar.'); return; }
  const label = document.getElementById('admin-label-input').value.trim() || _adminFilename.replace('.pdf','');
  const desc  = document.getElementById('admin-desc-input').value.trim() || 'Material de apoio';
  const safeName = _adminFilename.replace(/[^a-zA-Z0-9._-]/g,'_');

  const novoCard = `
    <div class="dl-card">
      <div class="dl-icon"><svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:white"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/></svg></div>
      <div class="dl-type">PDF</div>
      <div class="dl-name">${label}</div>
      <div class="dl-desc">${desc}</div>
      <a class="btn btn-solid" href="data:application/pdf;base64,${_adminB64}" download="${safeName}">⬇ Baixar</a>
    </div>`;

  let html = document.documentElement.outerHTML;
  const marker = '<!-- FIM-DL-GRID -->';
  if (html.includes(marker)) {
    html = html.replace(marker, novoCard + '\n  ' + marker);
  }
  _adminHTMLNovo = html;
  const st = document.getElementById('admin-status');
  st.textContent = '✔ PDF embutido! Clique em Baixar HTML Atualizado.';
  st.style.display = 'block';
  document.getElementById('admin-btn-embed').style.display = 'none';
  document.getElementById('admin-btn-download').style.display = 'block';
}

function adminBaixar() {
  if (!_adminHTMLNovo) return;
  const blob = new Blob([_adminHTMLNovo], {type: 'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'index.html'; a.click();
  URL.revokeObjectURL(url);
}

loadState();
