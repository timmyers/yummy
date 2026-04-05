#!/usr/bin/env node
/**
 * Yummy Garden — End-to-end smoke test
 *
 * Launches a headless browser, serves the app locally, and simulates
 * a real user session: logging meals, checking the garden grows,
 * verifying achievements unlock, and testing UI interactions.
 *
 * Usage: node test-e2e.js
 * Exit 0 = all passed, Exit 1 = failures
 */

const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9222;
const BASE = `http://localhost:${PORT}`;

// Simple static file server
function startServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
  };

  const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server));
  });
}

// Test helpers
let passed = 0;
let failed = 0;
const wait = (ms) => new Promise(r => setTimeout(r, ms));

function assert(condition, name) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}`);
    failed++;
  }
}

async function run() {
  console.log('\n🌸 Yummy Garden E2E Tests\n');

  const server = await startServer();
  const browser = await puppeteer.launch({ headless: 'shell' });
  const page = await browser.newPage();
  await page.setViewport({ width: 414, height: 896 }); // iPhone-ish

  try {
    // ===== Page Load =====
    console.log('📱 Page Load');
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });

    const title = await page.title();
    assert(title.includes('Yummy Garden'), 'Page title contains "Yummy Garden"');

    const h1 = await page.$eval('header h1', el => el.textContent);
    assert(h1.includes('Yummy Garden'), 'Header shows app name');

    const greeting = await page.$eval('#greeting', el => el.textContent);
    assert(greeting.length > 0, 'Greeting is displayed');

    // ===== Daily Affirmation =====
    console.log('\n✨ Daily Affirmation');

    const affirmationSection = await page.$('#affirmation-banner');
    assert(affirmationSection !== null, 'Affirmation banner section exists');

    const affirmationText = await page.$eval('#affirmation-text', el => el.textContent);
    assert(affirmationText.length > 0, 'Affirmation contains text content');

    // ===== Initial State =====
    console.log('\n🌱 Initial State');

    const emptyState = await page.$eval('#today-meals', el => el.textContent);
    assert(emptyState.includes('Nothing yet'), 'Empty state shows when no meals logged');

    const streakText = await page.$eval('#streak-label', el => el.textContent);
    assert(streakText.includes('0'), 'Streak starts at 0');

    const totalText = await page.$eval('#total-meals', el => el.textContent);
    assert(totalText.includes('0'), 'Total meals starts at 0');

    // ===== Log a Meal via Text Input =====
    console.log('\n🍓 Log Meal — Text Input');

    await page.type('#meal-input', 'Strawberry smoothie');
    await page.click('#plant-btn');
    await wait(500);

    const meal1 = await page.$eval('#today-meals', el => el.textContent);
    assert(meal1.includes('Strawberry smoothie'), 'Typed meal appears in today\'s list');

    const total1 = await page.$eval('#total-meals', el => el.textContent);
    assert(total1.includes('1'), 'Total meals incremented to 1');

    const flowers1 = await page.$eval('#flower-count', el => el.textContent);
    assert(flowers1.includes('1'), 'Garden has 1 flower');

    // ===== Log a Meal via Quick Pick =====
    console.log('\n🫐 Log Meal — Quick Pick');

    await page.click('.quick-pick[data-meal="🫐 Blueberries"]');
    await wait(500);

    const meal2 = await page.$eval('#today-meals', el => el.textContent);
    assert(meal2.includes('Blueberries'), 'Quick pick meal appears in today\'s list');

    const total2 = await page.$eval('#total-meals', el => el.textContent);
    assert(total2.includes('2'), 'Total meals incremented to 2');

    // ===== Garden Growth =====
    console.log('\n🌺 Garden Growth');

    const plantCount = await page.$$eval('#garden-plots .garden-plant', els => els.length);
    assert(plantCount === 2, `Garden has 2 plants (got ${plantCount})`);

    // ===== Log a 3rd Meal (default goal) =====
    console.log('\n🎯 Daily Goal');

    await page.click('.quick-pick[data-meal="🥭 Mango"]');
    await wait(1000);

    const total3 = await page.$eval('#total-meals', el => el.textContent);
    assert(total3.includes('3'), 'Total meals is 3');

    // ===== Achievements =====
    console.log('\n🏆 Achievements');

    const badges = await page.$$eval('.badge-item', els =>
      els.map(el => ({
        unlocked: el.classList.contains('unlocked'),
        text: el.textContent,
      }))
    );

    const firstBloom = badges.find(b => b.text.includes('First Bloom'));
    assert(firstBloom && firstBloom.unlocked, '"First Bloom" badge is unlocked');

    const lockedBadges = badges.filter(b => !b.unlocked);
    assert(lockedBadges.length > 0, 'Some badges are still locked');

    // ===== Weekly View =====
    console.log('\n🌈 Weekly View');

    const weekDays = await page.$$eval('.week-day', els => els.length);
    assert(weekDays === 7, 'Weekly grid shows 7 days');

    const todayDay = await page.$('.week-day.today');
    assert(todayDay !== null, 'Today is highlighted in weekly view');

    // ===== Garden Seasons =====
    console.log('\n🌿 Garden Seasons');

    const seasonLabel = await page.$('#season-label');
    assert(seasonLabel !== null, 'Season label element exists');

    const seasonText = await page.$eval('#season-label', el => el.textContent);
    assert(seasonText.includes('Spring'), 'Season label shows Spring initially (3 meals)');

    const gardenHasSeasonClass = await page.$eval('#garden', el =>
      el.classList.contains('season-spring') || el.classList.contains('season-summer') ||
      el.classList.contains('season-autumn') || el.classList.contains('season-winter')
    );
    assert(gardenHasSeasonClass, 'Garden has a season CSS class applied');

    // ===== History Section =====
    console.log('\n🌿 Meal History');

    const historySection = await page.$('.history-card');
    assert(historySection !== null, 'History card exists');

    const accordionItems = await page.$$eval('.accordion-item', els => els.length);
    assert(accordionItems === 7, 'History shows 7 days');

    // ===== Share Button =====
    console.log('\n💌 Share Feature');

    const shareBtn = await page.$('#share-btn');
    assert(shareBtn !== null, 'Share button exists');

    // ===== Settings =====
    console.log('\n🔔 Settings');

    const notifToggle = await page.$('#notif-toggle');
    assert(notifToggle !== null, 'Notification toggle exists');

    const goalSelect = await page.$('#goal-select, #notif-interval');
    assert(goalSelect !== null, 'Settings selectors exist');

    // ===== Responsive =====
    console.log('\n📐 Responsive');

    await page.setViewport({ width: 375, height: 667 }); // iPhone SE
    await wait(200);
    const smallGarden = await page.$eval('#garden', el => el.offsetHeight);
    assert(smallGarden > 0 && smallGarden <= 250, `Garden resizes on small screen (${smallGarden}px)`);

    // ===== LocalStorage Persistence =====
    console.log('\n💾 Data Persistence');

    const storedData = await page.evaluate(() => {
      const raw = localStorage.getItem('yummy-garden-data');
      return JSON.parse(raw);
    });
    assert(storedData.totalMeals === 3, 'localStorage has correct total meals');
    assert(storedData.gardenPlants.length === 3, 'localStorage has correct plant count');
    assert(Object.keys(storedData.meals).length === 1, 'localStorage has today\'s meals');

    // ===== Reload Persistence =====
    console.log('\n🔄 Reload Persistence');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await wait(300);

    const reloadTotal = await page.$eval('#total-meals', el => el.textContent);
    assert(reloadTotal.includes('3'), 'Data persists after reload');

    const reloadMeals = await page.$eval('#today-meals', el => el.textContent);
    assert(reloadMeals.includes('Strawberry smoothie'), 'Meals persist after reload');

    // ===== Hydration Tracker =====
    console.log('\n💧 Hydration Tracker');

    const hydrationSection = await page.$('#hydration-tracker');
    assert(hydrationSection !== null, 'Hydration tracker section exists');

    const dropsBefore = await page.$$eval('#hydration-drops .water-drop.filled', els => els.length);
    assert(dropsBefore === 0, 'No drops filled initially');

    const labelBefore = await page.$eval('#hydration-label', el => el.textContent);
    assert(labelBefore.includes('0/8'), 'Label shows 0/8 initially');

    // Tap the 3rd water drop (index 2) — should fill drops 0, 1, 2
    await page.click('.water-drop[data-index="2"]');
    await wait(300);

    const dropsAfter = await page.$$eval('#hydration-drops .water-drop.filled', els => els.length);
    assert(dropsAfter === 3, `Tapping 3rd drop fills 3 drops (got ${dropsAfter})`);

    const labelAfter = await page.$eval('#hydration-label', el => el.textContent);
    assert(labelAfter.includes('3/8'), 'Label updates to 3/8 after tapping');

    // Tap a filled drop to unfill — tap index 1, should set count to 1
    await page.click('.water-drop[data-index="1"]');
    await wait(300);

    const dropsUnfill = await page.$$eval('#hydration-drops .water-drop.filled', els => els.length);
    assert(dropsUnfill === 1, `Tapping filled drop unfills correctly (got ${dropsUnfill})`);

    const labelUnfill = await page.$eval('#hydration-label', el => el.textContent);
    assert(labelUnfill.includes('1/8'), 'Label updates to 1/8 after unfilling');

    // ===== Mood Check-in =====
    console.log('\n😊 Mood Check-in');

    // Clear localStorage and reload to get a clean state for mood tests
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await wait(300);

    // Log a meal and check that mood prompt appears (delayed after celebration)
    await page.type('#meal-input', 'Avocado toast');
    await page.click('#plant-btn');
    await wait(3500);

    const moodPromptVisible = await page.$eval('#mood-prompt', el => !el.classList.contains('hidden'));
    assert(moodPromptVisible, 'Mood prompt appears after logging a meal');

    // Tap a mood emoji and check it dismisses
    await page.click('.mood-btn[data-mood="great"]');
    await wait(500);

    const moodPromptHidden = await page.$eval('#mood-prompt', el => el.classList.contains('hidden'));
    assert(moodPromptHidden, 'Mood prompt dismisses after selecting a mood');

    // Check mood emoji appears in the meal list
    const mealListHtml = await page.$eval('#today-meals', el => el.innerHTML);
    assert(mealListHtml.includes('😊'), 'Mood emoji appears next to meal in today\'s list');

    // Test mood prompt with quick pick and skip (delayed after celebration)
    await page.click('.quick-pick[data-meal="🍓 Strawberries"]');
    await wait(3500);

    const moodPromptVisible2 = await page.$eval('#mood-prompt', el => !el.classList.contains('hidden'));
    assert(moodPromptVisible2, 'Mood prompt appears after quick pick meal');

    await page.click('#mood-skip');
    await wait(300);

    const moodPromptHidden2 = await page.$eval('#mood-prompt', el => el.classList.contains('hidden'));
    assert(moodPromptHidden2, 'Mood prompt dismisses after clicking skip');

  } catch (err) {
    console.error('\n💥 Test error:', err.message);
    failed++;
  } finally {
    await browser.close();
    server.close();
  }

  // Summary
  console.log(`\n${'─'.repeat(40)}`);
  console.log(`  🌸 Results: ${passed} passed, ${failed} failed`);
  console.log(`${'─'.repeat(40)}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

run();
