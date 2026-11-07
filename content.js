(() => {
  'use strict';

  const CONFIG = {
    pickLabels: ['add shift'],
    confirmLabels: ['yes. add shift', 'yes, add shift', 'yes add shift'],
    stayLabels: [
      'stay logged in', 'stay signed in', 'keep me logged in', 'keep me signed in',
      "yes, i'm here", "i'm still here", 'still here', 'continue session',
      'remain logged in', 'extend session'
    ],
    dismissLabels: ['cancel', 'close', 'dismiss', 'got it'],
    successLabels: ['shift added', 'shift accepted', 'success', 'confirmed', 'added to your schedule'],
    errorLabels: ['shift no longer available', 'already taken', 'unable to add', 'error'],
    doneLabels: ['done'],
    confirmTimeoutMs: 5000,
    doneTimeoutMs: 5000,
    resultTimeoutMs: 7000,
    sessionCheckMs: 1000,
    historyLimit: 100
  };

  const DEFAULT_SETTINGS = {
    notifications: true,
    sound: true,
    autoStart: false,
    theme: 'dark'
  };

  const state = {
    running: false,
    grabbing: false,
    observer: null,
    sessionTimer: null,
    watchStartedAt: null,
    attempts: 0,
    successes: 0,
    settings: { ...DEFAULT_SETTINGS },
    history: [],
    logs: []
  };

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const textOf = el => (el?.textContent || '').trim();
  const norm = value => String(value || '').trim().toLowerCase();

  function visible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
  }

  function findAll(labels, root = document) {
    const wanted = labels.map(norm);
    return Array.from(root.querySelectorAll('button, [role="button"], a'))
      .filter(el => visible(el) && wanted.some(label => norm(textOf(el)).includes(label)));
  }

  function findOne(labels, root = document) {
    return findAll(labels, root)[0] || null;
  }

  function findTextMatch(labels) {
    const wanted = labels.map(norm);
    const nodes = Array.from(document.querySelectorAll('[role="alert"], [aria-live], .alert, .toast, .notification, main, body'));
    return nodes.find(node => wanted.some(label => norm(textOf(node)).includes(label))) || null;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function formatTime(ms) {
    return `${Math.max(0, Math.round(ms))} ms`;
  }

  async function storageGet(keys) {
    return new Promise(resolve => chrome.storage.local.get(keys, resolve));
  }

  async function storageSet(value) {
    return new Promise(resolve => chrome.storage.local.set(value, resolve));
  }

  async function loadPersistedState() {
    const saved = await storageGet(['v2_settings', 'v2_history']);
    state.settings = { ...DEFAULT_SETTINGS, ...(saved.v2_settings || {}) };
    state.history = Array.isArray(saved.v2_history) ? saved.v2_history.slice(0, CONFIG.historyLimit) : [];
  }

  async function saveSettings() {
    await storageSet({ v2_settings: state.settings });
  }

  async function saveHistory() {
    await storageSet({ v2_history: state.history.slice(0, CONFIG.historyLimit) });
  }

  function addLog(message, level = '') {
    const entry = { time: nowIso(), message, level };
    state.logs.unshift(entry);
    state.logs = state.logs.slice(0, 300);

    const container = document.getElementById('v2-log');
    if (container) {
      const row = document.createElement('div');
      row.className = level;
      row.textContent = `[${new Date(entry.time).toLocaleTimeString()}] ${message}`;
      container.prepend(row);
      while (container.children.length > 80) container.lastChild.remove();
    }
  }

  function setStatus(text, cls = '') {
    const el = document.getElementById('v2-status');
    if (!el) return;
    el.textContent = text;
    el.className = cls;
  }

  function setInfo(text) {
    const el = document.getElementById('v2-info');
    if (el) el.textContent = text;
  }

  function refreshStats() {
    const grabbed = document.getElementById('v2-grabbed');
    const attempts = document.getElementById('v2-attempts');
    if (grabbed) grabbed.innerHTML = `${state.successes}<span>confirmed grabs</span>`;
    if (attempts) attempts.textContent = `${state.attempts} attempt${state.attempts === 1 ? '' : 's'}`;
  }

  function beep() {
    if (!state.settings.sound) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (_) {}
  }

  function notify(title, body) {
    if (!state.settings.notifications || Notification.permission !== 'granted') return;
    new Notification(title, { body, icon: chrome.runtime.getURL('icon.png') });
  }

  async function addHistory(entry) {
    state.history.unshift(entry);
    state.history = state.history.slice(0, CONFIG.historyLimit);
    await saveHistory();
    renderHistory();
  }

  function renderHistory() {
    const el = document.getElementById('v2-history');
    if (!el) return;
    el.innerHTML = '';
    const rows = state.history.slice(0, 8);
    if (!rows.length) {
      el.textContent = 'No history yet.';
      return;
    }
    for (const item of rows) {
      const row = document.createElement('div');
      row.className = item.success ? 'ok' : 'err';
      const when = new Date(item.time).toLocaleString();
      row.textContent = `${item.success ? '✓' : '×'} ${when} · ${item.latencyMs ?? '?'} ms`;
      el.appendChild(row);
    }
  }

  function downloadText(filename, text, type = 'text/plain') {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportLogs() {
    const payload = {
      exportedAt: nowIso(),
      settings: state.settings,
      summary: { attempts: state.attempts, successes: state.successes },
      history: state.history,
      logs: state.logs
    };
    downloadText(`v2-sniper-${Date.now()}.json`, JSON.stringify(payload, null, 2), 'application/json');
    addLog('Exported logs and history.', 'ok');
  }

  function applyTheme() {
    const ui = document.getElementById('v2-ui');
    if (ui) ui.dataset.theme = state.settings.theme;
  }

  function syncSettingsUi() {
    const fields = {
      'v2-notifications': state.settings.notifications,
      'v2-sound': state.settings.sound,
      'v2-autostart': state.settings.autoStart
    };
    for (const [id, value] of Object.entries(fields)) {
      const el = document.getElementById(id);
      if (el) el.checked = value;
    }
    const theme = document.getElementById('v2-theme');
    if (theme) theme.value = state.settings.theme;
    applyTheme();
  }

  function checkSessionPopup() {
    const button = findOne(CONFIG.stayLabels);
    if (!button) return;
    addLog(`Session prompt detected; clicking “${textOf(button)}”.`);
    button.click();
  }

  async function waitForButton(labels, timeoutMs) {
    const started = performance.now();
    while (performance.now() - started < timeoutMs) {
      const button = findOne(labels);
      if (button) return button;
      await sleep(100);
    }
    return null;
  }

  async function waitForResult(timeoutMs) {
    const started = performance.now();
    while (performance.now() - started < timeoutMs) {
      if (findTextMatch(CONFIG.successLabels)) return { success: true, reason: 'success message detected' };
      if (findTextMatch(CONFIG.errorLabels)) return { success: false, reason: 'error message detected' };
      await sleep(150);
    }
    return { success: null, reason: 'no final status detected' };
  }

  async function grabAvailableShifts() {
    if (state.grabbing || !state.running) return;
    const initial = findAll(CONFIG.pickLabels);
    if (!initial.length) return;

    state.grabbing = true;
    disconnectObserver();
    setStatus(`⚡ Processing ${initial.length} shift(s)…`, 'active');
    addLog(`Found ${initial.length} available shift button(s).`);

    for (let index = 0; index < initial.length && state.running; index++) {
      const button = findAll(CONFIG.pickLabels)[0];
      if (!button) break;

      state.attempts++;
      refreshStats();
      const detectedAt = state.watchStartedAt || performance.now();
      const clickedAt = performance.now();
      addLog(`Clicking Add Shift (${index + 1}/${initial.length}).`);
      button.click();

      const confirm = await waitForButton(CONFIG.confirmLabels, CONFIG.confirmTimeoutMs);
      if (!confirm) {
        addLog('Confirmation button was not found.', 'err');
        await addHistory({ time: nowIso(), success: false, latencyMs: Math.round(clickedAt - detectedAt), reason: 'confirmation missing' });
        continue;
      }

      confirm.click();
      const confirmedAt = performance.now();
      addLog(`Clicked confirmation “${textOf(confirm)}”.`);

      const result = await waitForResult(CONFIG.resultTimeoutMs);

      // Some successful shift additions show a final modal with a “Done” button.
      // Close it automatically so the page is ready to continue watching.
      const doneButton = await waitForButton(CONFIG.doneLabels, CONFIG.doneTimeoutMs);
      if (doneButton) {
        addLog(`Completion popup detected; clicking “${textOf(doneButton)}”.`);
        doneButton.click();
        await sleep(300);
      } else {
        addLog('No completion “Done” button detected; continuing.');
      }

      const latencyMs = Math.round(confirmedAt - detectedAt);
      const assumedSuccess = result.success !== false;

      if (assumedSuccess) {
        state.successes++;
        refreshStats();
        setStatus(`🎉 ${state.successes} shift(s) confirmed`, 'success');
        addLog(`Shift processed in ${formatTime(latencyMs)} (${result.reason}).`, 'ok');
        beep();
        notify('V2 Sniper', `Shift processed in ${latencyMs} ms.`);
      } else {
        setStatus('⚠️ Shift attempt failed', 'error');
        addLog(`Shift attempt failed (${result.reason}).`, 'err');
      }

      await addHistory({ time: nowIso(), success: assumedSuccess, latencyMs, reason: result.reason });
      await sleep(800);
    }

    state.grabbing = false;
    if (state.running) {
      setStatus('👀 Watching…', 'active');
      connectObserver();
    }
  }

  function connectObserver() {
    if (state.observer || !state.running) return;
    state.observer = new MutationObserver(() => {
      if (findAll(CONFIG.pickLabels).length) grabAvailableShifts();
    });
    state.observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    if (findAll(CONFIG.pickLabels).length) grabAvailableShifts();
  }

  function disconnectObserver() {
    state.observer?.disconnect();
    state.observer = null;
  }

  function startWatcher() {
    if (state.running) return;
    state.running = true;
    state.watchStartedAt = performance.now();
    sessionStorage.setItem('v2_running', '1');
    document.getElementById('v2-start').disabled = true;
    document.getElementById('v2-stop').disabled = false;
    setStatus('👀 Watching…', 'active');
    setInfo('DOM observer active. Waiting for shifts.');
    addLog('Watcher started.');
    connectObserver();
  }

  function stopWatcher() {
    state.running = false;
    state.grabbing = false;
    sessionStorage.removeItem('v2_running');
    disconnectObserver();
    document.getElementById('v2-start').disabled = false;
    document.getElementById('v2-stop').disabled = true;
    setStatus('⏹ Stopped');
    setInfo('Press Watch to start again.');
    addLog('Watcher stopped.');
  }

  function createUi() {
    if (document.getElementById('v2-ui')) return;
    const style = document.createElement('style');
    style.textContent = `
      #v2-ui { --bg:#1a1a2e; --panel:#24243e; --text:#eee; --muted:#9ca3af; --accent:#ff9900;
        position:fixed; bottom:20px; right:20px; z-index:2147483647; width:310px; max-height:82vh; overflow:auto;
        background:var(--bg); color:var(--text); border:1px solid var(--accent); border-radius:12px; padding:14px;
        font:13px/1.4 "Segoe UI",sans-serif; box-shadow:0 8px 28px rgba(0,0,0,.45); }
      #v2-ui[data-theme="light"] { --bg:#fff; --panel:#f3f4f6; --text:#111827; --muted:#6b7280; }
      #v2-header { display:flex; justify-content:space-between; font-weight:700; color:var(--accent); font-size:16px; margin-bottom:7px; }
      #v2-status { color:var(--muted); } #v2-status.active{color:#22c55e} #v2-status.success{color:var(--accent);font-weight:700} #v2-status.error{color:#ef4444}
      #v2-info { color:var(--muted); font-size:11px; margin:3px 0 9px; }
      #v2-grabbed { font-size:28px; font-weight:700; text-align:center; color:var(--accent); }
      #v2-grabbed span { display:block; font-size:11px; color:var(--muted); font-weight:400; }
      #v2-attempts { text-align:center; color:var(--muted); font-size:11px; margin-bottom:9px; }
      #v2-controls { display:flex; gap:8px; margin-bottom:9px; }
      #v2-ui button, #v2-ui select { border:0; border-radius:6px; padding:8px; font:inherit; }
      #v2-controls button { flex:1; cursor:pointer; font-weight:700; } #v2-controls button:disabled{opacity:.4;cursor:not-allowed}
      #v2-start{background:var(--accent);color:#000} #v2-stop{background:#4b5563;color:#fff}
      #v2-export{width:100%;background:var(--panel);color:var(--text);cursor:pointer;margin-bottom:8px}
      #v2-settings { background:var(--panel); border-radius:8px; padding:8px; margin-bottom:8px; }
      #v2-settings label { display:flex; align-items:center; justify-content:space-between; gap:8px; margin:5px 0; font-size:11px; }
      #v2-settings select { padding:3px 6px; background:var(--bg); color:var(--text); }
      details summary { cursor:pointer; color:var(--accent); font-weight:600; margin:6px 0; }
      #v2-log, #v2-history { font-size:10px; color:var(--muted); max-height:110px; overflow:auto; line-height:1.55; }
      #v2-log .ok, #v2-history .ok{color:#22c55e} #v2-log .err, #v2-history .err{color:#ef4444}
      #v2-shortcuts { font-size:10px; color:var(--muted); margin-top:7px; text-align:center; }
    `;
    document.head.appendChild(style);

    const ui = document.createElement('section');
    ui.id = 'v2-ui';
    ui.innerHTML = `
      <div id="v2-header"><span>🎯 V2 Sniper</span><span>2.1</span></div>
      <div id="v2-status">Ready</div>
      <div id="v2-info">Configure settings, then press Watch.</div>
      <div id="v2-grabbed">0<span>confirmed grabs</span></div>
      <div id="v2-attempts">0 attempts</div>
      <div id="v2-controls"><button id="v2-start">👀 Watch</button><button id="v2-stop" disabled>⏹ Stop</button></div>
      <button id="v2-export">⬇ Export logs and history</button>
      <div id="v2-settings">
        <label>Desktop notifications <input id="v2-notifications" type="checkbox"></label>
        <label>Success sound <input id="v2-sound" type="checkbox"></label>
        <label>Auto-start <input id="v2-autostart" type="checkbox"></label>
        <label>Theme <select id="v2-theme"><option value="dark">Dark</option><option value="light">Light</option></select></label>
      </div>
      <details><summary>Recent history</summary><div id="v2-history"></div></details>
      <details><summary>Activity log</summary><div id="v2-log"></div></details>
      <div id="v2-shortcuts">Alt+W watch · Alt+S stop · Alt+E export</div>
    `;
    document.body.appendChild(ui);

    document.getElementById('v2-start').addEventListener('click', startWatcher);
    document.getElementById('v2-stop').addEventListener('click', stopWatcher);
    document.getElementById('v2-export').addEventListener('click', exportLogs);

    const bindSetting = (id, key, valueFn = el => el.checked) => {
      document.getElementById(id).addEventListener('change', async event => {
        state.settings[key] = valueFn(event.target);
        await saveSettings();
        applyTheme();
      });
    };
    bindSetting('v2-notifications', 'notifications');
    bindSetting('v2-sound', 'sound');
    bindSetting('v2-autostart', 'autoStart');
    bindSetting('v2-theme', 'theme', el => el.value);
  }

  function installShortcuts() {
    document.addEventListener('keydown', event => {
      if (!event.altKey) return;
      const key = event.key.toLowerCase();
      if (key === 'w') { event.preventDefault(); startWatcher(); }
      if (key === 's') { event.preventDefault(); stopWatcher(); }
      if (key === 'e') { event.preventDefault(); exportLogs(); }
    });
  }

  async function init() {
    await loadPersistedState();
    createUi();
    syncSettingsUi();
    refreshStats();
    renderHistory();
    installShortcuts();

    if (Notification.permission === 'default' && state.settings.notifications) {
      Notification.requestPermission();
    }

    state.sessionTimer = setInterval(checkSessionPopup, CONFIG.sessionCheckMs);

    if (sessionStorage.getItem('v2_running') === '1' || state.settings.autoStart) {
      addLog('Auto-starting watcher.');
      startWatcher();
    } else {
      addLog('V2 Sniper initialized.');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();