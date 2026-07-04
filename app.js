// Imposter Game logic engine

// Audio synthesis system using Web Audio API
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

const sounds = {
  click: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) { console.log("Audio error", e); }
  },
  flip: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) { console.log("Audio error", e); }
  },
  gong: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.55);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch (e) { console.log("Audio error", e); }
  },
  win: () => {
    try {
      const ctx = getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const timeOffset = index * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + timeOffset);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + timeOffset + 0.25);
        osc.start(ctx.currentTime + timeOffset);
        osc.stop(ctx.currentTime + timeOffset + 0.25);
      });
    } catch (e) { console.log("Audio error", e); }
  },
  fail: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(55, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) { console.log("Audio error", e); }
  },
  tick: () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) { console.log("Audio error", e); }
  }
};

function playSound(type) {
  if (sounds[type]) sounds[type]();
}

// Color and emoji palette for player avatars
const AVATAR_COLORS = [
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#a855f7', // Light Purple
  '#14b8a6'  // Teal
];

const AVATAR_EMOJIS = ['🐱', '🐶', '🦊', '🐻', '🐼', '🐨', '🦁', '🐸', '🐵', '🐣'];

// Game State Object
const gameState = {
  mode: 'classic', // 'classic' or 'liar'
  players: [],
  impostersCount: 1,
  selectedCategory: null,
  
  // Active game run details
  civilianWord: '',
  undercoverWord: '',
  normalQuestion: '',
  liarQuestion: '',
  revealIndex: 0,
  describeQueue: [],
  describeIndex: 0,
  timerSeconds: 30,
  timerActive: false,
  timerInterval: null,
  eliminatedPlayer: null, // Player being voted out

  // Custom data from localStorage
  customWords: [],
  customQuestions: []
};

// Initialization
function initApp() {
  // Load players
  const savedPlayers = localStorage.getItem('imposter_players');
  if (savedPlayers) {
    gameState.players = JSON.parse(savedPlayers);
  } else {
    // Default initial players
    gameState.players = [
      { id: 1, name: 'Alice', color: AVATAR_COLORS[0], emoji: AVATAR_EMOJIS[0], active: true },
      { id: 2, name: 'Bob', color: AVATAR_COLORS[1], emoji: AVATAR_EMOJIS[1], active: true },
      { id: 3, name: 'Charlie', color: AVATAR_COLORS[2], emoji: AVATAR_EMOJIS[2], active: true },
      { id: 4, name: 'Daisy', color: AVATAR_COLORS[3], emoji: AVATAR_EMOJIS[3], active: true }
    ];
  }
  
  // Load custom words/questions
  const savedCustomWords = localStorage.getItem('imposter_custom_words');
  if (savedCustomWords) gameState.customWords = JSON.parse(savedCustomWords);
  
  const savedCustomQuestions = localStorage.getItem('imposter_custom_questions');
  if (savedCustomQuestions) gameState.customQuestions = JSON.parse(savedCustomQuestions);

  updatePlayersList();
  renderCategoriesGrid();
  renderCustomPacksInfo();
  showScreen('screen-home');
}

// Navigation Helper
function showScreen(screenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => {
    s.classList.remove('active');
  });
  
  const target = document.getElementById(screenId);
  if (target) {
    target.style.display = 'flex';
    setTimeout(() => {
      target.classList.add('active');
    }, 10);
  }
}

// Alert Notification
function notify(message) {
  const notif = document.getElementById('notification-banner');
  notif.textContent = message;
  notif.classList.add('active');
  setTimeout(() => {
    notif.classList.remove('active');
  }, 3000);
}

// Setup Screen Methods
function savePlayersToStorage() {
  localStorage.setItem('imposter_players', JSON.stringify(gameState.players));
}

function updatePlayersList() {
  const container = document.getElementById('players-list');
  container.innerHTML = '';
  
  gameState.players.forEach(p => {
    const el = document.createElement('div');
    el.className = 'player-tag';
    el.innerHTML = `
      <div class="player-info-tag">
        <div class="player-avatar-dot" style="background-color: ${p.color}">
          ${p.emoji}
        </div>
        <span class="player-name-lbl">${escapeHtml(p.name)}</span>
      </div>
      <button class="remove-player-btn" onclick="removePlayer(${p.id})">✕</button>
    `;
    container.appendChild(el);
  });

  // Automatically update max roles configurations
  validateConfigCounters();
}

function addPlayer() {
  const input = document.getElementById('new-player-name');
  const name = input.value.trim();
  if (!name) return;
  
  if (gameState.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    notify("That player name already exists!");
    return;
  }
  
  if (gameState.players.length >= 12) {
    notify("Maximum of 12 players reached!");
    return;
  }

  playSound('click');
  const colorIndex = gameState.players.length % AVATAR_COLORS.length;
  const emojiIndex = gameState.players.length % AVATAR_EMOJIS.length;

  const newPlayer = {
    id: Date.now(),
    name: name,
    color: AVATAR_COLORS[colorIndex],
    emoji: AVATAR_EMOJIS[emojiIndex],
    active: true
  };

  gameState.players.push(newPlayer);
  savePlayersToStorage();
  updatePlayersList();
  input.value = '';
}

function removePlayer(id) {
  if (gameState.players.length <= 3) {
    notify("You need at least 3 players to play!");
    return;
  }
  playSound('click');
  gameState.players = gameState.players.filter(p => p.id !== id);
  savePlayersToStorage();
  updatePlayersList();
}

function adjustCounter(type, change) {
  playSound('click');
  if (type === 'imposter') {
    gameState.impostersCount = Math.max(1, Math.min(3, gameState.impostersCount + change));
  }
  validateConfigCounters();
}

function validateConfigCounters() {
  const total = gameState.players.length;

  // Imposters must never leave 0 non-imposters
  while (gameState.impostersCount >= total) {
    gameState.impostersCount = Math.max(1, gameState.impostersCount - 1);
  }

  document.getElementById('imposter-count-val').textContent = gameState.impostersCount;

  if (gameState.mode === 'liar') {
    document.getElementById('imposter-label-main').textContent = 'Liar Count';
    document.getElementById('imposter-label-sub').textContent = 'Players with a different question';
  } else {
    document.getElementById('imposter-label-main').textContent = 'Imposter Count';
    document.getElementById('imposter-label-sub').textContent = 'Players with no word';
  }
}

// Category Selection Grid rendering
function renderCategoriesGrid() {
  const grid = document.getElementById('categories-grid');
  grid.innerHTML = '';

  const activeDb = gameState.mode === 'classic' ? IMPOSTER_WORDS : IMPOSTER_QUESTIONS;

  for (let key in activeDb) {
    const cat = activeDb[key];
    const card = document.createElement('div');
    card.className = 'category-card';
    card.id = `cat-${key}`;
    card.onclick = () => selectCategory(key);
    card.innerHTML = `
      <span class="category-emoji">${cat.icon}</span>
      <span class="category-title">${cat.name}</span>
      <span class="category-count">${cat.pairs.length} words</span>
    `;
    grid.appendChild(card);
  }

  // Custom Category Card
  const customCard = document.createElement('div');
  customCard.className = 'category-card';
  customCard.id = 'cat-custom';
  customCard.onclick = () => selectCategory('custom');
  const customCount = gameState.mode === 'classic' ? gameState.customWords.length : gameState.customQuestions.length;
  customCard.innerHTML = `
    <span class="category-emoji">✨</span>
    <span class="category-title">Custom Pack</span>
    <span class="category-count">${customCount} cards</span>
  `;
  grid.appendChild(customCard);
}

function selectCategory(key) {
  playSound('click');
  gameState.selectedCategory = key;
  
  const cards = document.querySelectorAll('.category-card');
  cards.forEach(c => c.classList.remove('selected'));
  
  const selected = document.getElementById(`cat-${key}`);
  if (selected) selected.classList.add('selected');
}

function startCategoryPhase() {
  playSound('click');
  gameState.selectedCategory = null;
  renderCategoriesGrid();
  
  // Show / hide appropriate custom pack entry boxes
  if (gameState.mode === 'classic') {
    document.getElementById('custom-word-entry').style.display = 'block';
    document.getElementById('custom-question-entry').style.display = 'none';
  } else {
    document.getElementById('custom-word-entry').style.display = 'none';
    document.getElementById('custom-question-entry').style.display = 'block';
  }

  showScreen('screen-categories');
}

// Add Custom Words or Questions
function renderCustomPacksInfo() {
  document.getElementById('custom-words-list-count').textContent = `${gameState.customWords.length} custom words loaded.`;
  document.getElementById('custom-questions-list-count').textContent = `${gameState.customQuestions.length} custom questions loaded.`;
}

function addCustomWordPair() {
  const wordInput = document.getElementById('custom-civ-word');
  const word = wordInput.value.trim();
  if (!word) {
    notify("Please enter a word!");
    return;
  }
  playSound('click');
  gameState.customWords.push(word);
  localStorage.setItem('imposter_custom_words', JSON.stringify(gameState.customWords));
  wordInput.value = '';
  renderCustomPacksInfo();
  renderCategoriesGrid();
  selectCategory('custom');
  notify(`"${word}" added to custom pack!`);
}

function addCustomQuestionPair() {
  const normInput = document.getElementById('custom-normal-q');
  const liarInput = document.getElementById('custom-liar-q');
  const norm = normInput.value.trim();
  const liar = liarInput.value.trim();
  
  if (!norm || !liar) {
    notify("Please fill in both questions!");
    return;
  }
  playSound('click');
  gameState.customQuestions.push({ normal: norm, liar: liar });
  localStorage.setItem('imposter_custom_questions', JSON.stringify(gameState.customQuestions));
  normInput.value = '';
  liarInput.value = '';
  renderCustomPacksInfo();
  renderCategoriesGrid();
  selectCategory('custom');
  notify("Custom question pair added!");
}

function clearCustomPacks() {
  playSound('gong');
  if (gameState.mode === 'classic') {
    gameState.customWords = [];
    localStorage.removeItem('imposter_custom_words');
  } else {
    gameState.customQuestions = [];
    localStorage.removeItem('imposter_custom_questions');
  }
  renderCustomPacksInfo();
  renderCategoriesGrid();
  notify("Custom pack cleared!");
}

// Game Setup and Start Round
function setupGameRound() {
  if (!gameState.selectedCategory) {
    notify("Please select a category first!");
    return;
  }
  
  const category = gameState.selectedCategory;
  let wordPairSelected = null;
  
  if (gameState.mode === 'classic') {
    let sourcePool = [];
    if (category === 'custom') {
      sourcePool = gameState.customWords;
    } else {
      // Each pair has a .civilian word — just use that
      sourcePool = IMPOSTER_WORDS[category].pairs.map(p => p.civilian);
    }

    if (sourcePool.length === 0) {
      notify("This category has no words! Please add some custom ones.");
      return;
    }

    const randIndex = Math.floor(Math.random() * sourcePool.length);
    gameState.civilianWord = typeof sourcePool[randIndex] === 'string'
      ? sourcePool[randIndex]
      : sourcePool[randIndex].civilian;
  } else {
    // Liar Mode
    let sourcePool = [];
    if (category === 'custom') {
      sourcePool = gameState.customQuestions;
    } else {
      sourcePool = IMPOSTER_QUESTIONS[category].pairs;
    }
    
    if (sourcePool.length === 0) {
      notify("This category has no questions! Please add some custom ones.");
      return;
    }
    
    const randIndex = Math.floor(Math.random() * sourcePool.length);
    wordPairSelected = sourcePool[randIndex];
    gameState.normalQuestion = wordPairSelected.normal;
    gameState.liarQuestion = wordPairSelected.liar;
  }

  playSound('click');

  // Allocate roles — everyone starts as civilian with the word
  gameState.players.forEach(p => {
    p.active = true;
    p.role = 'civilian';
    p.word = gameState.mode === 'classic' ? gameState.civilianWord : gameState.normalQuestion;
  });

  // Shuffle player indices and assign imposters/liars
  const shuffledIndices = Array.from({ length: gameState.players.length }, (_, i) => i);
  shuffleArray(shuffledIndices);

  for (let i = 0; i < gameState.impostersCount; i++) {
    const idx = shuffledIndices.pop();
    gameState.players[idx].role = 'imposter';
    gameState.players[idx].word = gameState.mode === 'classic' ? 'IMPOSTER' : gameState.liarQuestion;
  }

  // Start Reveal Sequence
  gameState.revealIndex = 0;
  startRevealIntro();
}

function startRevealIntro() {
  const activePlayer = gameState.players[gameState.revealIndex];
  
  document.getElementById('reveal-intro-avatar').textContent = activePlayer.emoji;
  document.getElementById('reveal-intro-avatar').style.backgroundColor = activePlayer.color;
  document.getElementById('reveal-intro-name').textContent = activePlayer.name;
  
  showScreen('screen-reveal-intro');
}

function openRevealCard() {
  playSound('click');
  const activePlayer = gameState.players[gameState.revealIndex];
  
  // Set card contents
  const cardFront = document.getElementById('reveal-card-front');
  cardFront.className = 'card-side card-front'; // Reset classes
  
  // Set player badge
  document.getElementById('reveal-card-player-avatar').textContent = activePlayer.emoji;
  document.getElementById('reveal-card-player-avatar').style.backgroundColor = activePlayer.color;
  document.getElementById('reveal-card-player-name').textContent = activePlayer.name;
  
  const label = document.getElementById('reveal-role-label');
  const secretDisplay = document.getElementById('reveal-secret-display');
  
  if (gameState.mode === 'classic') {
    if (activePlayer.role === 'civilian') {
      cardFront.classList.add('role-civilian');
      label.textContent = '✅ You know the word';
      secretDisplay.innerHTML = `<span style="font-size: 1rem; color: #a39eb9; font-weight: 500;">Secret word:</span><br>${activePlayer.word}`;
    } else {
      cardFront.classList.add('role-imposter');
      label.textContent = '🔴 You are the Imposter';
      secretDisplay.innerHTML = `<span style="font-size: 1rem; color: #ff007f; font-weight: 600;">You have NO word.<br>Blend in and bluff!</span>`;
    }
  } else {
    // Find the Liar Mode
    if (activePlayer.role === 'civilian') {
      cardFront.classList.add('role-civilian');
      label.textContent = 'You are a Normal Citizen';
      secretDisplay.innerHTML = `<span style="font-size: 0.9rem; color: #a39eb9; font-weight: 500; display: block; margin-bottom: 8px;">Answer this question:</span><div class="liar-question-box">"${activePlayer.word}"</div>`;
    } else {
      cardFront.classList.add('role-imposter');
      label.textContent = 'You are the Liar!';
      secretDisplay.innerHTML = `<span style="font-size: 0.9rem; color: #ff007f; font-weight: 700; display: block; margin-bottom: 8px;">Answer this question:</span><div class="liar-question-box">"${activePlayer.word}"</div>`;
    }
  }

  // Ensure card is not flipped initially
  const card = document.getElementById('reveal-card-container');
  card.classList.remove('flipped');

  showScreen('screen-reveal-card');
}

function handleCardClick() {
  const card = document.getElementById('reveal-card-container');
  if (!card.classList.contains('flipped')) {
    playSound('flip');
    card.classList.add('flipped');
  }
}

function nextPlayerReveal() {
  playSound('click');
  gameState.revealIndex++;
  if (gameState.revealIndex < gameState.players.length) {
    startRevealIntro();
  } else {
    startDescriptionPhase();
  }
}

// Description / Turn taking Phase
function startDescriptionPhase() {
  // Select active players and randomize their speaking order
  gameState.describeQueue = gameState.players.filter(p => p.active);
  shuffleArray(gameState.describeQueue);
  gameState.describeIndex = 0;
  
  renderDescriptionQueue();
  setupActiveDescriber();
  showScreen('screen-describe');
}

function renderDescriptionQueue() {
  const container = document.getElementById('description-queue');
  container.innerHTML = '';
  
  gameState.describeQueue.forEach((p, idx) => {
    const el = document.createElement('div');
    el.className = 'queue-item';
    if (idx === gameState.describeIndex) el.classList.add('active');
    if (idx < gameState.describeIndex) el.classList.add('done');
    
    let statusText = 'Waiting';
    if (idx === gameState.describeIndex) statusText = 'Describing';
    if (idx < gameState.describeIndex) statusText = 'Done';

    el.innerHTML = `
      <div class="queue-avatar" style="background-color: ${p.color}">${p.emoji}</div>
      <span class="queue-name">${escapeHtml(p.name)}</span>
      <span class="queue-status">${statusText}</span>
    `;
    container.appendChild(el);
  });
}

function setupActiveDescriber() {
  const activePlayer = gameState.describeQueue[gameState.describeIndex];
  
  document.getElementById('active-desc-avatar').textContent = activePlayer.emoji;
  document.getElementById('active-desc-avatar').style.backgroundColor = activePlayer.color;
  document.getElementById('active-desc-name').textContent = activePlayer.name;
  
  // Timer setup
  resetTimer();
}

function resetTimer() {
  clearInterval(gameState.timerInterval);
  gameState.timerActive = false;
  gameState.timerSeconds = 30;
  updateTimerUI();
  
  const timerBtn = document.getElementById('timer-control-btn');
  timerBtn.textContent = "Start Timer";
  timerBtn.className = "btn btn-primary";
  document.getElementById('active-desc-banner').classList.remove('warning');
}

function updateTimerUI() {
  document.getElementById('timer-val-text').textContent = gameState.timerSeconds;
  
  // Draw SVG circle dash
  const circle = document.getElementById('timer-ring');
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = circumference;
  
  const progress = gameState.timerSeconds / 30;
  circle.style.strokeDashoffset = circumference * (1 - progress);
}

function toggleTimer() {
  playSound('click');
  const timerBtn = document.getElementById('timer-control-btn');
  const banner = document.getElementById('active-desc-banner');
  
  if (gameState.timerActive) {
    // Pause
    clearInterval(gameState.timerInterval);
    gameState.timerActive = false;
    timerBtn.textContent = "Resume Timer";
    timerBtn.className = "btn btn-primary";
  } else {
    // Start
    gameState.timerActive = true;
    timerBtn.textContent = "Pause Timer";
    timerBtn.className = "btn btn-secondary";
    
    gameState.timerInterval = setInterval(() => {
      gameState.timerSeconds--;
      updateTimerUI();
      
      if (gameState.timerSeconds <= 5) {
        playSound('tick');
        banner.classList.add('warning');
      }
      
      if (gameState.timerSeconds <= 0) {
        clearInterval(gameState.timerInterval);
        gameState.timerActive = false;
        playSound('gong');
        timerBtn.textContent = "Time's Up!";
        timerBtn.className = "btn btn-accent";
      }
    }, 1000);
  }
}

function nextDescriber() {
  playSound('click');
  clearInterval(gameState.timerInterval);
  
  gameState.describeIndex++;
  if (gameState.describeIndex < gameState.describeQueue.length) {
    renderDescriptionQueue();
    setupActiveDescriber();
  } else {
    // All players done, proceed to voting
    startVotingPhase();
  }
}

// Voting Phase
function startVotingPhase() {
  renderVotingGrid();
  showScreen('screen-vote');
}

function renderVotingGrid() {
  const grid = document.getElementById('voting-grid');
  grid.innerHTML = '';
  
  gameState.players.forEach(p => {
    const card = document.createElement('div');
    card.className = 'vote-card';
    if (!p.active) card.classList.add('eliminated');
    
    card.innerHTML = `
      <div class="vote-avatar" style="background-color: ${p.color}">${p.emoji}</div>
      <span class="vote-name">${escapeHtml(p.name)}</span>
      ${!p.active ? `<span class="eliminated-badge">Eliminated</span>` : ''}
    `;
    
    if (p.active) {
      card.onclick = () => confirmElimination(p);
    }
    
    grid.appendChild(card);
  });
}

function confirmElimination(player) {
  playSound('click');
  gameState.eliminatedPlayer = player;
  document.getElementById('vote-modal-name').textContent = player.name;
  document.getElementById('vote-confirm-modal').classList.add('active');
}

function closeModal(modalId) {
  playSound('click');
  document.getElementById(modalId).classList.remove('active');
}

function executeElimination() {
  const p = gameState.eliminatedPlayer;
  p.active = false;
  
  closeModal('vote-confirm-modal');
  playSound('gong');
  
  // Reveal their role in notification
  let roleText = '';
  if (gameState.mode === 'classic') {
    roleText = p.role === 'imposter' ? 'the Imposter!' : `a Civilian (word: ${gameState.civilianWord})`;
  } else {
    roleText = p.role === 'imposter' ? 'the Liar!' : 'a Normal Citizen';
  }
  
  notify(`${p.name} was voted out and was ${roleText}!`);
  
  // Check win conditions
  checkGameEndConditions();
}

function checkGameEndConditions() {
  const activePlayers = gameState.players.filter(p => p.active);
  const activeImposters = activePlayers.filter(p => p.role === 'imposter');
  const activeCivilians = activePlayers.filter(p => p.role === 'civilian');

  if (gameState.mode === 'classic') {
    if (activeImposters.length === 0) {
      // All imposters caught — they get a last-chance guess!
      startImposterGuessPhase();
      return;
    }
    if (activeImposters.length >= activeCivilians.length) {
      triggerGameOver('imposters');
      return;
    }
  } else {
    if (activeImposters.length === 0) {
      triggerGameOver('civilians');
      return;
    }
    if (activeImposters.length >= activeCivilians.length) {
      triggerGameOver('imposters');
      return;
    }
  }

  // Game continues
  renderVotingGrid();
  setTimeout(() => { startDescriptionPhase(); }, 1500);
}

// Imposter Word guessing phase
function startImposterGuessPhase() {
  document.getElementById('guess-word-input').value = '';
  showScreen('screen-guess');
}

function submitImposterGuess() {
  const guess = document.getElementById('guess-word-input').value.trim().toLowerCase();
  const actual = gameState.civilianWord.toLowerCase();
  
  playSound('click');
  
  if (!guess) {
    notify("Please type a word guess!");
    return;
  }

  // Basic string proximity matching (exact or very close)
  if (guess === actual || actual.includes(guess) && guess.length > 3) {
    playSound('fail');
    notify(`Correct guess! The secret word was indeed ${gameState.civilianWord}.`);
    triggerGameOver('imposters'); // Imposters steal the win!
  } else {
    playSound('win');
    notify(`Wrong guess! Voted Imposter guessed "${guess}" but it was "${gameState.civilianWord}".`);
    triggerGameOver('civilians');
  }
}

// Game Over Summary screen
function triggerGameOver(winner) {
  const banner = document.getElementById('gameover-winner-banner');
  banner.className = 'winner-banner';

  if (winner === 'civilians') {
    playSound('win');
    banner.textContent = gameState.mode === 'classic' ? '🎉 Civilians Win!' : '🎉 Citizens Win!';
    banner.classList.add('civilians-win');
  } else {
    playSound('fail');
    banner.textContent = gameState.mode === 'classic' ? '😈 Imposter Wins!' : '🤥 The Liar Wins!';
    banner.classList.add('imposters-win');
  }

  // Display revealed word/question
  const infoBox = document.getElementById('gameover-word-reveal');
  if (gameState.mode === 'classic') {
    infoBox.innerHTML = `
      <div class="word-reveal-label">The Secret Word Was</div>
      <div class="word-reveal-values" style="font-size:1.4rem">
        <span style="color: var(--cyan);">${gameState.civilianWord}</span>
      </div>
    `;
  } else {
    infoBox.innerHTML = `
      <div class="word-reveal-label">Questions Asked</div>
      <div class="word-reveal-values" style="font-size: 0.95rem; text-align: left; line-height: 1.4;">
        Citizens: <span style="color: var(--color-civilian); font-weight: 500;">"${gameState.normalQuestion}"</span><br>
        Liar: <span style="color: var(--color-imposter); font-weight: 500;">"${gameState.liarQuestion}"</span>
      </div>
    `;
  }

  // Render players summary list
  const container = document.getElementById('gameover-summary-list');
  container.innerHTML = '';
  
  gameState.players.forEach(p => {
    const el = document.createElement('div');
    el.className = 'summary-item';

    let roleText = gameState.mode === 'classic' ? 'Civilian' : 'Citizen';
    let roleClass = 'tag-civilian';
    if (p.role === 'imposter') {
      roleText = gameState.mode === 'classic' ? 'Imposter' : 'Liar';
      roleClass = 'tag-imposter';
    }
    
    el.innerHTML = `
      <div class="summary-player-info">
        <div class="summary-avatar" style="background-color: ${p.color}">${p.emoji}</div>
        <div class="summary-name-container">
          <span class="summary-name">${escapeHtml(p.name)}</span>
          <span class="summary-secret">${p.active ? 'Survived' : 'Eliminated'}</span>
        </div>
      </div>
      <span class="summary-role-tag ${roleClass}">${roleText}</span>
    `;
    container.appendChild(el);
  });

  showScreen('screen-gameover');
}

// Utilities
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Global Handlers
function toggleRulesModal() {
  playSound('click');
  document.getElementById('rules-modal').classList.toggle('active');
}

function setGameMode(mode) {
  playSound('click');
  gameState.mode = mode;
  validateConfigCounters();
  startCategoryPhase();
}

window.onload = initApp;
