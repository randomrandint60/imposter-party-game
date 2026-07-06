/* ============================================================
   Imposter Party — Web Edition  |  app.js
   Complete game engine with settings, multi-round, hints, 
   custom avatar selector, and real-time online same-room multiplayer
   fully optimized using Socket.io for fast room messaging.
   ============================================================ */

// ── Realtime Signaling Settings ──────────────────────────────
const WS_URL = 'wss://imposter-party-game-ek3p.onrender.com';

// ── Audio ────────────────────────────────────────────────────
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
const SOUNDS = {
  click: () => tone(600, 150, 0.12, 'sine',     [150]),
  flip:  () => tone(300, 250, 0.15, 'triangle', [900]),
  gong:  () => tone(160, 550, 0.25, 'sawtooth', [60]),
  tick:  () => tone(880,  50, 0.08, 'square',   [880]),
  win:   () => { [523,659,784,1047].forEach((f,i) => tone(f,250,0.15,'sine',[],i*0.12)); },
  fail:  () => tone(220, 500, 0.20, 'sawtooth', [80])
};
function tone(freq, ms, vol, type, ramps, delay=0) {
  try {
    const ctx = getAudio(), osc = ctx.createOscillator(), g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = type;
    const t = ctx.currentTime + delay;
    osc.frequency.setValueAtTime(freq, t);
    if (ramps[0]) osc.frequency.exponentialRampToValueAtTime(ramps[0], t + ms/1000);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + ms/1000);
    osc.start(t); osc.stop(t + ms/1000);
  } catch(e) {}
}
function playSound(n) { SOUNDS[n] && SOUNDS[n](); }

// ── Constants ─────────────────────────────────────────────────
const COLORS = ['#8b5cf6','#00f0ff','#ff007f','#10b981','#f59e0b',
                '#3b82f6','#ef4444','#a855f7','#06b6d4','#84cc16','#f97316','#ec4899'];
const EMOJIS = ['🐱','🐶','🦊','🐺','🐻','🐼','🐨','🐯','🦁','🐸','🐧','🦉'];
const PICKER_EMOJIS = [
  '🐱','🐶','🦊','🐺','🐻','🐼','🐨','🐯','🦁','🐸','🐧','🦉',
  '🐙','🐵','🐔','🦄','🦖','🐝','👻','👽','🤖','🍕','🍩','💩',
  '🔥','⭐','🎮','🎸','🚀','👑','🍿','🎨','🍔','🥑','🍉','🌮'
];

// ── Settings ──────────────────────────────────────────────────
const DEF_SETTINGS = { imposterCount:1, randomImposterCount:false, imposterGoesLast:false, imposterHint:false, timerDuration:30 };
let S = { ...DEF_SETTINGS };

function loadSettings() {
  try { const s = localStorage.getItem('ig_settings'); if(s) S = {...DEF_SETTINGS,...JSON.parse(s)}; } catch(e){}
}
function saveSettings() {
  try { localStorage.setItem('ig_settings', JSON.stringify(S)); } catch(e){}
}
function openSettings() {
  playSound('click');
  document.getElementById('si-count').textContent  = S.imposterCount;
  document.getElementById('si-timer').textContent  = S.timerDuration + 's';
  document.getElementById('si-last').checked  = S.imposterGoesLast;
  document.getElementById('si-hint').checked  = S.imposterHint;
  
  const randToggle = document.getElementById('si-random-count');
  if (randToggle) {
    randToggle.checked = S.randomImposterCount;
    document.getElementById('setting-count-row').style.display = S.randomImposterCount ? 'none' : 'flex';
  }
  
  document.getElementById('settings-modal').classList.add('active');
}
function settingStep(key, d) {
  playSound('click');
  if (key === 'count') {
    S.imposterCount = Math.max(1, Math.min(11, S.imposterCount + d));
    document.getElementById('si-count').textContent = S.imposterCount;
  } else {
    S.timerDuration = Math.max(15, Math.min(90, S.timerDuration + d));
    document.getElementById('si-timer').textContent = S.timerDuration + 's';
  }
  saveSettings();
}
function toggleSetting(key) { 
  S[key] = !S[key]; 
  saveSettings(); 
  if (key === 'randomImposterCount') {
    document.getElementById('setting-count-row').style.display = S.randomImposterCount ? 'none' : 'flex';
    if (typeof updateOddsDisplay === 'function') updateOddsDisplay();
  }
}

// ── Game State ────────────────────────────────────────────────
const GS = {
  mode: 'classic',
  players: [],
  selectedCats: [],
  chosenCatName: '',

  // round data
  word: '', normalQ: '', liarQ: '',
  revealQueue: [], revealIdx: 0,
  descQueue:   [], descIdx:   0,
  timerActive: false, timerSecs: 30, timerHandle: null,
  eliminatedPlayer: null,

  // custom packs
  customWords: [],
  customQuestions: [],

  // avatar picker edit state
  editingPlayerId: null,

  // Online Multiplayer State
  isOnline: false,
  isHost: false,
  roomCode: null,
  socket: null,
  myPlayerId: null,
  joinerAvatar: { emoji: '🐱', color: '#8b5cf6' }
};

// ── Init ──────────────────────────────────────────────────────
function initApp() {
  loadSettings();
  try {
    const sp = localStorage.getItem('ig_players');
    if (sp) GS.players = JSON.parse(sp);
  } catch(e) {}
  if (!GS.players.length) {
    GS.players = [
      { id:1, name:'Alice',   color:COLORS[0], emoji:EMOJIS[0] },
      { id:2, name:'Bob',     color:COLORS[1], emoji:EMOJIS[1] },
      { id:3, name:'Charlie', color:COLORS[2], emoji:EMOJIS[2] },
      { id:4, name:'Daisy',   color:COLORS[3], emoji:EMOJIS[3] }
    ];
  }
  try {
    const cw = localStorage.getItem('ig_custom_words');      if(cw) GS.customWords      = JSON.parse(cw);
    const cq = localStorage.getItem('ig_custom_questions');  if(cq) GS.customQuestions  = JSON.parse(cq);
  } catch(e) {}

  renderPlayerList();
  renderCatGrid();
  showScreen('screen-home');

  // Auto join room if in link query
  const params = new URLSearchParams(window.location.search);
  const room = params.get('room');
  if (room) {
    setTimeout(() => { openJoinModal(); }, 400);
  }
}

// ── Screen switching ──────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) { void el.offsetWidth; el.classList.add('active'); }
}

// ── Notification ──────────────────────────────────────────────
let notifTimer;
function notify(msg) {
  const el = document.getElementById('notification-banner');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

// ── Realtime Synchronization WebSockets (Socket.io) ───────────
function initSocket(onConnect) {
  if (GS.socket && GS.socket.connected) {
    if (onConnect) onConnect();
    return;
  }
  
  notify('Connecting to server (waking up server tier)...');
  
  // Connect to Render Socket.io server
  GS.socket = io(WS_URL, {
    transports: ['websocket', 'polling']
  });
  
  GS.socket.on('connect', () => {
    notify('Connected to lobby sync network! 🌐');
    if (onConnect) onConnect();
  });
  
  GS.socket.on('room_hosted', (data) => {
    document.getElementById('setup-online-indicator').style.display = 'flex';
    document.getElementById('setup-room-code').textContent = GS.roomCode;
    renderPlayerList();
    showScreen('screen-setup');
  });
  
  GS.socket.on('room_joined', (data) => {
    closeModal('join-modal');
    document.getElementById('lobby-code-val').textContent = GS.roomCode;
    showScreen('screen-lobby');
  });
  
  GS.socket.on('player_joined', (data) => {
    if (GS.isHost) {
      const p = data.player;
      if (!GS.players.some(x => x.id === p.id)) {
        GS.players.push({
          id: p.id,
          name: p.name,
          color: p.color,
          emoji: p.emoji,
          isRemote: true
        });
        renderPlayerList();
        playSound('click');
        notify(`${p.name} joined the room!`);
        syncLobbyToJoiners();
      }
    }
  });
  
  GS.socket.on('player_left', (data) => {
    if (GS.isHost) {
      GS.players = GS.players.filter(x => x.id !== data.playerId);
      renderPlayerList();
      notify('A player left the room.');
      syncLobbyToJoiners();
    }
  });
  
  GS.socket.on('room_closed', (data) => {
    notify(data.message);
    leaveLobby();
  });
  
  GS.socket.on('sync_action', (data) => {
    handleGameStateSync(data);
  });
  
  GS.socket.on('disconnect', () => {
    if (GS.isOnline) {
      notify('Signal lost. Reconnecting to lobby...');
    }
  });
  
  GS.socket.on('connect_error', () => {
    notify('Failed to connect to lobby server. Make sure server is hosted.');
  });
}

function syncState(action, extraData = {}) {
  if (GS.isOnline && GS.socket && GS.socket.connected) {
    GS.socket.emit('sync_action', {
      action: action,
      ...extraData
    });
  }
}

function handleGameStateSync(data) {
  // Joiners receiving lobby player lists updates
  if (data.action === 'lobby_update') {
    if (!GS.isHost) {
      GS.players = data.players;
      updateLobbyJoinerList();
    }
  }
  // Joiners starting reveal round
  else if (data.action === 'start_game') {
    GS.players = data.players;
    GS.revealQueue = data.revealQueue.map(id => GS.players.find(x => x.id === id));
    GS.revealIdx = 0;
    GS.word = data.word;
    GS.normalQ = data.normalQ;
    GS.liarQ = data.liarQ;
    GS.mode = data.mode;
    GS.selectedCats = data.selectedCats;
    GS.chosenCatName = data.chosenCatName;

    // Reset flipped card state
    const card = document.getElementById('reveal-card');
    if (card) card.classList.remove('flipped');

    showRevealIntro();
  }
  // Syncing reveal transitions
  else if (data.action === 'reveal_next') {
    GS.revealIdx = data.revealIdx;
    
    const card = document.getElementById('reveal-card');
    if (card) card.classList.remove('flipped');
    
    if (GS.revealIdx < GS.revealQueue.length) {
      showRevealIntro();
    } else {
      startDescribePhase();
    }
  }
  // Syncing speak phase
  else if (data.action === 'start_describe') {
    GS.descQueue = data.descQueue.map(id => GS.players.find(x => x.id === id));
    GS.descIdx = 0;
    renderDescQueue();
    setupDescriber();
    showScreen('screen-describe');
  }
  // Syncing turn timers
  else if (data.action === 'timer_toggle') {
    GS.timerSecs = data.secs;
    GS.timerActive = data.active;
    const btn = document.getElementById('timer-btn');
    
    if (GS.timerActive) {
      btn.textContent = 'Pause';
      btn.className = 'btn btn-secondary';
      clearInterval(GS.timerHandle);
      GS.timerHandle = setInterval(() => {
        GS.timerSecs--;
        drawTimer();
        if (GS.timerSecs <= 0) {
          clearInterval(GS.timerHandle); GS.timerActive = false;
          playSound('gong'); btn.textContent = "Time's Up!"; btn.className = 'btn btn-accent';
        }
      }, 1000);
    } else {
      clearInterval(GS.timerHandle);
      btn.textContent = 'Resume';
      btn.className = 'btn btn-secondary';
    }
    drawTimer();
  }
  // Syncing describer turns
  else if (data.action === 'describe_next') {
    GS.descIdx = data.descIdx;
    if (GS.descIdx < GS.descQueue.length) {
      renderDescQueue();
      setupDescriber();
    } else {
      startVotePhase();
    }
  }
  // Syncing vote stage
  else if (data.action === 'start_vote') {
    startVotePhase();
  }
  // Syncing vote eliminations
  else if (data.action === 'player_eliminated') {
    const p = GS.players.find(x => x.id === data.playerId);
    if (p) {
      p.active = false;
      playSound('gong');
      const who = p.role === 'imposter'
        ? (GS.mode === 'classic' ? 'the Imposter!' : 'the Liar!')
        : (GS.mode === 'classic' ? `a Civilian (word: ${GS.word})` : 'a Normal Citizen');
      notify(`${p.name} was ${who}`);
      
      if (GS.isHost) {
        checkEnd();
      }
    }
  }
  // Joiner receiving guess input
  else if (data.action === 'show_guess_screen') {
    showGuessScreen();
  }
  // Host receiving imposter guess submission
  else if (data.action === 'imposter_guess') {
    if (GS.isHost) {
      evaluateImposterGuess(data.guess);
    }
  }
  // Syncing round game over
  else if (data.action === 'game_over') {
    endGame(data.winner);
  }
  // Replay
  else if (data.action === 'reset_round') {
    GS.players.forEach(p => p.active = true);
    if (GS.isHost) {
      showScreen('screen-categories');
    } else {
      showScreen('screen-lobby');
    }
  }
}

// ── Host Room Action ──────────────────────────────────────────
function openHostModal() {
  playSound('click');
  const preview = document.getElementById('host-avatar-preview');
  if (preview) {
    preview.textContent = GS.joinerAvatar.emoji;
    preview.style.backgroundColor = GS.joinerAvatar.color;
  }
  document.getElementById('host-modal').classList.add('active');
}

function openHostAvatarPicker() {
  playSound('click');
  GS.editingPlayerId = 'host';
  renderAvatarPickerGrids(GS.joinerAvatar.emoji, GS.joinerAvatar.color);
  document.getElementById('avatar-modal').classList.add('active');
}

function submitHostRoom() {
  const nameInp = document.getElementById('host-name-input');
  const name = (nameInp.value || '').trim();
  
  if (!name) { notify('Please enter your name!'); return; }
  playSound('click');
  
  closeModal('host-modal');
  
  GS.isOnline = true;
  GS.isHost = true;
  GS.roomCode = Math.floor(1000 + Math.random() * 9000).toString();
  GS.myPlayerId = Date.now();
  
  GS.players = [{
    id: GS.myPlayerId,
    name: name,
    color: GS.joinerAvatar.color,
    emoji: GS.joinerAvatar.emoji,
    isRemote: false
  }];
  
  initSocket(() => {
    GS.socket.emit('host_room', { room: GS.roomCode });
  });
}

function syncLobbyToJoiners() {
  syncState('lobby_update', { players: GS.players });
}

function updateLobbyJoinerList() {
  const list = document.getElementById('lobby-players-list');
  if (!list) return;
  list.innerHTML = '';
  GS.players.forEach(p => {
    const el = document.createElement('div');
    el.className = 'player-tag';
    el.innerHTML = `<div class="player-info-tag">
      <div class="player-avatar-dot" style="background:${p.color}">${p.emoji}</div>
      <span style="font-weight:600; font-size:0.95rem; padding:4px 6px;">${esc(p.name)}</span>
    </div>`;
    list.appendChild(el);
  });
}

// ── Join Room Modal Actions ───────────────────────────────────
function openJoinModal() {
  playSound('click');
  const params = new URLSearchParams(window.location.search);
  const r = params.get('room');
  if (r) document.getElementById('join-room-input').value = r;

  const preview = document.getElementById('join-avatar-preview');
  preview.textContent = GS.joinerAvatar.emoji;
  preview.style.backgroundColor = GS.joinerAvatar.color;
  
  document.getElementById('join-modal').classList.add('active');
}

function openJoinAvatarPicker() {
  playSound('click');
  GS.editingPlayerId = 'joiner';
  renderAvatarPickerGrids(GS.joinerAvatar.emoji, GS.joinerAvatar.color);
  document.getElementById('avatar-modal').classList.add('active');
}

function submitJoinRoom() {
  const roomInp = document.getElementById('join-room-input');
  const nameInp = document.getElementById('join-name-input');
  const room = (roomInp.value || '').trim();
  const name = (nameInp.value || '').trim();
  
  if (!room || !name) { notify('Fill in all fields!'); return; }
  playSound('click');
  
  GS.isOnline = true;
  GS.isHost = false;
  GS.roomCode = room;
  GS.myPlayerId = Date.now();
  
  initSocket(() => {
    GS.socket.emit('join_room', {
      room: room,
      playerId: GS.myPlayerId,
      name: name,
      emoji: GS.joinerAvatar.emoji,
      color: GS.joinerAvatar.color
    });
  });
}

function leaveLobby() {
  playSound('click');
  if (GS.socket) {
    GS.socket.disconnect();
  }
  GS.isOnline = false;
  GS.isHost = false;
  GS.roomCode = null;
  GS.socket = null;
  GS.myPlayerId = null;
  
  document.getElementById('setup-online-indicator').style.display = 'none';
  
  const sp = localStorage.getItem('ig_players');
  if (sp) GS.players = JSON.parse(sp);
  renderPlayerList();
  showScreen('screen-home');
}

function copyRoomLink() {
  playSound('click');
  const url = `${window.location.origin}${window.location.pathname}?room=${GS.roomCode}`;
  navigator.clipboard.writeText(url).then(() => {
    notify('Room link copied to clipboard!');
  }).catch(() => {
    notify(`Code: ${GS.roomCode}`);
  });
}

// ── Players list management ───────────────────────────────────
function savePlayers() { 
  if (!GS.isOnline) {
    localStorage.setItem('ig_players', JSON.stringify(GS.players)); 
  }
}

function updateOddsDisplay() {
  const totalW = GS.players.reduce((s, p) => s + (p.weight !== undefined ? p.weight : 50), 0);
  const maxImp = Math.max(1, GS.players.length - 1);
  const estImp = S.randomImposterCount ? Math.max(1, Math.floor(GS.players.length / 2)) : Math.min(S.imposterCount, maxImp);
  
  GS.players.forEach(p => {
    const el = document.getElementById(`chance-badge-${p.id}`);
    if (el) {
      if (totalW <= 0) {
        el.textContent = '0%';
      } else {
        const chance = Math.min(100, Math.round(((p.weight !== undefined ? p.weight : 50) / totalW) * estImp * 100));
        el.textContent = `${chance}%`;
      }
    }
  });
}

function setPlayerWeight(id, val) {
  const p = GS.players.find(x => x.id === id);
  if (p) {
    p.weight = parseInt(val, 10);
    savePlayers();
    updateOddsDisplay();
    if (GS.isOnline && GS.isHost) syncLobbyToJoiners();
  }
}

function openOddsModal() {
  playSound('click');
  document.getElementById('settings-modal').classList.remove('active');
  renderOddsList();
  document.getElementById('odds-modal').classList.add('active');
}

function renderOddsList() {
  const ul = document.getElementById('odds-list-container');
  if (!ul) return;
  ul.innerHTML = '';
  if (!GS.players.length) {
    ul.innerHTML = '<p class="empty-list-msg">No players yet — add some first!</p>';
    return;
  }
  GS.players.forEach(p => {
    if (typeof p.weight === 'undefined') p.weight = 50;
    const li = document.createElement('div');
    li.className = 'player-tag';
    li.style.flexDirection = 'column';
    li.style.alignItems = 'flex-start';
    li.style.gap = '8px';
    
    const sliderDisable = (GS.isOnline && !GS.isHost) ? 'disabled' : '';

    li.innerHTML = `
      <div class="player-info-tag">
        <div class="player-avatar-dot" style="background:${p.color};">${p.emoji}</div>
        <span style="font-weight:600; font-size:0.95rem;">${esc(p.name)}</span>
      </div>
      <div style="display:flex; align-items:center; gap:10px; padding: 0 4px; width:100%;">
        <input type="range" class="player-weight-slider" min="0" max="100" value="${p.weight}" 
               oninput="setPlayerWeight(${p.id}, this.value)" ${sliderDisable}>
        <span id="chance-badge-${p.id}" class="player-chance-badge">0%</span>
      </div>`;
    ul.appendChild(li);
  });
  updateOddsDisplay();
}

function resetOdds() {
  playSound('click');
  GS.players.forEach(p => p.weight = 50);
  savePlayers();
  renderOddsList();
  if (GS.isOnline && GS.isHost) syncLobbyToJoiners();
}

function renderPlayerList() {
  const ul = document.getElementById('players-list');
  ul.innerHTML = '';
  if (!GS.players.length) {
    ul.innerHTML = '<p class="empty-list-msg">No players yet — add some above!</p>';
    updatePlayerCount();
    return;
  }
  GS.players.forEach(p => {
    if (typeof p.weight === 'undefined') p.weight = 50;
    const li = document.createElement('div');
    li.className = 'player-tag';
    
    const inlineEditAttr = p.isRemote ? 'disabled style="pointer-events:none;"' : '';
    const avatarCursor = p.isRemote ? '' : 'cursor: pointer;';
    const avatarTitle = p.isRemote ? '' : 'title="Edit Icon"';
    const avatarClick = p.isRemote ? '' : `onclick="openAvatarPicker(${p.id})"`;

    li.innerHTML = `
      <div class="player-info-tag">
        <div class="player-avatar-dot" style="background:${p.color}; ${avatarCursor}" 
             ${avatarClick} ${avatarTitle}>${p.emoji}</div>
        <input type="text" class="player-name-input" value="${esc(p.name)}" 
               onchange="renamePlayer(${p.id}, this.value)" 
               onkeydown="if(event.key==='Enter') this.blur()" ${inlineEditAttr}>
      </div>
      <button class="remove-player-btn" onclick="removePlayer(${p.id})">✕</button>`;
    ul.appendChild(li);
  });
  updatePlayerCount();
}

function openAvatarPicker(id) {
  playSound('click');
  GS.editingPlayerId = id;
  const p = GS.players.find(x => x.id === id);
  if (!p) return;
  renderAvatarPickerGrids(p.emoji, p.color);
  document.getElementById('avatar-modal').classList.add('active');
}

function renderAvatarPickerGrids(activeEmoji, activeColor) {
  const emGrid = document.getElementById('picker-emojis-grid');
  emGrid.innerHTML = '';
  PICKER_EMOJIS.forEach(em => {
    const btn = document.createElement('button');
    btn.className = 'picker-em-btn' + (em === activeEmoji ? ' active' : '');
    btn.textContent = em;
    btn.onclick = () => selectPickerEmoji(em);
    emGrid.appendChild(btn);
  });

  const colGrid = document.getElementById('picker-colors-grid');
  colGrid.innerHTML = '';
  COLORS.forEach(col => {
    const btn = document.createElement('button');
    btn.className = 'picker-col-btn' + (col === activeColor ? ' active' : '');
    btn.style.backgroundColor = col;
    btn.onclick = () => selectPickerColor(col);
    colGrid.appendChild(btn);
  });
}

function selectPickerEmoji(em) {
  playSound('click');
  if (GS.editingPlayerId === 'joiner' || GS.editingPlayerId === 'host') {
    GS.joinerAvatar.emoji = em;
    const preview = document.getElementById(GS.editingPlayerId === 'joiner' ? 'join-avatar-preview' : 'host-avatar-preview');
    if (preview) preview.textContent = em;
    renderAvatarPickerGrids(em, GS.joinerAvatar.color);
  } else {
    const p = GS.players.find(x => x.id === GS.editingPlayerId);
    if (p) {
      p.emoji = em;
      savePlayers();
      renderPlayerList();
      renderAvatarPickerGrids(p.emoji, p.color);
      if (GS.isHost) syncLobbyToJoiners();
    }
  }
}

function selectPickerColor(col) {
  playSound('click');
  if (GS.editingPlayerId === 'joiner' || GS.editingPlayerId === 'host') {
    GS.joinerAvatar.color = col;
    const preview = document.getElementById(GS.editingPlayerId === 'joiner' ? 'join-avatar-preview' : 'host-avatar-preview');
    if (preview) preview.style.backgroundColor = col;
    renderAvatarPickerGrids(GS.joinerAvatar.emoji, col);
  } else {
    const p = GS.players.find(x => x.id === GS.editingPlayerId);
    if (p) {
      p.color = col;
      savePlayers();
      renderPlayerList();
      renderAvatarPickerGrids(p.emoji, p.color);
      if (GS.isHost) syncLobbyToJoiners();
    }
  }
}

function updatePlayerCount() {
  const el = document.getElementById('player-count');
  if (el) el.textContent = `${GS.players.length} / 12`;
}

function addPlayer() {
  const inp = document.getElementById('new-player-name');
  const name = (inp.value || '').trim();
  if (!name) { shake(inp); inp.focus(); return; }
  if (GS.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    notify('That name is already taken!'); inp.select(); return;
  }
  if (GS.players.length >= 12) { notify('Max 12 players!'); return; }
  playSound('click');
  const i = GS.players.length % COLORS.length;
  GS.players.push({ id: Date.now(), name, color: COLORS[i], emoji: EMOJIS[i] });
  savePlayers(); renderPlayerList();
  inp.value = ''; inp.focus();
  
  if (GS.isOnline && GS.isHost) {
    syncLobbyToJoiners();
  }
}

function removePlayer(id) {
  playSound('click');
  GS.players = GS.players.filter(p => p.id !== id);
  savePlayers(); renderPlayerList();
  
  if (GS.isOnline && GS.isHost) {
    syncLobbyToJoiners();
  }
}

function clearAllPlayers() {
  playSound('gong');
  GS.players = [];
  savePlayers(); renderPlayerList();
  notify('All players cleared!');
  
  if (GS.isOnline && GS.isHost) {
    syncLobbyToJoiners();
  }
}

function renamePlayer(id, newName) {
  const name = newName.trim();
  if (!name) {
    renderPlayerList();
    return;
  }
  if (GS.players.some(p => p.id !== id && p.name.toLowerCase() === name.toLowerCase())) {
    notify('That name is already taken!');
    renderPlayerList();
    return;
  }
  const p = GS.players.find(x => x.id === id);
  if (p) {
    p.name = name;
    savePlayers();
    if (GS.isOnline && GS.isHost) syncLobbyToJoiners();
  }
}

function shake(el) {
  el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
  setTimeout(() => el.classList.remove('shake'), 400);
}

// ── Mode & Category ───────────────────────────────────────────
function setGameMode(mode) {
  playSound('click');
  GS.mode = mode;
  GS.selectedCats = [];
  renderCatGrid();
  
  const isClassic = mode === 'classic';
  document.getElementById('custom-word-entry').style.display     = isClassic ? 'flex' : 'none';
  document.getElementById('custom-question-entry').style.display = isClassic ? 'none' : 'flex';
  document.getElementById('custom-words-count').style.display    = isClassic ? 'block' : 'none';
  document.getElementById('custom-questions-count').style.display= isClassic ? 'none' : 'block';
  showScreen('screen-setup');
}

function renderCatGrid() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const db = GS.mode === 'classic' ? IMPOSTER_WORDS : IMPOSTER_QUESTIONS;
  Object.keys(db).forEach(key => {
    const cat = db[key];
    const cnt = cat.words ? cat.words.length : cat.pairs.length;
    const card = document.createElement('div');
    card.className = 'category-card' + (GS.selectedCats.includes(key) ? ' selected' : '');
    card.id = `cat-${key}`;
    card.onclick = () => selectCat(key);
    card.innerHTML = `<span class="cat-emoji">${cat.icon}</span>
      <span class="cat-name">${cat.name}</span>
      <span class="cat-count">${cnt} words</span>`;
    grid.appendChild(card);
  });
  
  const customCnt = GS.mode === 'classic' ? GS.customWords.length : GS.customQuestions.length;
  const cc = document.createElement('div');
  cc.className = 'category-card' + (GS.selectedCats.includes('custom') ? ' selected' : '');
  cc.id = 'cat-custom';
  cc.onclick = () => selectCat('custom');
  cc.innerHTML = `<span class="cat-emoji">✨</span>
    <span class="cat-name">Custom</span>
    <span class="cat-count">${customCnt} words</span>`;
  grid.appendChild(cc);
}

function selectCat(key) {
  playSound('click');
  const idx = GS.selectedCats.indexOf(key);
  if (idx > -1) {
    GS.selectedCats.splice(idx, 1);
    const el = document.getElementById(`cat-${key}`);
    if (el) el.classList.remove('selected');
  } else {
    GS.selectedCats.push(key);
    const el = document.getElementById(`cat-${key}`);
    if (el) el.classList.add('selected');
  }
}

function goToCategories() {
  if (GS.players.length < 3) {
    notify('You need at least 3 players to start!');
    return;
  }
  playSound('click');
  renderCatGrid();
  showScreen('screen-categories');
}

// ── Custom packs ──────────────────────────────────────────────
function updateCustomCounts() {
  const we = document.getElementById('custom-words-count');
  const qe = document.getElementById('custom-questions-count');
  if (we) we.textContent = `${GS.customWords.length} words loaded`;
  if (qe) qe.textContent = `${GS.customQuestions.length} question pairs loaded`;
}

function addCustomWord() {
  const inp = document.getElementById('custom-civ-word');
  const w = (inp.value||'').trim();
  if (!w) { notify('Enter a word!'); return; }
  playSound('click');
  GS.customWords.push(w);
  localStorage.setItem('ig_custom_words', JSON.stringify(GS.customWords));
  inp.value = '';
  updateCustomCounts(); renderCatGrid();
  selectCat('custom'); notify(`"${w}" added!`);
}

function addCustomQuestion() {
  const ni = document.getElementById('custom-normal-q');
  const li = document.getElementById('custom-liar-q');
  const n = (ni.value||'').trim(), l = (li.value||'').trim();
  if (!n||!l) { notify('Fill in both questions!'); return; }
  playSound('click');
  GS.customQuestions.push({normal:n,liar:l});
  localStorage.setItem('ig_custom_questions', JSON.stringify(GS.customQuestions));
  ni.value=''; li.value='';
  updateCustomCounts(); renderCatGrid();
  selectCat('custom'); notify('Question pair added!');
}

function clearCustom() {
  playSound('gong');
  if (GS.mode === 'classic') { GS.customWords=[]; localStorage.removeItem('ig_custom_words'); }
  else { GS.customQuestions=[]; localStorage.removeItem('ig_custom_questions'); }
  updateCustomCounts(); renderCatGrid(); notify('Custom pack cleared!');
}

// ── Start game round ──────────────────────────────────────────
function startGame() {
  if (!GS.selectedCats.length) { notify('Pick at least one category!'); return; }

  // clamp imposter count
  let impCount = 1;
  if (S.randomImposterCount) {
    impCount = Math.floor(Math.random() * (GS.players.length - 1)) + 1;
  } else {
    const maxImp = Math.max(1, GS.players.length - 1);
    impCount = Math.min(S.imposterCount, maxImp);
  }

  let chosenItem = null;

  // pick word / question from all selected categories
  if (GS.mode === 'classic') {
    let pool = [];
    GS.selectedCats.forEach(cat => {
      if (cat === 'custom') {
        GS.customWords.forEach(w => pool.push({ word: w, catName: 'Custom' }));
      } else {
        const catWords = IMPOSTER_WORDS[cat].words || IMPOSTER_WORDS[cat].pairs.map(p=>p.civilian);
        const name = IMPOSTER_WORDS[cat].name;
        catWords.forEach(w => pool.push({ word: w, catName: name }));
      }
    });
    if (!pool.length) { notify('No words in selected categories!'); return; }
    chosenItem = pool[Math.floor(Math.random() * pool.length)];
    GS.word = chosenItem.word;
    GS.chosenCatName = chosenItem.catName;
  } else {
    let pool = [];
    GS.selectedCats.forEach(cat => {
      if (cat === 'custom') {
        GS.customQuestions.forEach(q => pool.push({ q, catName: 'Custom' }));
      } else {
        const name = IMPOSTER_QUESTIONS[cat].name;
        IMPOSTER_QUESTIONS[cat].pairs.forEach(q => pool.push({ q, catName: name }));
      }
    });
    if (!pool.length) { notify('No questions in selected categories!'); return; }
    chosenItem = pool[Math.floor(Math.random() * pool.length)];
    GS.normalQ = chosenItem.q.normal; 
    GS.liarQ = chosenItem.q.liar;
    GS.chosenCatName = chosenItem.catName;
  }

  playSound('click');

  // reset all players
  GS.players.forEach(p => { p.active=true; p.role='civilian'; p.word=''; });

  // assign imposters
  let pool = [...GS.players];
  for (let i = 0; i < impCount; i++) {
    const totalWeight = pool.reduce((sum, p) => sum + (p.weight !== undefined ? p.weight : 50), 0);
    let chosen;
    if (totalWeight <= 0 || pool.length === 0) {
      chosen = pool[Math.floor(Math.random() * pool.length)];
    } else {
      let rand = Math.random() * totalWeight;
      for (const p of pool) {
        rand -= (p.weight !== undefined ? p.weight : 50);
        if (rand <= 0) {
          chosen = p;
          break;
        }
      }
    }
    if (!chosen) chosen = pool[0];
    chosen.role = 'imposter';
    chosen.word = GS.mode === 'classic' ? '' : GS.liarQ;
    pool = pool.filter(p => p.id !== chosen.id);
  }
  
  GS.players.filter(p=>p.role==='civilian').forEach(p => {
    p.word = GS.mode === 'classic' ? GS.word : GS.normalQ;
  });

  // build reveal queue
  let queue = [...GS.players];
  shuffle(queue);
  GS.revealQueue = queue;
  GS.revealIdx   = 0;

  // clear timer state
  clearInterval(GS.timerHandle);
  GS.timerActive = false;
  GS.timerSecs   = S.timerDuration;

  // clear queues
  GS.descQueue = [];
  GS.descIdx   = 0;

  // Reset flipped card state
  const card = document.getElementById('reveal-card');
  if (card) card.classList.remove('flipped');

  if (GS.isOnline && GS.isHost) {
    syncState('start_game', {
      players: GS.players,
      revealQueue: GS.revealQueue.map(p => p.id),
      word: GS.word,
      normalQ: GS.normalQ,
      liarQ: GS.liarQ,
      mode: GS.mode,
      selectedCats: GS.selectedCats,
      chosenCatName: GS.chosenCatName
    });
  }

  showRevealIntro();
}

function playAgain() { 
  if (GS.isOnline) {
    if (!GS.isHost) return;
    syncState('reset_round');
  }
  startGame(); 
}

// ── Reveal phase ──────────────────────────────────────────────
function showRevealIntro() {
  const p = GS.revealQueue[GS.revealIdx];
  setEl('ri-avatar', p.emoji);
  setStyle('ri-avatar', 'background', p.color);
  setEl('ri-name', p.name);
  setEl('ri-progress', `${GS.revealIdx+1} of ${GS.revealQueue.length}`);
  
  // Online mode reveal state
  if (GS.isOnline) {
    const isMe = (!GS.isHost && p.id === GS.myPlayerId) || (GS.isHost && !p.isRemote);
    if (!isMe) {
      document.getElementById('ri-pass-label').textContent = 'REVEAL STAGE';
      document.getElementById('ri-privacy-lbl').style.display = 'none';
      document.getElementById('ri-ready-btn').style.display = 'none';
      document.getElementById('ri-waiting-wrap').style.display = 'block';
      document.getElementById('ri-waiting-label').textContent = `Waiting for ${p.name} to view their role…`;
      showScreen('screen-reveal-intro');
      return;
    }
  }

  // Local/Active reveal state
  document.getElementById('ri-pass-label').textContent = 'PASS THE DEVICE TO';
  document.getElementById('ri-privacy-lbl').style.display = 'block';
  document.getElementById('ri-ready-btn').style.display = 'block';
  document.getElementById('ri-waiting-wrap').style.display = 'none';
  showScreen('screen-reveal-intro');
}

function tapReveal() {
  playSound('click');
  const p = GS.revealQueue[GS.revealIdx];
  const front = document.getElementById('reveal-card-front');
  front.className = 'card-side card-front'; // reset role classes

  setEl('rc-avatar', p.emoji);
  setStyle('rc-avatar','background', p.color);
  setEl('rc-name', p.name);

  const label  = document.getElementById('rc-label');
  const secret = document.getElementById('rc-secret');

  if (GS.mode === 'classic') {
    if (p.role === 'civilian') {
      front.classList.add('role-civilian');
      label.textContent  = '✅ You know the word';
      secret.innerHTML   = `<span class="rc-sub">Secret word:</span><strong>${esc(GS.word)}</strong>`;
    } else {
      front.classList.add('role-imposter');
      label.textContent = '🔴 You are the Imposter!';
      if (S.imposterHint) {
        secret.innerHTML = `<span class="rc-sub">Hint — Category:</span><strong style="color:var(--yellow)">${esc(GS.chosenCatName)}</strong>`;
      } else {
        secret.innerHTML = `<span class="rc-sub imp-msg">You have NO word.<br>Blend in &amp; bluff!</span>`;
      }
    }
  } else {
    if (p.role === 'civilian') {
      front.classList.add('role-civilian');
      label.textContent = '✅ Your question:';
      secret.innerHTML  = `<div class="liar-q">"${esc(GS.normalQ)}"</div>`;
    } else {
      front.classList.add('role-imposter');
      label.textContent = '🤥 You are the Liar!';
      secret.innerHTML  = `<div class="liar-q imp-msg">"${esc(GS.liarQ)}"</div>`;
    }
  }

  const card = document.getElementById('reveal-card');
  if (card) card.classList.remove('flipped');
  showScreen('screen-reveal-card');
}

function flipCard() {
  const card = document.getElementById('reveal-card');
  if (card && !card.classList.contains('flipped')) {
    playSound('flip');
    card.classList.add('flipped');
  }
}

function nextReveal() {
  playSound('click');
  
  const card = document.getElementById('reveal-card');
  if (card) card.classList.remove('flipped');

  GS.revealIdx++;
  
  if (GS.isOnline) {
    syncState('reveal_next', { revealIdx: GS.revealIdx });
  }

  if (GS.revealIdx < GS.revealQueue.length) {
    showRevealIntro();
  } else {
    startDescribePhase();
  }
}

// ── Describe phase ────────────────────────────────────────────
function startDescribePhase() {
  if (GS.isOnline) {
    if (GS.isHost) {
      GS.descQueue = shuffle([...GS.players.filter(p=>p.active)]);
      
      if (S.imposterGoesLast && GS.descQueue.length > 1) {
        if (GS.descQueue[0].role === 'imposter') {
          const civIdx = GS.descQueue.findIndex(p => p.role !== 'imposter');
          if (civIdx > -1) {
            [GS.descQueue[0], GS.descQueue[civIdx]] = [GS.descQueue[civIdx], GS.descQueue[0]];
          }
        }
      }
      
      GS.descIdx = 0;
      syncState('start_describe', { descQueue: GS.descQueue.map(p => p.id) });
      
      renderDescQueue();
      setupDescriber();
      showScreen('screen-describe');
    }
  } else {
    GS.descQueue = shuffle([...GS.players.filter(p=>p.active)]);
    if (S.imposterGoesLast && GS.descQueue.length > 1) {
      if (GS.descQueue[0].role === 'imposter') {
        const civIdx = GS.descQueue.findIndex(p => p.role !== 'imposter');
        if (civIdx > -1) {
          [GS.descQueue[0], GS.descQueue[civIdx]] = [GS.descQueue[civIdx], GS.descQueue[0]];
        }
      }
    }
    GS.descIdx = 0;
    renderDescQueue();
    setupDescriber();
    showScreen('screen-describe');
  }
}

function renderDescQueue() {
  const ul = document.getElementById('desc-queue');
  ul.innerHTML = '';
  GS.descQueue.forEach((p,i) => {
    const li = document.createElement('div');
    li.className = 'queue-item' + (i===GS.descIdx?' active':i<GS.descIdx?' done':'');
    const status = i < GS.descIdx ? 'Done ✓' : i===GS.descIdx ? 'Speaking…' : 'Waiting';
    li.innerHTML = `<div class="q-avatar" style="background:${p.color}">${p.emoji}</div>
      <span class="q-name">${esc(p.name)}</span>
      <span class="q-status">${status}</span>`;
    ul.appendChild(li);
  });
}

function setupDescriber() {
  const p = GS.descQueue[GS.descIdx];
  setEl('desc-avatar', p.emoji);
  setStyle('desc-avatar','background', p.color);
  setEl('desc-name', p.name);
  setEl('desc-progress', `${GS.descIdx+1} / ${GS.descQueue.length}`);
  
  const isMe = (!GS.isHost && p.id === GS.myPlayerId) || (GS.isHost && !p.isRemote);
  const nextBtn = document.querySelector('.screen-describe .btn-cyan');
  
  if (GS.isOnline) {
    if (isMe || GS.isHost) {
      document.getElementById('timer-btn').style.display = 'block';
      if (nextBtn) nextBtn.style.display = 'block';
    } else {
      document.getElementById('timer-btn').style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
    }
  } else {
    document.getElementById('timer-btn').style.display = 'block';
    if (nextBtn) nextBtn.style.display = 'block';
  }

  resetTimer();
}

function resetTimer() {
  clearInterval(GS.timerHandle);
  GS.timerActive = false;
  GS.timerSecs   = S.timerDuration;
  drawTimer();
  const btn = document.getElementById('timer-btn');
  btn.textContent = 'Start Timer';
  btn.className   = 'btn btn-primary';
  document.getElementById('timer-ring-wrap').classList.remove('warning');
}

function drawTimer() {
  setEl('timer-val', GS.timerSecs);
  const ring = document.getElementById('timer-ring');
  const circ = 2 * Math.PI * 50;
  ring.style.strokeDasharray  = circ;
  ring.style.strokeDashoffset = circ * (1 - GS.timerSecs / S.timerDuration);
}

function toggleTimer() {
  playSound('click');
  const btn  = document.getElementById('timer-btn');
  const wrap = document.getElementById('timer-ring-wrap');
  
  if (GS.timerActive) {
    clearInterval(GS.timerHandle);
    GS.timerActive = false;
    btn.textContent = 'Resume'; btn.className = 'btn btn-secondary';
  } else {
    GS.timerActive = true;
    btn.textContent = 'Pause'; btn.className = 'btn btn-secondary';
    GS.timerHandle = setInterval(() => {
      GS.timerSecs--;
      drawTimer();
      const threshold = Math.ceil(S.timerDuration * 0.25);
      if (GS.timerSecs <= threshold) { playSound('tick'); wrap.classList.add('warning'); }
      if (GS.timerSecs <= 0) {
        clearInterval(GS.timerHandle); GS.timerActive = false;
        playSound('gong'); btn.textContent="Time's Up!"; btn.className='btn btn-accent';
      }
    }, 1000);
  }

  if (GS.isOnline) {
    syncState('timer_toggle', { active: GS.timerActive, secs: GS.timerSecs });
  }
}

function nextDescriber() {
  playSound('click');
  clearInterval(GS.timerHandle);
  GS.descIdx++;

  if (GS.isOnline) {
    syncState('describe_next', { descIdx: GS.descIdx });
  }

  if (GS.descIdx < GS.descQueue.length) {
    renderDescQueue(); setupDescriber();
  } else {
    if (!GS.isOnline || GS.isHost) {
      startVotePhase();
    }
  }
}

// ── Vote phase ────────────────────────────────────────────────
function startVotePhase() {
  if (GS.isOnline && GS.isHost) {
    syncState('start_vote');
  }
  renderVoteGrid();
  showScreen('screen-vote');
}

function renderVoteGrid() {
  const g = document.getElementById('vote-grid');
  g.innerHTML = '';
  
  const isVoter = !GS.isOnline || GS.isHost;

  GS.players.forEach(p => {
    const card = document.createElement('div');
    card.className = 'vote-card' + (p.active?'':' eliminated');
    card.innerHTML = `<div class="vote-av" style="background:${p.color}">${p.emoji}</div>
      <span class="vote-nm">${esc(p.name)}</span>
      ${!p.active?'<span class="elim-badge">Out</span>':''}`;
    
    if (p.active && isVoter) {
      card.onclick = () => confirmVote(p);
    }
    g.appendChild(card);
  });
}

function confirmVote(player) {
  playSound('click');
  GS.eliminatedPlayer = player;
  setEl('vote-modal-name', player.name);
  document.getElementById('vote-confirm-modal').classList.add('active');
}

function closeModal(id) {
  playSound('click');
  document.getElementById(id).classList.remove('active');
}

function doEliminate() {
  const p = GS.eliminatedPlayer;
  p.active = false;
  closeModal('vote-confirm-modal');
  playSound('gong');
  
  if (GS.isOnline && GS.isHost) {
    syncState('player_eliminated', { playerId: p.id });
  }

  const who = p.role==='imposter'
    ? (GS.mode==='classic' ? 'the Imposter!' : 'the Liar!')
    : (GS.mode==='classic' ? `a Civilian (word: ${GS.word})` : 'a Normal Citizen');
  notify(`${p.name} was ${who}`);
  
  checkEnd();
}

function checkEnd() {
  const active  = GS.players.filter(p=>p.active);
  const imps    = active.filter(p=>p.role==='imposter');
  const civs    = active.filter(p=>p.role==='civilian');

  if (imps.length === 0) {
    if (GS.mode === 'classic') {
      if (GS.isOnline) {
        syncState('show_guess_screen');
      }
      showGuessScreen();
    } else {
      triggerGameOver('civilians');
    }
    return;
  }
  if (imps.length >= civs.length) { 
    triggerGameOver('imposters'); 
    return; 
  }

  if (GS.isOnline && GS.isHost) {
    syncState('start_vote');
  }
  renderVoteGrid();
  setTimeout(() => startDescribePhase(), 1500);
}

// ── Imposter guess ────────────────────────────────────────────
function showGuessScreen() {
  document.getElementById('guess-input').value = '';
  const elim = GS.players.filter(p=>!p.active && p.role==='imposter');
  const name = elim.length ? elim[elim.length-1].name : 'The Imposter';
  setEl('guesser-name', name);
  
  const isMe = GS.players.some(p => p.id === GS.myPlayerId && p.role === 'imposter');
  const subBtn = document.querySelector('.guess-card .btn-accent');
  const guessInp = document.getElementById('guess-input');
  
  if (GS.isOnline) {
    if (isMe) {
      if(subBtn) subBtn.style.display = 'block';
      if(guessInp) guessInp.removeAttribute('disabled');
    } else {
      if(subBtn) subBtn.style.display = 'none';
      if(guessInp) {
        guessInp.setAttribute('disabled', 'true');
        guessInp.placeholder = `Waiting for ${name} to guess…`;
      }
    }
  } else {
    if(subBtn) subBtn.style.display = 'block';
    if(guessInp) {
      guessInp.removeAttribute('disabled');
      guessInp.placeholder = 'Type your guess…';
    }
  }

  showScreen('screen-guess');
}

function submitGuess() {
  const g = (document.getElementById('guess-input').value||'').trim().toLowerCase();
  if (!g) { notify('Type a guess!'); return; }
  playSound('click');

  if (GS.isOnline) {
    syncState('imposter_guess', { guess: g });
  } else {
    evaluateImposterGuess(g);
  }
}

function evaluateImposterGuess(guess) {
  const a = GS.word.toLowerCase();
  const correct = guess === a || (a.includes(guess) && guess.length > 2);
  
  if (correct) {
    playSound('fail'); notify(`Correct! The word was "${GS.word}". Imposter steals the win!`);
    triggerGameOver('imposters');
  } else {
    playSound('win'); notify(`Wrong! The word was "${GS.word}". Civilians win!`);
    triggerGameOver('civilians');
  }
}

function triggerGameOver(winner) {
  if (GS.isOnline && GS.isHost) {
    syncState('game_over', { winner: winner });
  }
  endGame(winner);
}

// ── Game over ─────────────────────────────────────────────────
function endGame(winner) {
  const banner = document.getElementById('go-banner');
  banner.className = 'winner-banner';
  if (winner === 'civilians') {
    playSound('win');
    banner.textContent = GS.mode==='classic' ? '🎉 Civilians Win!' : '🎉 Citizens Win!';
    banner.classList.add('civilians-win');
  } else {
    playSound('fail');
    banner.textContent = GS.mode==='classic' ? '😈 Imposter Wins!' : '🤥 The Liar Wins!';
    banner.classList.add('imposters-win');
  }

  const box = document.getElementById('go-word-reveal');
  if (GS.mode === 'classic') {
    box.innerHTML = `<div class="wr-label">The Secret Word Was</div>
      <div class="wr-word">${esc(GS.word)}</div>`;
  } else {
    box.innerHTML = `<div class="wr-label">Questions Revealed</div>
      <div class="wr-qs">
        <span class="wr-role" style="color:var(--blue)">Citizens: "${esc(GS.normalQ)}"</span>
        <span class="wr-role" style="color:var(--magenta)">Liar: "${esc(GS.liarQ)}"</span>
      </div>`;
  }

  const ul = document.getElementById('go-summary');
  ul.innerHTML = '';
  GS.players.forEach(p => {
    const li = document.createElement('div');
    li.className = 'summary-item';
    const isImp = p.role==='imposter';
    const tag   = isImp ? 'tag-imposter' : 'tag-civilian';
    const role  = isImp ? (GS.mode==='classic'?'Imposter':'Liar') : (GS.mode==='classic'?'Civilian':'Citizen');
    li.innerHTML = `
      <div class="sum-info">
        <div class="sum-av" style="background:${p.color}">${p.emoji}</div>
        <div class="sum-text">
          <span class="sum-name">${esc(p.name)}</span>
          <span class="sum-fate">${p.active?'Survived':'Eliminated'}</span>
        </div>
      </div>
      <span class="summary-role-tag ${tag}">${role}</span>`;
    ul.appendChild(li);
  });

  const playAgainBtn = document.querySelector('.go-btns button:first-child');
  const changeCatBtn = document.querySelector('.go-btns button:nth-child(2)');
  const mainMenuBtn = document.querySelector('.go-btns button:last-child');
  
  if (GS.isOnline) {
    if (GS.isHost) {
      if (playAgainBtn) playAgainBtn.style.display = 'block';
      if (changeCatBtn) changeCatBtn.style.display = 'block';
      if (mainMenuBtn) mainMenuBtn.textContent = '🏠 Close Room & Exit';
    } else {
      if (playAgainBtn) playAgainBtn.style.display = 'none';
      if (changeCatBtn) changeCatBtn.style.display = 'none';
      if (mainMenuBtn) mainMenuBtn.textContent = '🏠 Leave Lobby';
    }
  } else {
    if (playAgainBtn) playAgainBtn.style.display = 'block';
    if (changeCatBtn) changeCatBtn.style.display = 'block';
    if (mainMenuBtn) mainMenuBtn.textContent = '🏠 Main Menu';
  }

  showScreen('screen-gameover');
}

// ── Modals ────────────────────────────────────────────────────
function toggleRules() {
  playSound('click');
  document.getElementById('rules-modal').classList.toggle('active');
}

// ── Utilities ─────────────────────────────────────────────────
function shuffle(a) {
  for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function esc(s) {
  const d=document.createElement('div');
  d.appendChild(document.createTextNode(s||''));
  return d.innerHTML;
}
function setEl(id, v)      { const e=document.getElementById(id); if(e) e.textContent=v; }
function setStyle(id,k,v)  { const e=document.getElementById(id); if(e) e.style[k]=v; }

window.onload = initApp;
