// ===== Yummy Garden App =====

const STORAGE_KEY = 'yummy-garden-data';

const FLOWERS = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🌼', '💮', '🏵️'];
const FRUITS = ['🍓', '🫐', '🍇', '🥭', '🍌', '🍎', '🍑', '🍊', '🍋', '🍒'];
const BUTTERFLIES_EMOJI = ['🦋', '🦋', '🦋'];
const PLANT_TYPES = [...FLOWERS, ...FRUITS];
const CELEBRATION_EMOJIS = ['🌸', '🎉', '🦋', '🌈', '✨', '🌺', '💖', '🍓'];

const GREETINGS = {
  morning: ['Good morning, sunshine! ☀️', 'Rise and shine! 🌅', 'Morning bloom! 🌸'],
  afternoon: ['Good afternoon! 🌤️', 'Afternoon snack time? 🍓', 'Keep growing! 🌱'],
  evening: ['Good evening! 🌙', 'Evening garden time! 🌺', 'Wind down with a snack! 🫐'],
};

const MEAL_MILESTONES = [1, 3, 5, 10, 15, 25, 50, 75, 100];

const REMINDER_MESSAGES = [
  "Hey lovely, it's been a while! Your garden misses you 🌸",
  "Time for a little snack? Even something small helps your garden grow 🦋",
  "Your flowers are getting thirsty — feed them with a yummy bite! 🌺",
  "A little nourishment goes a long way 💖",
];

// ===== Achievements Definitions =====

const ACHIEVEMENTS = [
  // Eating consistency
  { id: 'first_bloom', name: 'First Bloom', emoji: '🌱', hint: 'Log your first meal', category: 'consistency', bg: '#FFF0F5', glow: 'rgba(255,107,157,0.2)' },
  { id: 'garden_starter', name: 'Garden Starter', emoji: '🌿', hint: 'Log 5 meals', category: 'consistency', bg: '#F0FFF0', glow: 'rgba(107,203,119,0.2)' },
  { id: 'budding_gardener', name: 'Budding Gardener', emoji: '🌷', hint: 'Log 15 meals', category: 'consistency', bg: '#FFF0F8', glow: 'rgba(247,131,172,0.2)' },
  { id: 'green_thumb', name: 'Green Thumb', emoji: '🌻', hint: 'Log 50 meals', category: 'consistency', bg: '#FFFFF0', glow: 'rgba(255,217,61,0.2)' },
  { id: 'master_gardener', name: 'Master Gardener', emoji: '👑', hint: 'Log 100 meals', category: 'consistency', bg: '#FFF8F0', glow: 'rgba(255,160,122,0.2)' },
  // Streak-based
  { id: 'sunshine_day', name: 'Sunshine Day', emoji: '☀️', hint: '1 day streak', category: 'streak', bg: '#FFFDE8', glow: 'rgba(255,217,61,0.2)' },
  { id: 'week_of_wellness', name: 'Week of Wellness', emoji: '🌈', hint: '7 day streak', category: 'streak', bg: '#F0F0FF', glow: 'rgba(177,151,252,0.2)' },
  { id: 'fortnight_flora', name: 'Fortnight Flora', emoji: '🌺', hint: '14 day streak', category: 'streak', bg: '#FFF0F5', glow: 'rgba(255,107,157,0.2)' },
  { id: 'monthly_bloom', name: 'Monthly Bloom', emoji: '💐', hint: '30 day streak', category: 'streak', bg: '#F8F0FF', glow: 'rgba(177,151,252,0.25)' },
  // Variety
  { id: 'rainbow_plate', name: 'Rainbow Plate', emoji: '🌈', hint: '5 different meals in one day', category: 'variety', bg: '#F0F8FF', glow: 'rgba(116,192,252,0.2)' },
  { id: 'early_bird', name: 'Early Bird', emoji: '🐦', hint: 'Log a meal before 9am', category: 'variety', bg: '#FFF8E8', glow: 'rgba(255,200,0,0.2)' },
  { id: 'night_owl', name: 'Night Owl Nourisher', emoji: '🦉', hint: 'Log a meal after 8pm', category: 'variety', bg: '#F0F0FF', glow: 'rgba(140,120,200,0.2)' },
];

const CONTEXTUAL_PROMPTS = {
  morning_no_meals: "Start your day with something nourishing! 🌅",
  afternoon_no_meals: "Don't forget to eat, beautiful! Your garden is waiting 🌷",
  evening_few_meals: "Still time to nurture yourself tonight 🌙",
};

// ===== Data Management =====

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return { meals: {}, gardenPlants: [], totalMeals: 0, achievements: {}, uniqueMealsPerDay: {} };
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

function getDateKey(date = new Date()) {
  return date.toISOString().split('T')[0];
}

function getTodayMeals(data) {
  const key = getDateKey();
  return data.meals[key] || [];
}

function getStreak(data) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getDateKey(d);
    if (data.meals[key] && data.meals[key].length > 0) {
      streak++;
    } else if (i > 0) {
      break;
    } else {
      break;
    }
  }
  return streak;
}

// ===== Rendering =====

function renderGreeting(data) {
  const hour = new Date().getHours();
  let period = 'morning';
  if (hour >= 12 && hour < 17) period = 'afternoon';
  else if (hour >= 17) period = 'evening';

  const todayMeals = data ? getTodayMeals(data) : [];
  let greeting = null;

  // Show contextual eating prompts when appropriate
  if (period === 'morning' && todayMeals.length === 0 && hour >= 7) {
    greeting = CONTEXTUAL_PROMPTS.morning_no_meals;
  } else if (period === 'afternoon' && todayMeals.length === 0) {
    greeting = CONTEXTUAL_PROMPTS.afternoon_no_meals;
  } else if (period === 'evening' && todayMeals.length <= 1) {
    greeting = CONTEXTUAL_PROMPTS.evening_few_meals;
  }

  if (!greeting) {
    const greetings = GREETINGS[period];
    greeting = greetings[Math.floor(Math.random() * greetings.length)];
  }

  document.getElementById('greeting').textContent = greeting;
}

function renderStats(data) {
  const streak = getStreak(data);
  document.getElementById('streak-label').textContent =
    `🔥 ${streak} day${streak !== 1 ? 's' : ''} streak`;
  document.getElementById('total-meals').textContent =
    `🍽️ ${data.totalMeals} meal${data.totalMeals !== 1 ? 's' : ''} logged`;
}

function renderTodayMeals(data) {
  const list = document.getElementById('today-meals');
  const meals = getTodayMeals(data);

  if (meals.length === 0) {
    list.innerHTML = '<li class="empty-state">Nothing yet — let\'s eat something! 🌱</li>';
    return;
  }

  list.innerHTML = meals.map((meal, i) => {
    const icon = getMealIcon(meal.name);
    const time = new Date(meal.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    return `<li class="meal-item" style="animation-delay: ${i * 0.05}s">
      <span class="meal-icon">${icon}</span>
      <span>${escapeHtml(meal.name)}</span>
      <span class="meal-time">${time}</span>
    </li>`;
  }).join('');
}

function getMealIcon(name) {
  const lower = name.toLowerCase();
  const iconMap = [
    [['strawberry', 'strawberries', '🍓'], '🍓'],
    [['blueberry', 'blueberries', '🫐'], '🫐'],
    [['grape', 'grapes', '🍇'], '🍇'],
    [['mango', '🥭'], '🥭'],
    [['banana', '🍌'], '🍌'],
    [['apple', '🍎'], '🍎'],
    [['peach', '🍑'], '🍑'],
    [['orange', '🍊'], '🍊'],
    [['salad', '🥗'], '🥗'],
    [['soup', '🍜'], '🍜'],
    [['sandwich', '🥪'], '🥪'],
    [['rice', '🍚'], '🍚'],
    [['smoothie', '🥤'], '🥤'],
    [['pasta', 'noodle', '🍝'], '🍝'],
    [['pizza', '🍕'], '🍕'],
    [['egg', '🍳'], '🍳'],
    [['bread', 'toast', '🍞'], '🍞'],
    [['cookie', 'cookies', '🍪'], '🍪'],
    [['cake', '🎂'], '🎂'],
    [['coffee', '☕'], '☕'],
    [['tea', '🍵'], '🍵'],
    [['water', '💧'], '💧'],
    [['chicken', '🍗'], '🍗'],
    [['fish', 'sushi', '🍣'], '🍣'],
    [['taco', '🌮'], '🌮'],
    [['burger', '🍔'], '🍔'],
  ];

  for (const [keywords, icon] of iconMap) {
    if (keywords.some(k => lower.includes(k))) return icon;
  }
  return '🍽️';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== Achievements System =====

function ensureAchievementsData(data) {
  if (!data.achievements) data.achievements = {};
  if (!data.uniqueMealsPerDay) data.uniqueMealsPerDay = {};
  return data;
}

function checkAchievements(data) {
  ensureAchievementsData(data);
  const newlyUnlocked = [];
  const streak = getStreak(data);
  const todayKey = getDateKey();
  const todayMeals = data.meals[todayKey] || [];
  const hour = new Date().getHours();

  // Unique meals today
  const uniqueToday = data.uniqueMealsPerDay[todayKey] || [];

  function unlock(id) {
    if (!data.achievements[id]) {
      data.achievements[id] = { unlockedAt: new Date().toISOString() };
      newlyUnlocked.push(id);
    }
  }

  // Consistency badges
  if (data.totalMeals >= 1) unlock('first_bloom');
  if (data.totalMeals >= 5) unlock('garden_starter');
  if (data.totalMeals >= 15) unlock('budding_gardener');
  if (data.totalMeals >= 50) unlock('green_thumb');
  if (data.totalMeals >= 100) unlock('master_gardener');

  // Streak badges
  if (streak >= 1) unlock('sunshine_day');
  if (streak >= 7) unlock('week_of_wellness');
  if (streak >= 14) unlock('fortnight_flora');
  if (streak >= 30) unlock('monthly_bloom');

  // Variety badges
  if (uniqueToday.length >= 5) unlock('rainbow_plate');
  if (todayMeals.some(m => new Date(m.time).getHours() < 9)) unlock('early_bird');
  if (todayMeals.some(m => new Date(m.time).getHours() >= 20)) unlock('night_owl');

  return newlyUnlocked;
}

function renderAchievements(data, newlyUnlockedIds) {
  ensureAchievementsData(data);
  const grid = document.getElementById('badges-grid');
  if (!grid) return;

  const recentIds = newlyUnlockedIds || [];

  grid.innerHTML = ACHIEVEMENTS.map(badge => {
    const unlocked = data.achievements[badge.id];
    const isNew = recentIds.includes(badge.id);
    const cls = unlocked ? 'unlocked' : 'locked';
    const newCls = isNew ? ' newly-unlocked' : '';

    if (unlocked) {
      const date = new Date(unlocked.unlockedAt);
      const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      return `<div class="badge-item ${cls}${newCls}" style="--badge-bg: ${badge.bg}; --badge-glow: ${badge.glow}">
        <span class="badge-emoji">${badge.emoji}</span>
        <span class="badge-name">${badge.name}</span>
        <span class="badge-date">${dateStr}</span>
      </div>`;
    } else {
      return `<div class="badge-item ${cls}">
        <span class="badge-emoji">❓</span>
        <span class="badge-name">${badge.name}</span>
        <span class="badge-hint">${badge.hint}</span>
      </div>`;
    }
  }).join('');
}

function showAchievementCelebration(achievementId) {
  const badge = ACHIEVEMENTS.find(b => b.id === achievementId);
  if (!badge) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'achievement-celebration';
  overlay.innerHTML = `<div class="achievement-celebration-content">
    <span class="ach-emoji">${badge.emoji}</span>
    <span class="ach-label">Achievement Unlocked!</span>
    <span class="ach-name">${badge.name}</span>
  </div>`;
  document.getElementById('app').appendChild(overlay);

  spawnConfetti();

  setTimeout(() => overlay.remove(), 2500);
}

// ===== Garden Rendering =====

function renderGarden(data) {
  const plots = document.getElementById('garden-plots');
  const butterfliesEl = document.getElementById('butterflies');

  // Render plants
  plots.innerHTML = '';
  const plants = data.gardenPlants || [];

  plants.forEach((plant, i) => {
    const el = document.createElement('div');
    el.className = 'garden-plant';
    el.style.left = `${plant.x}%`;
    el.style.bottom = `${10 + plant.y}%`;
    el.style.animationDelay = `${i * 0.1}s`;
    el.style.zIndex = Math.floor(plant.y);

    const size = 0.8 + (plant.growth || 1) * 0.4;
    el.innerHTML = `
      <div class="plant-flower" style="font-size: ${size}rem; animation-delay: ${plant.swayOffset || 0}s">${plant.emoji}</div>
      <div class="plant-stem" style="height: ${20 + (plant.growth || 1) * 10}px"></div>
      <div class="plant-leaves">🌿</div>
    `;
    plots.appendChild(el);
  });

  // Render butterflies (1 per 3 meals, max 5)
  butterfliesEl.innerHTML = '';
  const numButterflies = Math.min(5, Math.floor(data.totalMeals / 3));

  for (let i = 0; i < numButterflies; i++) {
    const bf = document.createElement('div');
    bf.className = 'butterfly';
    bf.textContent = '🦋';
    bf.style.left = `${15 + (i * 18) % 70}%`;
    bf.style.top = `${10 + (i * 23) % 40}%`;
    bf.style.animationDelay = `${i * 2.5}s`;
    bf.style.animationDuration = `${10 + i * 2}s`;
    butterfliesEl.appendChild(bf);
  }

  // Update stats
  document.getElementById('flower-count').textContent = `🌸 ${plants.length} flower${plants.length !== 1 ? 's' : ''}`;
  document.getElementById('butterfly-count').textContent = `🦋 ${numButterflies} butterfl${numButterflies !== 1 ? 'ies' : 'y'}`;

  // Show rainbow after 5 meals
  const rainbow = document.getElementById('rainbow');
  if (data.totalMeals >= 5) {
    rainbow.classList.remove('hidden');
  }
}

// ===== Weekly View =====

function renderWeekly(data) {
  const grid = document.getElementById('weekly-grid');
  const today = new Date();
  const dayOfWeek = today.getDay();
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  let html = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - dayOfWeek + i);
    const key = getDateKey(d);
    const meals = data.meals[key] || [];
    const isToday = key === getDateKey();
    const isPast = d < today && !isToday;
    const isFuture = d > today;

    let icon = '🌑';
    let cls = 'no-meals';
    if (meals.length >= 3) {
      icon = '🌸';
      cls = 'has-meals';
    } else if (meals.length === 2) {
      icon = '🌷';
      cls = 'has-meals';
    } else if (meals.length === 1) {
      icon = '🌱';
      cls = 'has-meals';
    } else if (isFuture) {
      icon = '✨';
      cls = '';
    }

    html += `<div class="week-day ${cls} ${isToday ? 'today' : ''}">
      <span class="week-day-label">${days[i]}</span>
      <span class="week-day-icon">${icon}</span>
    </div>`;
  }

  grid.innerHTML = html;
}

// ===== Background Elements =====

function createBgElements() {
  const container = document.getElementById('bg-elements');
  const emojis = ['🌸', '🦋', '✨', '🌺', '💮', '🌷', '🫧', '💫'];

  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.className = 'bg-float';
    el.textContent = emojis[i % emojis.length];
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
    el.style.animationDelay = `${Math.random() * 20}s`;
    el.style.animationDuration = `${15 + Math.random() * 15}s`;
    container.appendChild(el);
  }
}

// ===== Celebrations =====

function celebrate(data) {
  const emoji = CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];
  const overlay = document.getElementById('celebration');
  const emojiEl = document.getElementById('celebration-emoji');
  const textEl = document.getElementById('celebration-text');

  emojiEl.textContent = emoji;

  // Check for milestones
  if (MEAL_MILESTONES.includes(data.totalMeals)) {
    textEl.textContent = `🎉 ${data.totalMeals} meals logged! Amazing!`;
  } else {
    const messages = [
      'Your garden grew! 🌱',
      'Yummy! Keep growing! 🌸',
      'Nom nom nom! 🍓',
      'Beautiful bloom! 🌺',
      'Garden magic! ✨',
      'Delicious choice! 🫐',
    ];
    textEl.textContent = messages[Math.floor(Math.random() * messages.length)];
  }

  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('hidden'), 1800);

  // Confetti
  spawnConfetti();
}

function spawnConfetti() {
  const confettiEmojis = ['🌸', '🦋', '✨', '🌺', '💖', '🍓', '🫐', '🌈', '💫', '🌷'];

  for (let i = 0; i < 15; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.textContent = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
    el.style.left = `${10 + Math.random() * 80}%`;
    el.style.top = `${-5 - Math.random() * 10}%`;
    el.style.animationDelay = `${Math.random() * 0.5}s`;
    el.style.animationDuration = `${1.5 + Math.random() * 1}s`;
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 3000);
  }
}

// ===== Add Meal =====

function addMeal(name) {
  const data = loadData();
  const key = getDateKey();

  if (!data.meals[key]) data.meals[key] = [];

  const meal = {
    name: name.trim(),
    time: new Date().toISOString(),
  };

  data.meals[key].push(meal);
  data.totalMeals = (data.totalMeals || 0) + 1;

  // Track unique meal names per day for Rainbow Plate badge
  if (!data.uniqueMealsPerDay) data.uniqueMealsPerDay = {};
  if (!data.uniqueMealsPerDay[key]) data.uniqueMealsPerDay[key] = [];
  const normalizedName = name.trim().toLowerCase();
  if (!data.uniqueMealsPerDay[key].includes(normalizedName)) {
    data.uniqueMealsPerDay[key].push(normalizedName);
  }

  // Add a new plant to the garden
  const plant = {
    emoji: PLANT_TYPES[Math.floor(Math.random() * PLANT_TYPES.length)],
    x: 5 + Math.random() * 85,
    y: Math.random() * 25,
    growth: 0.5 + Math.random() * 1.5,
    swayOffset: Math.random() * 3,
  };

  if (!data.gardenPlants) data.gardenPlants = [];

  // Keep garden manageable (max 30 plants, remove oldest)
  if (data.gardenPlants.length >= 30) {
    data.gardenPlants.shift();
  }
  data.gardenPlants.push(plant);

  saveData(data);
  return data;
}

// ===== Meal Reminder System =====

let reminderDismissed = false;

function checkMealReminder() {
  if (reminderDismissed) return;

  const data = loadData();
  const todayMeals = getTodayMeals(data);
  const reminderEl = document.getElementById('meal-reminder');
  const reminderText = document.getElementById('reminder-text');

  // If no meals today and it's past 9am, show a nudge
  const now = new Date();
  const hour = now.getHours();

  if (todayMeals.length === 0 && hour >= 9) {
    const message = REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
    reminderText.textContent = message;
    reminderEl.classList.remove('hidden');
    return;
  }

  // If there are meals, check if the last one was 3+ hours ago
  if (todayMeals.length > 0) {
    const lastMealTime = new Date(todayMeals[todayMeals.length - 1].time);
    const hoursSince = (now - lastMealTime) / (1000 * 60 * 60);

    if (hoursSince >= 3) {
      const message = REMINDER_MESSAGES[Math.floor(Math.random() * REMINDER_MESSAGES.length)];
      reminderText.textContent = message;
      reminderEl.classList.remove('hidden');
      return;
    }
  }

  // Otherwise hide it
  reminderEl.classList.add('hidden');
}

function dismissReminder() {
  reminderDismissed = true;
  document.getElementById('meal-reminder').classList.add('hidden');
}

// ===== Toast Notification System =====

function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===== Share Your Garden =====

const SHARE_MILESTONES = [10, 25, 50, 100];

function getMotivationalMessage(totalMeals) {
  if (totalMeals >= 100) return 'A legendary garden keeper! 👑';
  if (totalMeals >= 50) return 'My garden is thriving beautifully! 🌈';
  if (totalMeals >= 25) return 'Growing stronger every day! 🌻';
  if (totalMeals >= 10) return 'Watch my garden bloom! 🌷';
  if (totalMeals >= 5) return 'My garden is coming to life! 🌱';
  return 'Just started my garden journey! 🌸';
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function generateShareCard(data) {
  const canvas = document.createElement('canvas');
  const w = 600;
  const h = 480;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Soft pastel gradient background
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#FFF0F5');
  bg.addColorStop(0.3, '#FDE8EF');
  bg.addColorStop(0.6, '#FFF9F0');
  bg.addColorStop(1, '#F0FFF0');
  ctx.fillStyle = bg;
  ctx.beginPath();
  // Rounded rect
  const r = 24;
  ctx.moveTo(r, 0);
  ctx.lineTo(w - r, 0);
  ctx.quadraticCurveTo(w, 0, w, r);
  ctx.lineTo(w, h - r);
  ctx.quadraticCurveTo(w, h, w - r, h);
  ctx.lineTo(r, h);
  ctx.quadraticCurveTo(0, h, 0, h - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();

  // Subtle decorative border
  ctx.strokeStyle = 'rgba(255, 182, 193, 0.4)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Header
  ctx.font = 'bold 32px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#FF6B9D';
  ctx.textAlign = 'center';
  ctx.fillText('My Yummy Garden \uD83C\uDF38', w / 2, 55);

  // Divider line
  const divGrad = ctx.createLinearGradient(100, 0, w - 100, 0);
  divGrad.addColorStop(0, 'rgba(255,107,157,0)');
  divGrad.addColorStop(0.5, 'rgba(255,107,157,0.4)');
  divGrad.addColorStop(1, 'rgba(255,107,157,0)');
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(100, 75);
  ctx.lineTo(w - 100, 75);
  ctx.stroke();

  // Stats
  const streak = getStreak(data);
  const plants = data.gardenPlants || [];
  const numButterflies = Math.min(5, Math.floor(data.totalMeals / 3));

  ctx.font = '20px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#5D4037';
  ctx.textAlign = 'center';

  const statsY = 115;
  const stats = [
    `\uD83C\uDF7D\uFE0F ${data.totalMeals} meals`,
    `\uD83D\uDD25 ${streak} day streak`,
    `\uD83C\uDF38 ${plants.length} flowers`,
    `\uD83E\uDD8B ${numButterflies} butterflies`,
  ];
  ctx.fillText(stats.join('   \u00B7   '), w / 2, statsY);

  // Garden plants row
  const gardenY = 180;
  const displayPlants = plants.slice(-15); // Show last 15
  if (displayPlants.length > 0) {
    ctx.font = '36px "Segoe UI", system-ui, sans-serif';
    const plantStr = displayPlants.map(p => p.emoji).join(' ');
    ctx.fillText(plantStr, w / 2, gardenY);
  }

  // Garden scene area — sky + ground with scattered plants
  const sceneY = 210;
  const sceneH = 150;

  // Sky
  const skyGrad = ctx.createLinearGradient(0, sceneY, 0, sceneY + sceneH * 0.5);
  skyGrad.addColorStop(0, 'rgba(135, 206, 235, 0.25)');
  skyGrad.addColorStop(1, 'rgba(176, 224, 255, 0.15)');
  ctx.fillStyle = skyGrad;
  roundRect(ctx, 40, sceneY, w - 80, sceneH, 14);
  ctx.fill();

  // Green ground
  const groundTop = sceneY + sceneH * 0.5;
  const groundGrad = ctx.createLinearGradient(0, groundTop, 0, sceneY + sceneH);
  groundGrad.addColorStop(0, 'rgba(144, 238, 144, 0.5)');
  groundGrad.addColorStop(1, 'rgba(107, 180, 90, 0.4)');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(40, groundTop, w - 80, sceneH * 0.5);

  // Scatter plants in the scene
  ctx.textAlign = 'center';
  if (plants.length > 0) {
    ctx.font = '26px "Segoe UI", system-ui, sans-serif';
    const scatterPlants = plants.slice(-Math.min(15, plants.length));
    scatterPlants.forEach((p) => {
      const px = 70 + (p.x / 100) * (w - 140);
      const py = groundTop - 5 + (p.y / 25) * (sceneH * 0.45);
      ctx.fillText(p.emoji, px, py);
    });
  } else {
    // Empty garden — show a seed
    ctx.font = '20px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = '#8D6E63';
    ctx.fillText('🌱 Your garden is just beginning!', w / 2, sceneY + sceneH / 2 + 8);
  }

  // Motivational message
  ctx.font = 'italic 18px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#8D6E63';
  ctx.textAlign = 'center';
  ctx.fillText(getMotivationalMessage(data.totalMeals), w / 2, 410);

  // Footer
  ctx.font = '14px "Segoe UI", system-ui, sans-serif';
  ctx.fillStyle = '#B0B0B0';
  ctx.fillText('Grow your own garden at yummygarden.app \uD83E\uDD8B', w / 2, h - 25);

  return canvas;
}

async function shareGarden() {
  const data = loadData();
  const canvas = generateShareCard(data);

  try {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const file = new File([blob], 'my-yummy-garden.png', { type: 'image/png' });

    // Try Web Share API (mobile)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'My Yummy Garden',
        text: 'Check out my garden!',
        files: [file],
      });
      showToast('Shared your garden! 💖');
      return;
    }
  } catch (e) {
    // User cancelled share or API not available — fall through to download
    if (e.name === 'AbortError') return;
  }

  // Fallback: download the image
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my-yummy-garden.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('Saved to share! 💖');
}

function showShareMilestone(totalMeals) {
  if (!SHARE_MILESTONES.includes(totalMeals)) return;

  const el = document.getElementById('share-milestone');
  const textEl = document.getElementById('share-milestone-text');
  textEl.textContent = `You hit ${totalMeals} meals! Share your blooming garden? 🌺`;
  el.classList.remove('hidden');

  // Auto-dismiss after 10 seconds
  const timeout = setTimeout(() => el.classList.add('hidden'), 10000);

  // Wire up the buttons (remove old listeners by cloning)
  const yesBtn = document.getElementById('share-milestone-yes');
  const dismissBtn = document.getElementById('share-milestone-dismiss');
  const newYes = yesBtn.cloneNode(true);
  const newDismiss = dismissBtn.cloneNode(true);
  yesBtn.parentNode.replaceChild(newYes, yesBtn);
  dismissBtn.parentNode.replaceChild(newDismiss, dismissBtn);

  newYes.addEventListener('click', () => {
    clearTimeout(timeout);
    el.classList.add('hidden');
    shareGarden();
  });
  newDismiss.addEventListener('click', () => {
    clearTimeout(timeout);
    el.classList.add('hidden');
  });
}

// ===== Event Handlers =====

function init() {
  const data = loadData();

  createBgElements();
  ensureAchievementsData(data);
  renderGreeting(data);
  renderStats(data);
  renderTodayMeals(data);
  renderGarden(data);
  renderAchievements(data, []);
  renderWeekly(data);

  // Meal reminder system
  checkMealReminder();
  setInterval(checkMealReminder, 60000);

  // Dismiss reminder button
  document.getElementById('reminder-dismiss').addEventListener('click', dismissReminder);

  // Share garden button
  document.getElementById('share-btn').addEventListener('click', shareGarden);

  // Form submit
  const form = document.getElementById('meal-form');
  const input = document.getElementById('meal-input');
  const btn = document.getElementById('plant-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;

    btn.classList.add('sparkle');
    setTimeout(() => btn.classList.remove('sparkle'), 600);

    const data = addMeal(val);
    input.value = '';
    input.focus();

    // Reset reminder state when a meal is logged
    reminderDismissed = false;

    renderStats(data);
    renderTodayMeals(data);
    renderGarden(data);
    renderWeekly(data);
    renderGreeting(data);
    checkMealReminder();

    // Check achievements
    const newBadges = checkAchievements(data);
    saveData(data);
    renderAchievements(data, newBadges);

    if (newBadges.length > 0) {
      // Show achievement celebration instead of normal one for first badge
      let delay = 0;
      newBadges.forEach((id, i) => {
        setTimeout(() => showAchievementCelebration(id), delay);
        delay += 2600;
      });
    } else {
      celebrate(data);
    }
    showShareMilestone(data.totalMeals);
  });

  // Quick picks
  document.querySelectorAll('.quick-pick').forEach(pick => {
    pick.addEventListener('click', () => {
      const meal = pick.getAttribute('data-meal');
      const data = addMeal(meal);

      // Reset reminder state when a meal is logged
      reminderDismissed = false;

      renderStats(data);
      renderTodayMeals(data);
      renderGarden(data);
      renderWeekly(data);
      renderGreeting(data);
      checkMealReminder();

      // Check achievements
      const newBadges = checkAchievements(data);
      saveData(data);
      renderAchievements(data, newBadges);

      if (newBadges.length > 0) {
        let delay = 0;
        newBadges.forEach((id, i) => {
          setTimeout(() => showAchievementCelebration(id), delay);
          delay += 2600;
        });
      } else {
        celebrate(data);
      }
      showShareMilestone(data.totalMeals);
    });
  });
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
