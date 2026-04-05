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
  return { meals: {}, gardenPlants: [], totalMeals: 0 };
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

// ===== Event Handlers =====

function init() {
  const data = loadData();

  createBgElements();
  renderGreeting(data);
  renderStats(data);
  renderTodayMeals(data);
  renderGarden(data);
  renderWeekly(data);

  // Meal reminder system
  checkMealReminder();
  setInterval(checkMealReminder, 60000);

  // Dismiss reminder button
  document.getElementById('reminder-dismiss').addEventListener('click', dismissReminder);

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
    celebrate(data);
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
      celebrate(data);
    });
  });
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
