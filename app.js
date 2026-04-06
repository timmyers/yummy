// ===== Yummy Garden App =====
//
// Sections:
// - Constants & Config ......... line ~13
// - Data Management ............ line ~120
// - Rendering .................. line ~168
// - Achievements ............... line ~308
// - Garden ..................... line ~446
// - Celebrations ............... line ~855
// - Notifications .............. line ~1312
// - Event Handlers & Init ...... line ~1809
//

const STORAGE_KEY = 'yummy-garden-data';

const FLOWERS = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🌼', '💮', '🏵️'];
const FRUITS = ['🍓', '🫐', '🍇', '🥭', '🍌', '🍎', '🍑', '🍊', '🍋', '🍒'];
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

const ACHIEVEMENTS = [
  { id: 'first_bloom', name: 'First Bloom', emoji: '🌱', hint: 'Log your first meal', bg: '#FFF0F5', glow: 'rgba(255,107,157,0.2)' },
  { id: 'garden_starter', name: 'Garden Starter', emoji: '🌿', hint: 'Log 5 meals', bg: '#F0FFF0', glow: 'rgba(107,203,119,0.2)' },
  { id: 'budding_gardener', name: 'Budding Gardener', emoji: '🌷', hint: 'Log 15 meals', bg: '#FFF0F8', glow: 'rgba(247,131,172,0.2)' },
  { id: 'green_thumb', name: 'Green Thumb', emoji: '🌻', hint: 'Log 50 meals', bg: '#FFFFF0', glow: 'rgba(255,217,61,0.2)' },
  { id: 'master_gardener', name: 'Master Gardener', emoji: '👑', hint: 'Log 100 meals', bg: '#FFF8F0', glow: 'rgba(255,160,122,0.2)' },
  { id: 'sunshine_day', name: 'Sunshine Day', emoji: '☀️', hint: '1 day streak', bg: '#FFFDE8', glow: 'rgba(255,217,61,0.2)' },
  { id: 'week_of_wellness', name: 'Week of Wellness', emoji: '🌈', hint: '7 day streak', bg: '#F0F0FF', glow: 'rgba(177,151,252,0.2)' },
  { id: 'fortnight_flora', name: 'Fortnight Flora', emoji: '🌺', hint: '14 day streak', bg: '#FFF0F5', glow: 'rgba(255,107,157,0.2)' },
  { id: 'monthly_bloom', name: 'Monthly Bloom', emoji: '💐', hint: '30 day streak', bg: '#F8F0FF', glow: 'rgba(177,151,252,0.25)' },
  { id: 'rainbow_plate', name: 'Rainbow Plate', emoji: '🌈', hint: '5 different meals in one day', bg: '#F0F8FF', glow: 'rgba(116,192,252,0.2)' },
  { id: 'early_bird', name: 'Early Bird', emoji: '🐦', hint: 'Log a meal before 9am', bg: '#FFF8E8', glow: 'rgba(255,200,0,0.2)' },
  { id: 'night_owl', name: 'Night Owl Nourisher', emoji: '🦉', hint: 'Log a meal after 8pm', bg: '#F0F0FF', glow: 'rgba(140,120,200,0.2)' },
];

const MOOD_EMOJIS = {
  great: '😊',
  good: '🙂',
  okay: '😌',
  low: '😔',
  tired: '😴',
};

const CONTEXTUAL_PROMPTS = {
  morning_no_meals: "Start your day with something nourishing! 🌅",
  afternoon_no_meals: "Don't forget to eat, beautiful! Your garden is waiting 🌷",
  evening_few_meals: "Still time to nurture yourself tonight 🌙",
};

const COMEBACK_MESSAGES = [
  "Welcome back, lovely! Your garden missed you 🌸",
  "Every day is a fresh start! Let's grow together 🌱",
  "You came back — that's what matters most 💖",
];

const AFFIRMATIONS = [
  "🌷 Nourishing my body is an act of love 💗",
  "🌸 I deserve to eat well and feel good 🌸",
  "🎀 Every meal is a gift I give myself 🎁",
  "🦋 My body thanks me when I feed it kindly 🦋",
  "💪 I am worthy of feeling energized and strong 💪",
  "🌺 Taking care of myself is not selfish — it's essential 🌺",
  "🌷 I choose foods that make me bloom 🌷",
  "🌻 I am grateful for every bite that fuels my day 🌻",
  "🍓 My body is my garden — I tend to it with love 🍓",
  "🌈 Every healthy choice is a step toward my best self 🌈",
  "💖 I honor my hunger and nourish myself fully 💖",
  "🌿 I listen to my body and give it what it needs 🌿",
  "🌸 I am blooming into the healthiest version of me 🌸",
  "☀️ Today I choose to fuel myself with kindness ☀️",
  "🍑 I am allowed to enjoy food without guilt 🍑",
  "🌹 Eating well is how I show myself respect 🌹",
  "✨ My body deserves the best I can give it ✨",
  "🫶 I am learning to love myself one meal at a time 🫶",
  "🌼 Food is my friend, not my enemy 🌼",
  "🧁 Every bite I take is an investment in my wellbeing 🧁",
  "🌙 I release all stress around eating and welcome peace 🌙",
  "🦋 I trust my body to tell me what it needs 🦋",
  "🌸 I am proud of myself for showing up today 🌸",
  "🌻 My worth is not measured by what I eat 🌻",
  "💐 I am growing stronger and more radiant every day 💐",
  "🌷 Feeding myself well is a beautiful act of self-care 🌷",
  "🍊 I celebrate every small step toward feeling good 🍊",
  "🌺 My body is amazing and deserves amazing nourishment 🌺",
  "🪷 I am gentle with myself on this journey 🪷",
  "🌟 Today I plant seeds of health that will bloom forever 🌟",
  "🌈 I am enough, and I deserve to feel wonderful 🌈",
];

function renderAffirmation() {
  const el = document.getElementById('affirmation-text');
  if (!el) return;
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  el.textContent = AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length];
}

function haptic() {
  try {
    if (navigator.vibrate) navigator.vibrate(10);
  } catch (_) { /* gracefully ignore */ }
}

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
    } else {
      break;
    }
  }
  // Update best streak
  if (streak > (data.bestStreak || 0)) {
    data.bestStreak = streak;
    saveData(data);
  }
  return streak;
}

function renderGreeting(data) {
  const hour = new Date().getHours();
  let period = 'morning';
  if (hour >= 12 && hour < 17) period = 'afternoon';
  else if (hour >= 17) period = 'evening';

  const todayMeals = data ? getTodayMeals(data) : [];
  let greeting = null;

  // Show warm comeback message if streak is broken but user has history
  if (data && todayMeals.length === 0) {
    // Find how many days since last active
    const now = new Date();
    let lastActive = -1;
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = getDateKey(d);
      if (data.meals[key] && data.meals[key].length > 0) { lastActive = i; break; }
    }
    if (lastActive >= 2) {
      greeting = COMEBACK_MESSAGES[Math.floor(Math.random() * COMEBACK_MESSAGES.length)];
    }
  }

  // Show contextual eating prompts when appropriate
  if (!greeting) {
    if (period === 'morning' && todayMeals.length === 0 && hour >= 7) {
      greeting = CONTEXTUAL_PROMPTS.morning_no_meals;
    } else if (period === 'afternoon' && todayMeals.length === 0) {
      greeting = CONTEXTUAL_PROMPTS.afternoon_no_meals;
    } else if (period === 'evening' && todayMeals.length <= 1) {
      greeting = CONTEXTUAL_PROMPTS.evening_few_meals;
    }
  }

  if (!greeting) {
    const greetings = GREETINGS[period];
    greeting = greetings[Math.floor(Math.random() * greetings.length)];
  }

  document.getElementById('greeting').textContent = greeting;
}

function renderStats(data) {
  const streak = getStreak(data);
  let streakText = `🔥 ${streak} day${streak !== 1 ? 's' : ''} streak`;
  if (streak === 0 && data.bestStreak > 1) {
    streakText += ` (best: ${data.bestStreak} days)`;
  }
  document.getElementById('streak-label').textContent = streakText;
  document.getElementById('total-meals').textContent =
    `🍽️ ${data.totalMeals} meal${data.totalMeals !== 1 ? 's' : ''} logged`;
}

function mealToHtml(meal, index, showDelete) {
  const icon = getMealIcon(meal.name);
  const time = new Date(meal.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const moodDisplay = meal.mood && MOOD_EMOJIS[meal.mood] ? `<span class="mood-emoji-display">${MOOD_EMOJIS[meal.mood]}</span>` : '';
  const deleteBtn = showDelete ? `<button class="meal-delete-btn" data-index="${index}" aria-label="Remove meal" type="button">&times;</button>` : '';
  return `<span class="meal-icon">${icon}</span>
      <span>${escapeHtml(meal.name)}${moodDisplay}</span>
      <span class="meal-time">${time}</span>${deleteBtn}`;
}

function renderTodayMeals(data) {
  const list = document.getElementById('today-meals');
  const meals = getTodayMeals(data);

  if (meals.length === 0) {
    list.innerHTML = '<li class="empty-state">Nothing yet — let\'s eat something! 🌱</li>';
    return;
  }

  list.innerHTML = meals.map((meal, i) =>
    `<li class="meal-item" style="animation-delay: ${i * 0.05}s">
      ${mealToHtml(meal, i, true)}
    </li>`
  ).join('');

  // Attach delete handlers
  list.querySelectorAll('.meal-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteMeal(parseInt(btn.getAttribute('data-index'), 10));
    });
  });
}

function deleteMeal(index) {
  const data = loadData();
  const key = getDateKey();
  const meals = data.meals[key];
  if (!meals || index < 0 || index >= meals.length) return;

  meals.splice(index, 1);
  if (meals.length === 0) delete data.meals[key];

  data.totalMeals = Math.max(0, data.totalMeals - 1);

  if (data.gardenPlants.length > 0) {
    data.gardenPlants.pop();
  }

  saveData(data);

  renderStats(data);
  renderTodayMeals(data);
  renderGarden(data);
  renderWeekly(data);
  renderInsights(data);
  renderAccordion(data);
  renderDailyGoal(data);
  renderAchievements(data, []);
  renderGreeting(data);

  showToast('Meal removed 🌿');
}

function getMealIcon(name) {
  const lower = name.toLowerCase();
  const icons = [
    ['🍓', 'strawberry', 'strawberries'], ['🫐', 'blueberry', 'blueberries'], ['🍇', 'grape', 'grapes'],
    ['🥭', 'mango'], ['🍌', 'banana'], ['🍎', 'apple'], ['🍑', 'peach'], ['🍊', 'orange'],
    ['🥗', 'salad'], ['🍜', 'soup'], ['🥪', 'sandwich'], ['🍚', 'rice'], ['🥤', 'smoothie'],
    ['🍝', 'pasta', 'noodle'], ['🍕', 'pizza'], ['🍳', 'egg'], ['🍞', 'bread', 'toast'],
    ['🍪', 'cookie', 'cookies'], ['🎂', 'cake'], ['☕', 'coffee'], ['🍵', 'tea'], ['💧', 'water'],
    ['🍗', 'chicken'], ['🍣', 'fish', 'sushi'], ['🌮', 'taco'], ['🍔', 'burger'],
  ];
  for (const [icon, ...keywords] of icons) {
    if (lower.includes(icon) || keywords.some(k => lower.includes(k))) return icon;
  }
  return '🍽️';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function checkAchievements(data) {
  if (!data.achievements) data.achievements = {};
  if (!data.uniqueMealsPerDay) data.uniqueMealsPerDay = {};
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
  if (!data.achievements) data.achievements = {};
  if (!data.uniqueMealsPerDay) data.uniqueMealsPerDay = {};
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

  // Update collapsed summary
  const summaryEl = document.getElementById('achievements-summary');
  if (summaryEl) {
    const count = Object.keys(data.achievements || {}).length;
    summaryEl.textContent = count + ' of ' + ACHIEVEMENTS.length + ' unlocked';
  }
}

function showAchievementCelebration(achievementId) {
  const badge = ACHIEVEMENTS.find(b => b.id === achievementId);
  if (!badge) return;
  haptic();

  // Create overlay appended to body so it doesn't affect page flow
  const overlay = document.createElement('div');
  overlay.className = 'achievement-celebration';
  overlay.innerHTML = `<div class="achievement-celebration-content">
    <span class="ach-emoji">${badge.emoji}</span>
    <span class="ach-label">Achievement Unlocked!</span>
    <span class="ach-name">${badge.name}</span>
  </div>`;
  document.body.appendChild(overlay);

  spawnConfetti();

  // Start fade-out after 2.1s, then remove after fade completes
  setTimeout(() => {
    overlay.classList.add('fade-out');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    // Fallback removal if transitionend doesn't fire
    setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 500);
  }, 2100);
}

function getGardenSeason(totalMeals) {
  if (totalMeals >= 75) {
    return { id: 'winter', cssClass: 'season-winter', label: 'Winter Wonderland \u2744\uFE0F' };
  } else if (totalMeals >= 40) {
    return { id: 'autumn', cssClass: 'season-autumn', label: 'Autumn Garden \uD83C\uDF42' };
  } else if (totalMeals >= 15) {
    return { id: 'summer', cssClass: 'season-summer', label: 'Summer Garden \u2600\uFE0F' };
  }
  return { id: 'spring', cssClass: 'season-spring', label: 'Spring Garden \uD83C\uDF31' };
}

function renderSeasonParticles(season) {
  const container = document.getElementById('season-particles');
  if (!container) return;
  container.innerHTML = '';

  const particleConfig = {
    autumn: { items: ['\uD83C\uDF42', '\uD83C\uDF41', '\uD83C\uDF42', '\uD83C\uDF41'], className: 'autumn-leaf', startLeft: 15, spacing: 22, delay: 1.8 },
    winter: { items: ['\u2744\uFE0F', '\u2728', '\u2744\uFE0F', '\u2728'], className: 'winter-flake', startLeft: 10, spacing: 25, delay: 2.1 },
  };
  const config = particleConfig[season.id];
  if (!config) return;

  config.items.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = `season-particle ${config.className}`;
    el.textContent = item;
    el.style.left = `${config.startLeft + i * config.spacing}%`;
    el.style.animationDelay = `${i * config.delay}s`;
    container.appendChild(el);
  });
}

// ===== Garden Rendering =====

function renderGarden(data) {
  const plots = document.getElementById('garden-plots');
  const butterfliesEl = document.getElementById('butterflies');

  // Render plants
  plots.innerHTML = '';
  const plants = data.gardenPlants || [];

  if (plants.length === 0) {
    plots.innerHTML = `
      <div class="garden-empty-state">
        <div class="garden-empty-seed">🌱</div>
        <p class="garden-empty-text">Log a meal to plant your first flower!</p>
      </div>
    `;
  }

  // Add decorative ground elements
  plots.querySelectorAll('.garden-decor').forEach(el => el.remove());
  [{x:12,e:'🌿'},{x:38,e:'🌿'},{x:65,e:'🌿'},{x:88,e:'🌿'}].forEach(d => {
    const g = document.createElement('div');
    g.className = 'garden-decor';
    g.style.left = `${d.x}%`;
    g.textContent = d.e;
    plots.appendChild(g);
  });

  plants.forEach((plant, i) => {
    const el = document.createElement('div');
    el.className = 'garden-plant';
    el.style.left = `${plant.x}%`;
    el.style.bottom = `${10 + plant.y}%`;
    el.style.animationDelay = `${i * 0.1}s`;
    el.style.zIndex = Math.floor(plant.y);

    const size = (0.8 + (plant.growth || 1) * 0.4) * (plant.size || 1.0);
    el.innerHTML = `
      <div class="plant-flower" style="font-size: ${size}rem; animation-delay: ${plant.swayOffset || 0}s">${plant.emoji}</div>
      <div class="plant-stem" style="height: ${20 + (plant.growth || 1) * 10}px"></div>
      <div class="plant-leaves">🌿</div>
    `;

    // Show meal tooltip on tap
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => {
      // Remove any existing tooltip
      const old = plots.querySelector('.plant-tooltip');
      if (old) old.remove();

      // Build tooltip text
      let label;
      if (plant.meal) {
        label = plant.emoji + ' ' + plant.meal;
        if (plant.plantedAt) {
          const d = new Date(plant.plantedAt);
          const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
          label += ' · ' + timeStr;
        }
      } else {
        label = 'A lovely bloom 🌸';
      }

      const tip = document.createElement('div');
      tip.className = 'plant-tooltip';
      tip.textContent = label;
      el.appendChild(tip);

      setTimeout(() => { tip.classList.add('plant-tooltip-visible'); }, 10);
      setTimeout(() => {
        tip.classList.remove('plant-tooltip-visible');
        setTimeout(() => tip.remove(), 200);
      }, 2500);
    });

    plots.appendChild(el);
  });

  // Render clouds (ambient sky movement)
  const oldClouds = document.getElementById('garden').querySelectorAll('.garden-cloud');
  oldClouds.forEach(c => c.remove());
  [{ top: '8%', dur: '32s', delay: '0s' }, { top: '18%', dur: '38s', delay: '-14s' }, { top: '12%', dur: '28s', delay: '-8s' }].forEach(c => {
    const span = document.createElement('span');
    span.className = 'garden-cloud';
    span.textContent = '☁️';
    Object.assign(span.style, { top: c.top, animationDuration: c.dur, animationDelay: c.delay });
    document.getElementById('garden').appendChild(span);
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

  // Apply garden season
  const season = getGardenSeason(data.totalMeals);
  const gardenEl = document.getElementById('garden');
  gardenEl.classList.remove('season-spring', 'season-summer', 'season-autumn', 'season-winter');
  gardenEl.classList.add(season.cssClass);

  // Update season label
  const seasonLabel = document.getElementById('season-label');
  if (seasonLabel) {
    seasonLabel.textContent = season.label;
  }

  // Render season particles
  renderSeasonParticles(season);
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
    const isFuture = d > today;

    let icon = '';
    let cls = 'no-meals';
    if (meals.length >= 3) {
      icon = '🌸';
      cls = 'meals-3';
    } else if (meals.length === 2) {
      icon = '🌷';
      cls = 'meals-2';
    } else if (meals.length === 1) {
      icon = '🌱';
      cls = 'meals-1';
    } else if (isFuture) {
      icon = '·';
      cls = 'future-day';
    }

    html += `<div class="week-day ${cls} ${isToday ? 'today' : ''}">
      <span class="week-day-label">${days[i]}</span>
      <span class="week-day-icon">${icon}</span>
    </div>`;
  }

  grid.innerHTML = html;
}

// ===== Meal History & Insights =====

function renderInsights(data) {
  const container = document.getElementById('history-insights');
  if (!container) return;

  const insights = [];
  const today = new Date();
  let totalMealsThisWeek = 0;
  let daysWithMeals = 0;
  let bestDay = null;
  let bestDayCount = 0;
  const mealNameCounts = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getDateKey(d);
    const dayMeals = data.meals[key] || [];
    totalMealsThisWeek += dayMeals.length;
    if (dayMeals.length > 0) daysWithMeals++;

    if (dayMeals.length > bestDayCount) {
      bestDayCount = dayMeals.length;
      bestDay = d;
    }

    dayMeals.forEach(m => {
      const name = m.name.trim().toLowerCase();
      mealNameCounts[name] = (mealNameCounts[name] || 0) + 1;
    });
  }

  // Best day insight
  if (bestDay && bestDayCount > 0) {
    const dayName = bestDay.toLocaleDateString([], { weekday: 'long' });
    insights.push({
      text: `Your best day was ${dayName} with ${bestDayCount} meal${bestDayCount !== 1 ? 's' : ''}! 🌸`,
      style: '',
    });
  }

  // Favorite meal insight
  let favMeal = null;
  let favCount = 0;
  for (const [name, count] of Object.entries(mealNameCounts)) {
    if (count > favCount) {
      favCount = count;
      favMeal = name;
    }
  }
  if (favMeal && favCount >= 2) {
    // Capitalize first letter
    const display = favMeal.charAt(0).toUpperCase() + favMeal.slice(1);
    insights.push({
      text: `You love ${display} — ${favCount} times this week! 🍓`,
      style: 'mint',
    });
  }

  // Average meals per day
  if (daysWithMeals > 0) {
    const avg = (totalMealsThisWeek / 7).toFixed(1);
    insights.push({
      text: `Averaging ${avg} meals per day this week 🌱`,
      style: 'lavender',
    });
  }

  // Weekly mood summary
  const moodCounts = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getDateKey(d);
    const dayMeals = data.meals[key] || [];
    dayMeals.forEach(m => {
      if (m.mood) {
        moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
      }
    });
  }
  let topMood = null;
  let topMoodCount = 0;
  for (const [mood, count] of Object.entries(moodCounts)) {
    if (count > topMoodCount) {
      topMoodCount = count;
      topMood = mood;
    }
  }
  if (topMood && topMoodCount >= 1 && MOOD_EMOJIS[topMood]) {
    insights.push({
      text: `You felt mostly ${MOOD_EMOJIS[topMood]} this week — eating well suits you! 🌸`,
      style: 'mint',
    });
  }

  // Eating window insight
  if (daysWithMeals >= 3) {
    let earliestSum = 0, latestSum = 0, windowDays = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = getDateKey(d);
      const dayMeals = data.meals[key] || [];
      if (dayMeals.length === 0) continue;
      const hours = dayMeals.map(m => { const t = new Date(m.time); return t.getHours() + t.getMinutes() / 60; });
      earliestSum += Math.min(...hours);
      latestSum += Math.max(...hours);
      windowDays++;
    }
    const fmtHour = h => { const hr = Math.round(h); const suffix = hr >= 12 ? 'pm' : 'am'; return (hr % 12 || 12) + suffix; };
    insights.push({
      text: `You usually eat between ${fmtHour(earliestSum / windowDays)} – ${fmtHour(latestSum / windowDays)} 🕐`,
      style: 'lavender',
    });
  }

  if (insights.length === 0) {
    container.innerHTML = '<span class="insight-pill">Start logging meals to see your insights! ✨</span>';
    return;
  }

  container.innerHTML = insights.map(ins =>
    `<span class="insight-pill ${ins.style}">${escapeHtml(ins.text)}</span>`
  ).join('');
}

function renderAccordion(data) {
  const container = document.getElementById('history-accordion');
  if (!container) return;

  const today = new Date();
  const todayKey = getDateKey();
  let html = '';

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getDateKey(d);
    const dayMeals = data.meals[key] || [];
    const isToday = key === todayKey;
    const isOpen = isToday;

    const dateLabel = isToday
      ? 'Today'
      : d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

    let bloomIcon = '🌑';
    if (dayMeals.length >= 3) bloomIcon = '🌸';
    else if (dayMeals.length === 2) bloomIcon = '🌷';
    else if (dayMeals.length === 1) bloomIcon = '🌱';

    const countText = `${dayMeals.length} meal${dayMeals.length !== 1 ? 's' : ''}`;

    let bodyContent = '';
    if (dayMeals.length === 0) {
      bodyContent = '<p class="empty-day">No meals logged this day</p>';
    } else {
      bodyContent = '<ul class="meal-list">' + dayMeals.map(meal =>
        `<li>${mealToHtml(meal)}</li>`
      ).join('') + '</ul>';
    }

    html += `<div class="accordion-item${isOpen ? ' open' : ''}${isToday ? ' today-item' : ''}">
      <button class="accordion-header" type="button" aria-expanded="${isOpen}">
        <span class="bloom-icon">${bloomIcon}</span>
        <span class="day-label">${dateLabel}</span>
        <span class="meal-count">${countText}</span>
        <span class="chevron">▼</span>
      </button>
      <div class="accordion-body">
        <div class="accordion-body-inner">${bodyContent}</div>
      </div>
    </div>`;
  }

  container.innerHTML = html;

  // Attach toggle listeners
  container.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasOpen = item.classList.contains('open');
      item.classList.toggle('open');
      header.setAttribute('aria-expanded', !wasOpen);
    });
  });
}

// ===== Collapsible Sections =====

function initCollapsibleSections(data) {
  const stored = JSON.parse(localStorage.getItem('yummy-collapsed-sections') || '{}');
  document.querySelectorAll('.collapsible-heading').forEach(heading => {
    const section = heading.dataset.section;
    const body = document.getElementById(section + '-body');
    const isOpen = stored[section] === true;
    if (isOpen) { heading.classList.add('open'); body.classList.add('open'); }

    // Achievements summary
    if (section === 'achievements') {
      const count = Object.keys(data.achievements || {}).length;
      const el = document.getElementById('achievements-summary');
      if (el) el.textContent = count + ' of ' + ACHIEVEMENTS.length + ' unlocked';
    }

    heading.addEventListener('click', () => {
      const opening = !heading.classList.contains('open');
      heading.classList.toggle('open');
      body.classList.toggle('open');
      const state = JSON.parse(localStorage.getItem('yummy-collapsed-sections') || '{}');
      state[section] = opening;
      localStorage.setItem('yummy-collapsed-sections', JSON.stringify(state));
    });
  });
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

function showOverlay(emoji, text, duration) {
  const overlay = document.getElementById('celebration');
  const emojiEl = document.getElementById('celebration-emoji');
  const textEl = document.getElementById('celebration-text');

  emojiEl.textContent = emoji;
  textEl.textContent = text;

  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('hidden'), duration);
  spawnConfetti();
}

function celebrate(data) {
  const emoji = CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)];

  let text;
  if (MEAL_MILESTONES.includes(data.totalMeals)) {
    text = `🎉 ${data.totalMeals} meals logged! Amazing!`;
  } else {
    const messages = [
      'Your garden grew! 🌱',
      'Yummy! Keep growing! 🌸',
      'Nom nom nom! 🍓',
      'Beautiful bloom! 🌺',
      'Garden magic! ✨',
      'Delicious choice! 🫐',
    ];
    text = messages[Math.floor(Math.random() * messages.length)];
  }

  showOverlay(emoji, text, 1800);
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

function addMeal(name, data) {
  if (!data) data = loadData();
  const key = getDateKey();

  if (!data.meals[key]) data.meals[key] = [];

  const now = new Date();
  const trimmedName = name.trim();
  const meals = data.meals[key];

  // Group items logged within 30 minutes into a single meal
  const DEDUP_WINDOW_MS = 30 * 60 * 1000;
  const lastMeal = meals.length > 0 ? meals[meals.length - 1] : null;
  const lastMealAge = lastMeal ? (now - new Date(lastMeal.time)) : Infinity;

  if (lastMeal && lastMealAge < DEDUP_WINDOW_MS) {
    // Append to existing meal (combine names)
    const existingNames = lastMeal.name.split(', ');
    if (!existingNames.includes(trimmedName)) {
      lastMeal.name += ', ' + trimmedName;
      // Update the last plant's size based on item count
      const plants = data.gardenPlants || [];
      if (plants.length > 0) {
        const itemCount = lastMeal.name.split(', ').length;
        plants[plants.length - 1].size = itemCount >= 3 ? 1.3 : itemCount === 2 ? 1.15 : 1.0;
      }
    }
    // Don't increment totalMeals or add a plant — same meal sitting
  } else {
    // New meal
    const meal = {
      name: trimmedName,
      time: now.toISOString(),
    };
    meals.push(meal);
    data.totalMeals = (data.totalMeals || 0) + 1;

    // Add a new plant to the garden (only for new meals)
    const mealLabel = trimmedName.length > 20 ? trimmedName.slice(0, 20) + '...' : trimmedName;
    const plant = {
      emoji: PLANT_TYPES[Math.floor(Math.random() * PLANT_TYPES.length)],
      x: 5 + Math.random() * 85,
      y: Math.random() * 25,
      growth: 0.5 + Math.random() * 1.5,
      swayOffset: Math.random() * 3,
      meal: mealLabel,
      plantedAt: now.toISOString(),
    };

    if (!data.gardenPlants) data.gardenPlants = [];
    if (data.gardenPlants.length >= 30) {
      data.gardenPlants.shift();
    }
    data.gardenPlants.push(plant);
  }

  // Track unique meal names per day for Rainbow Plate badge (always)
  if (!data.uniqueMealsPerDay) data.uniqueMealsPerDay = {};
  if (!data.uniqueMealsPerDay[key]) data.uniqueMealsPerDay[key] = [];
  const normalizedName = trimmedName.toLowerCase();
  if (!data.uniqueMealsPerDay[key].includes(normalizedName)) {
    data.uniqueMealsPerDay[key].push(normalizedName);
  }

  // Note: caller (handlePostMeal) is responsible for saving data
  // after achievements are checked, avoiding a redundant localStorage write.
  return data;
}

// ===== Meal Reminder System =====

let reminderDismissed = false;

function checkMealReminder(data) {
  if (reminderDismissed) return;

  if (!data) data = loadData();
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
  const motivMsg = data.totalMeals >= 100 ? 'A legendary garden keeper! 👑'
    : data.totalMeals >= 50 ? 'My garden is thriving beautifully! 🌈'
    : data.totalMeals >= 25 ? 'Growing stronger every day! 🌻'
    : data.totalMeals >= 10 ? 'Watch my garden bloom! 🌷'
    : data.totalMeals >= 5 ? 'My garden is coming to life! 🌱'
    : 'Just started my garden journey! 🌸';
  ctx.fillText(motivMsg, w / 2, 410);

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

// ===== Daily Garden Goal =====

const GOAL_STORAGE_KEY = 'yummy-garden-goal';
const GOAL_RING_CIRCUMFERENCE = 2 * Math.PI * 34; // ~213.63

function getGoalSettings() {
  try { const r = localStorage.getItem(GOAL_STORAGE_KEY); if (r) return JSON.parse(r); } catch (e) {}
  return { dailyGoal: 3, celebratedDates: [] };
}

function saveGoalSettings(s) { localStorage.setItem(GOAL_STORAGE_KEY, JSON.stringify(s)); }

function renderDailyGoal(data) {
  const goalSettings = getGoalSettings();
  const goal = goalSettings.dailyGoal;
  const todayMeals = getTodayMeals(data);
  const count = todayMeals.length;
  const progress = Math.min(count / goal, 1);

  const ringFill = document.getElementById('goal-ring-fill');
  const countEl = document.getElementById('goal-count');
  const messageEl = document.getElementById('goal-message');
  const goalContainer = document.getElementById('daily-goal');
  const goalSelect = document.getElementById('goal-select');

  if (!ringFill || !countEl || !messageEl || !goalContainer) return;

  // Update progress ring
  const offset = GOAL_RING_CIRCUMFERENCE * (1 - progress);
  ringFill.style.strokeDashoffset = offset;

  // Update goal select if present
  if (goalSelect) goalSelect.value = String(goal);

  // Completed vs in-progress states
  if (count >= goal) {
    // Show checkmark instead of "4 of 3"
    countEl.textContent = `${goal} ✓`;
    goalContainer.classList.add('goal-complete');
    ringFill.setAttribute('stroke', 'url(#goal-gradient-gold)');
    messageEl.textContent = count > goal
      ? `Goal smashed! ${count} meals today! 🌟`
      : 'Goal reached! 🎉';
  } else {
    countEl.textContent = `${count} of ${goal}`;
    goalContainer.classList.remove('goal-complete');
    ringFill.setAttribute('stroke', 'url(#goal-gradient)');

    // Encouraging messages based on progress
    if (count === 0) {
      messageEl.textContent = "Let's nourish your garden today!";
    } else if (progress < 0.5) {
      messageEl.textContent = `Great start! ${goal - count} more to go 🌱`;
    } else {
      messageEl.textContent = `Almost there! Just ${goal - count} more 🌸`;
    }
  }
}

const NOTIF_STORAGE_KEY = 'yummy-garden-notifs';

function getNotifSettings() {
  try { const r = localStorage.getItem(NOTIF_STORAGE_KEY); if (r) return JSON.parse(r); } catch (e) {}
  return { enabled: false, intervalHours: 3 };
}

function saveNotifSettings(s) { localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(s)); }

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    return reg;
  } catch (e) {
    console.error('SW registration failed:', e);
    return null;
  }
}

function isIOSSafari() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isStandaloneMode() {
  return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
}

async function enableNotifications() {
  if (!('Notification' in window)) {
    if (isIOSSafari() && !isStandaloneMode()) {
      showToast('To get reminders on iPhone, tap Share → Add to Home Screen first! 📲');
    } else if (isIOSSafari() && isStandaloneMode()) {
      showToast('Please update to iOS 16.4+ for notification support 🔔');
    } else {
      showToast('Notifications not supported in this browser 😢');
    }
    return false;
  }

  let permission = Notification.permission;
  if (permission === 'denied') {
    showToast('Notifications are blocked. Please enable them in your browser settings 🔔');
    return false;
  }

  if (permission !== 'granted') {
    permission = await Notification.requestPermission();
  }

  if (permission !== 'granted') {
    showToast('Notifications permission needed to send reminders 🌸');
    return false;
  }

  const reg = await registerServiceWorker();
  if (!reg) {
    showToast('Could not set up reminders 😢');
    return false;
  }

  const settings = getNotifSettings();
  settings.enabled = true;
  saveNotifSettings(settings);

  // Tell the service worker to schedule reminders
  if (reg.active) {
    reg.active.postMessage({
      type: 'SCHEDULE_REMINDER',
      intervalMs: settings.intervalHours * 60 * 60 * 1000,
    });
  }

  // Wait for SW to activate if it's installing
  if (reg.installing || reg.waiting) {
    const sw = reg.installing || reg.waiting;
    sw.addEventListener('statechange', () => {
      if (sw.state === 'activated') {
        sw.postMessage({
          type: 'SCHEDULE_REMINDER',
          intervalMs: settings.intervalHours * 60 * 60 * 1000,
        });
      }
    });
  }

  return true;
}

function disableNotifications() {
  const settings = getNotifSettings();
  settings.enabled = false;
  saveNotifSettings(settings);

  // Unregister service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) reg.unregister();
    });
  }
}

function renderNotifToggle() {
  const settings = getNotifSettings();
  const toggle = document.getElementById('notif-toggle');
  const intervalRow = document.getElementById('notif-interval-row');
  const intervalSelect = document.getElementById('notif-interval');
  const statusEl = document.getElementById('notif-status');

  if (settings.enabled && Notification.permission === 'granted') {
    toggle.classList.add('active');
    intervalRow.classList.remove('hidden');
    statusEl.textContent = `Reminders every ${settings.intervalHours} hours 🌸`;
  } else {
    toggle.classList.remove('active');
    intervalRow.classList.add('hidden');
    statusEl.textContent = 'Get gentle nudges to eat throughout the day';
  }

  intervalSelect.value = String(settings.intervalHours);
}

function initNotifications() {
  const toggle = document.getElementById('notif-toggle');
  const intervalSelect = document.getElementById('notif-interval');
  const settings = getNotifSettings();

  // Re-register SW if notifications were previously enabled
  if (settings.enabled && Notification.permission === 'granted') {
    registerServiceWorker().then((reg) => {
      if (reg && reg.active) {
        reg.active.postMessage({
          type: 'SCHEDULE_REMINDER',
          intervalMs: settings.intervalHours * 60 * 60 * 1000,
        });
      }
    });
  }

  renderNotifToggle();

  toggle.addEventListener('click', async () => {
    const settings = getNotifSettings();
    if (settings.enabled) {
      disableNotifications();
      showToast('Reminders turned off 🌙');
    } else {
      const success = await enableNotifications();
      if (success) {
        showToast('Reminders are on! Your garden will nudge you 🌸');
      }
    }
    renderNotifToggle();
  });

  intervalSelect.addEventListener('change', () => {
    const settings = getNotifSettings();
    settings.intervalHours = parseInt(intervalSelect.value, 10);
    saveNotifSettings(settings);
    renderNotifToggle();

    // Update SW interval
    if (settings.enabled) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.active) {
          reg.active.postMessage({
            type: 'SCHEDULE_REMINDER',
            intervalMs: settings.intervalHours * 60 * 60 * 1000,
          });
        }
      });
    }
    showToast(`Reminders set to every ${settings.intervalHours} hours 🔔`);
  });
}

// ===== Hydration Tracker =====

const HYDRATION_GOAL = 8;

function getHydrationCount(data) {
  if (!data.hydration) data.hydration = {};
  const key = getDateKey();
  return data.hydration[key] || 0;
}

function setHydrationCount(data, count) {
  if (!data.hydration) data.hydration = {};
  const key = getDateKey();
  data.hydration[key] = count;
  saveData(data);
}

function renderHydration(data) {
  const count = getHydrationCount(data);
  const drops = document.querySelectorAll('#hydration-drops .water-drop');
  const label = document.getElementById('hydration-label');

  drops.forEach((drop, i) => {
    if (i < count) {
      drop.classList.add('filled');
    } else {
      drop.classList.remove('filled');
    }
  });

  if (label) {
    label.textContent = `\uD83D\uDCA7 ${count}/${HYDRATION_GOAL} glasses today`;
  }
}

function initHydration(data) {
  renderHydration(data);

  const drops = document.querySelectorAll('#hydration-drops .water-drop');
  drops.forEach(drop => {
    drop.addEventListener('click', () => {
      const index = parseInt(drop.getAttribute('data-index'), 10);
      const data = loadData();
      const currentCount = getHydrationCount(data);

      let newCount;
      // If tapping a filled drop: unfill it and all after it
      // If tapping an unfilled drop: fill it and all before it
      if (index < currentCount) {
        newCount = index;
      } else {
        newCount = index + 1;
      }

      setHydrationCount(data, newCount);
      haptic();
      renderHydration(data);

      if (newCount >= HYDRATION_GOAL && currentCount < HYDRATION_GOAL) {
        const cloud = document.getElementById('rain-cloud');
        if (cloud) { cloud.classList.remove('hidden'); setTimeout(() => cloud.classList.add('hidden'), 3500); }
        showToast("Your garden got a good rain! \uD83C\uDF27\uFE0F\uD83D\uDC96");
      }
    });
  });
}

// ===== Mood Check-in =====

let moodAutoTimer = null;

function showMoodPrompt() {
  const prompt = document.getElementById('mood-prompt');
  if (!prompt) return;
  prompt.classList.remove('hidden');

  // Clear any existing auto-dismiss timer
  if (moodAutoTimer) clearTimeout(moodAutoTimer);

  // Auto-dismiss after 8 seconds
  moodAutoTimer = setTimeout(() => {
    dismissMoodPrompt();
  }, 8000);
}

function dismissMoodPrompt() {
  const prompt = document.getElementById('mood-prompt');
  if (!prompt) return;
  prompt.classList.add('hidden');
  if (moodAutoTimer) {
    clearTimeout(moodAutoTimer);
    moodAutoTimer = null;
  }
  // Remove selected state from all mood buttons
  prompt.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
}

function initMoodPrompt() {
  const prompt = document.getElementById('mood-prompt');
  if (!prompt) return;

  // Mood emoji button clicks
  prompt.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.getAttribute('data-mood');
      haptic();
      btn.classList.add('selected');

      // Save mood to last meal
      const data = loadData();
      const key = getDateKey();
      const todayMeals = data.meals[key];
      if (todayMeals && todayMeals.length > 0) {
        todayMeals[todayMeals.length - 1].mood = mood;
        saveData(data);
        renderTodayMeals(data);
        renderInsights(data);
        renderAccordion(data);
      }

      setTimeout(() => dismissMoodPrompt(), 300);
    });
  });

  // Skip button
  const skipBtn = document.getElementById('mood-skip');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      dismissMoodPrompt();
    });
  }
}

// ===== Post-Meal Flow =====
// Sequential: achievement > goal > normal celebration, then mood prompt, then share milestone.
// Only one celebration type fires. Mood and share are queued after it finishes.

function handlePostMeal(data, oldTotal) {
  // Reset reminder state when a meal is logged
  reminderDismissed = false;

  // Re-render everything
  renderStats(data);
  renderTodayMeals(data);
  renderGarden(data);
  renderWeekly(data);
  renderInsights(data);
  renderAccordion(data);
  renderGreeting(data);
  renderDailyGoal(data);
  checkMealReminder(data);

  // Check what happened
  const newBadges = checkAchievements(data);
  saveData(data);
  renderAchievements(data, newBadges);

  // Check if daily goal was just reached
  const goalSettings = getGoalSettings();
  const todayKey = getDateKey();
  if (!goalSettings.celebratedDates) goalSettings.celebratedDates = [];
  const goalReached = getTodayMeals(data).length === goalSettings.dailyGoal
    && !goalSettings.celebratedDates.includes(todayKey);
  if (goalReached) {
    goalSettings.celebratedDates.push(todayKey);
    if (goalSettings.celebratedDates.length > 30) goalSettings.celebratedDates = goalSettings.celebratedDates.slice(-30);
    saveGoalSettings(goalSettings);
  }

  const oldSeason = getGardenSeason(oldTotal);
  const curSeason = getGardenSeason(data.totalMeals);
  const newSeason = oldSeason.id !== curSeason.id ? curSeason : null;

  // Determine which single celebration to show and how long it lasts.
  // Priority: achievement > goal > season transition > normal celebration.
  let celebrationDuration = 0;

  if (newBadges.length > 0) {
    // Show only the first achievement badge (the most important one)
    showAchievementCelebration(newBadges[0]);
    celebrationDuration = 2600;
  } else if (goalReached) {
    showOverlay('🌸', 'You nourished yourself beautifully today! 🌸', 2200);
    celebrationDuration = 2200;
  } else if (newSeason) {
    const seasonData = {
      summer: { emoji: '☀️', text: 'Your garden entered Summer! ☀️ Keep blooming!' },
      autumn: { emoji: '🍂', text: 'Autumn colors are here! 🍂 Beautiful progress!' },
      winter: { emoji: '❄️', text: 'Welcome to Winter Wonderland! ❄️ You\'re incredible!' },
    };
    const info = seasonData[newSeason.id];
    if (info) showOverlay(info.emoji, info.text, 2200);
    celebrationDuration = 2200;
  } else {
    celebrate(data);
    celebrationDuration = 1800;
  }

  // Smooth scroll to garden so the user sees their new plant grow
  setTimeout(() => {
    const gardenCard = document.querySelector('.garden-card');
    if (gardenCard) {
      gardenCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 1000);

  // Mood prompt appears after the celebration finishes (~2s buffer)
  setTimeout(() => {
    showMoodPrompt();

    // Share milestone appears after mood prompt dismisses or is skipped.
    // The mood prompt auto-dismisses after 8s, but the user might interact sooner.
    // We observe the mood prompt hiding, then show the share milestone.
    const moodEl = document.getElementById('mood-prompt');
    if (moodEl && !moodEl.classList.contains('hidden')) {
      const observer = new MutationObserver(() => {
        if (moodEl.classList.contains('hidden')) {
          observer.disconnect();
          setTimeout(() => showShareMilestone(data.totalMeals), 300);
        }
      });
      observer.observe(moodEl, { attributes: true, attributeFilter: ['class'] });
    } else {
      // Mood prompt didn't appear — show share milestone directly
      setTimeout(() => showShareMilestone(data.totalMeals), 300);
    }
  }, celebrationDuration + 200);
}

// ===== Meal Autocomplete =====

function getMealSuggestions(data) {
  const freq = {};
  for (const key of Object.keys(data.meals)) {
    const dayMeals = data.meals[key];
    for (const meal of dayMeals) {
      // Split combined meals (from 30-min grouping) into individual items
      const parts = meal.name.split(', ');
      for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        freq[trimmed] = (freq[trimmed] || 0) + 1;
      }
    }
  }
  // Sort by frequency descending, then alphabetical
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);
}

function renderMealSuggestions(query, suggestions) {
  const container = document.getElementById('meal-suggestions');
  if (!container) return;

  if (!query || query.length < 2) {
    container.innerHTML = '';
    return;
  }

  const lower = query.toLowerCase();
  const matches = suggestions.filter(s => s.toLowerCase().includes(lower)).slice(0, 5);

  if (matches.length === 0) {
    container.innerHTML = '';
    return;
  }

  const items = matches.map(name => {
    const icon = getMealIcon(name);
    return `<li class="suggestion-item" data-meal="${name.replace(/"/g, '&quot;')}">
      <span class="suggestion-icon">${icon}</span>
      <span class="suggestion-name">${name}</span>
    </li>`;
  }).join('');

  container.innerHTML = `<ul class="suggestion-list">${items}</ul>`;
}

function initMealAutocomplete() {
  const input = document.getElementById('meal-input');
  const container = document.getElementById('meal-suggestions');
  if (!input || !container) return;

  let suggestions = getMealSuggestions(loadData());

  function hideSuggestions() {
    container.innerHTML = '';
  }

  // Refresh suggestions when the input gains focus (covers new meals logged
  // since last focus) instead of on every keystroke, avoiding a loadData()
  // round-trip per character typed.
  input.addEventListener('focus', () => {
    suggestions = getMealSuggestions(loadData());
  });

  input.addEventListener('input', () => {
    renderMealSuggestions(input.value.trim(), suggestions);
  });

  input.addEventListener('blur', () => {
    // Small delay so tap on suggestion registers before hiding
    setTimeout(hideSuggestions, 200);
  });

  container.addEventListener('mousedown', (e) => {
    const item = e.target.closest('.suggestion-item');
    if (!item) return;
    e.preventDefault(); // Prevent blur from firing first

    const meal = item.getAttribute('data-meal');
    input.value = meal;
    hideSuggestions();

    // Auto-submit
    const form = document.getElementById('meal-form');
    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
  });
}

function init() {
  const data = loadData();

  // Nighttime visual shift after 9pm
  if (new Date().getHours() >= 21) {
    document.getElementById('app').classList.add('nighttime');
    document.querySelector('.sun-face').textContent = '🌙';
  }

  createBgElements();
  renderAffirmation();
  renderGreeting(data);
  renderStats(data);
  renderTodayMeals(data);
  renderGarden(data);
  renderAchievements(data, []);
  renderWeekly(data);
  renderInsights(data);
  renderAccordion(data);
  initCollapsibleSections(data);

  // Daily goal
  renderDailyGoal(data);
  const goalSelect = document.getElementById('goal-select');
  if (goalSelect) {
    goalSelect.value = String(getGoalSettings().dailyGoal);
    goalSelect.addEventListener('change', () => {
      const gs = getGoalSettings();
      gs.dailyGoal = parseInt(goalSelect.value, 10);
      saveGoalSettings(gs);
      renderDailyGoal(loadData());
      showToast(`Daily goal set to ${gs.dailyGoal} meals 🎯`);
    });
  }

  // Hydration tracker
  initHydration(data);

  // Meal reminder system
  checkMealReminder(data);
  setInterval(() => checkMealReminder(), 60000);

  // Dismiss reminder button
  document.getElementById('reminder-dismiss').addEventListener('click', () => {
    reminderDismissed = true;
    document.getElementById('meal-reminder').classList.add('hidden');
  });

  // Share garden button
  document.getElementById('share-btn').addEventListener('click', shareGarden);

  // Meal autocomplete
  initMealAutocomplete();

  // Mood check-in
  initMoodPrompt();

  // Push notifications
  initNotifications();

  // iOS install prompt
  const iosRow = document.getElementById('ios-install-row');
  const iosBtn = document.getElementById('ios-install-btn');
  if (iosRow && iosBtn) {
    if (isIOSSafari() && !isStandaloneMode()) {
      iosRow.classList.remove('hidden');
      iosBtn.addEventListener('click', () => {
        showToast('Tap the Share button in Safari, then select "Add to Home Screen" 📲');
      });
    } else {
      iosRow.classList.add('hidden');
    }
  }

  // Changelog toggle
  const versionBtn = document.getElementById('version-btn');
  const changelog = document.getElementById('changelog');
  const changelogClose = document.getElementById('changelog-close');
  if (versionBtn && changelog) {
    versionBtn.addEventListener('click', () => changelog.classList.toggle('hidden'));
    if (changelogClose) {
      changelogClose.addEventListener('click', () => changelog.classList.add('hidden'));
    }
  }

  // Shared meal-logging handler
  const form = document.getElementById('meal-form');
  const input = document.getElementById('meal-input');
  const btn = document.getElementById('plant-btn');

  function logMeal(name) {
    const preData = loadData();
    const oldTotal = preData.totalMeals || 0;
    const data = addMeal(name, preData);
    haptic();
    handlePostMeal(data, oldTotal);
  }

  // Form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;

    btn.classList.add('sparkle');
    setTimeout(() => btn.classList.remove('sparkle'), 600);

    logMeal(val);

    const plants = loadData().gardenPlants || [];
    if (plants.length > 0) {
      const btnText = btn.querySelector('.btn-text');
      const planted = plants[plants.length - 1].emoji;
      btnText.textContent = `${planted} Planted!`;
      setTimeout(() => { btnText.textContent = 'Plant it! 🌱'; }, 1000);
    }

    input.value = '';
    document.getElementById('meal-suggestions').innerHTML = '';
    input.focus();
  });

  // Quick picks
  document.querySelectorAll('.quick-pick').forEach(pick => {
    pick.addEventListener('click', () => {
      logMeal(pick.getAttribute('data-meal'));
    });
  });
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  init();

  // First-visit welcome overlay
  if (!localStorage.getItem(STORAGE_KEY)) {
    const overlay = document.getElementById('welcome-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
      const dismiss = () => {
        if (overlay.classList.contains('hidden')) return;
        overlay.classList.add('fade-out');
        setTimeout(() => overlay.classList.add('hidden'), 400);
        clearTimeout(autoTimer);
      };
      const quickDismiss = () => {
        overlay.classList.add('hidden');
        clearTimeout(autoTimer);
      };
      document.addEventListener('keydown', quickDismiss, { once: true });
      document.getElementById('welcome-dismiss').addEventListener('click', dismiss);
      const autoTimer = setTimeout(dismiss, 5000);
    }
  }
});
