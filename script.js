const body = document.body;
const menuToggles = document.querySelectorAll('.menu-toggle');
const menuOverlay = document.querySelector('.menu-overlay');
const sideMenu = document.querySelector('.side-menu');
const menuCloses = document.querySelectorAll('.menu-close');
const menuLinks = document.querySelectorAll('.menu-list a, .bottom-nav__link');
const caseDetail = document.querySelector('.case-detail');
const caseClose = document.querySelector('.case-back');
const casePriceEl = document.querySelector('.case-detail__open');
const caseSellEl = document.querySelector('.case-detail__sell');
const caseIconEl = document.querySelector('.case-detail__icon');
const brandItems = document.querySelectorAll('.brand');
const menuLoginBtn = document.querySelector('.menu-login');
const authModal = document.querySelector('.auth-modal');
const authCloseBtn = document.querySelector('.auth-modal__close');
const authBackdrop = document.querySelector('[data-close-auth]');
const authCheckboxes = document.querySelectorAll('.auth-modal__checkbox');
const authSubmit = document.querySelector('.auth-modal__submit');
const loginModal = document.querySelector('.login-modal');
const loginCloseBtn = document.querySelector('.login-modal__close');
const loginBackdrop = document.querySelector('[data-close-login]');
const loginForm = document.querySelector('.login-modal__form');
const loginUsernameInput = document.querySelector('.login-modal__field input');
const loginError = document.querySelector('.login-modal__error');
const registerModal = document.querySelector('.register-modal');
const registerCloseBtn = document.querySelector('.register-modal__close');
const registerBackdrop = document.querySelector('[data-close-register]');
const registerForm = document.querySelector('.register-modal__form');
const registerError = document.querySelector('.register-modal__error');
const authRegisterBtn = document.querySelector('.auth-modal__register');
const menuProfile = document.querySelector('.menu-profile');
const menuProfileAction = document.querySelector('.menu-profile__action');
const menuProfileName = document.querySelector('.menu-profile__name');
const menuProfileBalance = document.querySelector('.menu-profile__balance');
const menuProfileTopup = document.querySelector('.menu-profile__topup');
const menuProfileAvatar = document.querySelector('.menu-profile__avatar');
const profileShortcutAvatar = document.querySelector('.profile-shortcut__avatar');
const profileScreen = document.querySelector('.profile-screen');
const profileSettingsBtn = document.querySelector('.profile-screen__tool');
const settingsModal = document.querySelector('.settings-modal');
const settingsCloseBtn = document.querySelector('.settings-modal__close');
const settingsBackdrop = document.querySelector('[data-close-settings]');
const settingsSubmit = document.querySelector('.settings-modal__submit');
const streamerToggle = document.querySelector('.settings-modal__toggle');
const topupModal = document.querySelector('.topup-modal');
const topupCloseBtn = document.querySelector('.topup-modal__close');
const topupBackdrop = document.querySelector('[data-close-topup]');
const profileInventory = document.querySelector('#profile-inventory');
const profileScreenName = document.querySelector('.profile-screen__name');
const profileScreenId = document.querySelector('.profile-screen__id');
const profileScreenAvatar = document.querySelector('.profile-screen__avatar');
const profileScreenBalance = document.querySelector('.profile-screen__balance-value');
const profileScreenTopup = document.querySelector('.profile-screen__topup');
const profileScreenWithdraw = document.querySelector('.profile-screen__withdraw');
const profileScreenLogout = document.querySelector('.profile-screen__logout');
const bottomNav = document.querySelector('.bottom-nav');
const upgradeScreen = document.querySelector('.upgrade-screen');
const upgradeCloseBtn = document.querySelector('.upgrade-screen__close');
const liveFeedEl = document.querySelector('.live-cards');
const STORAGE_KEY = 'cb_users';
const ACTIVE_USER_KEY = 'cb_active_user';
const CASE_SECTIONS_KEY = 'cb_case_sections';
const STREAMER_MODE_KEY = 'cb_streamer_mode';
const ONLINE_SESSION_KEY = 'cb_online_session_id';
const ONLINE_TIMEOUT_MS = 45 * 1000;
const onlineCountEls = document.querySelectorAll('.menu-online__count');
let onlineHeartbeatId = null;
let onlineRefreshId = null;
let liveFeedItems = [];
if (localStorage.getItem(STREAMER_MODE_KEY) === 'true') {
  body.classList.add('streamer-mode');
}
const SUPABASE_URL = 'https://piojsbikexnwrhatujlf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_O8p2MUxMNX1rp8VCgo025g_E1Cx-cAL';
const supabaseClient = typeof supabase !== 'undefined'
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
let lastSupabaseError = '';

function getOnlineSessionId() {
  let sessionId = localStorage.getItem(ONLINE_SESSION_KEY);
  if (!sessionId) {
    sessionId = typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(ONLINE_SESSION_KEY, sessionId);
  }
  return sessionId;
}

function renderOnlineCount(count) {
  onlineCountEls.forEach((element) => {
    element.textContent = Number(count || 0).toLocaleString('ru-RU');
  });
}

async function updateOnlineStatus() {
  if (!supabaseClient) {
    return;
  }

  const sessionId = getOnlineSessionId();
  const now = new Date().toISOString();
  const { error: heartbeatError } = await supabaseClient
    .from('online_sessions')
    .upsert({ id: sessionId, last_seen: now }, { onConflict: 'id' });

  if (heartbeatError) {
    console.warn('Online status is unavailable:', heartbeatError.message);
    return;
  }

  const cutoff = new Date(Date.now() - ONLINE_TIMEOUT_MS).toISOString();
  const { count, error: countError } = await supabaseClient
    .from('online_sessions')
    .select('id', { count: 'exact', head: true })
    .gte('last_seen', cutoff);

  if (!countError) {
    renderOnlineCount(count);
  }
}

function startOnlineStatus() {
  void updateOnlineStatus();
  onlineHeartbeatId = window.setInterval(() => void updateOnlineStatus(), 15000);
  onlineRefreshId = window.setInterval(() => void updateOnlineStatus(), 30000);
}

startOnlineStatus();

const loginProfileIcon = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M13 2C10.2386 2 8 4.23858 8 7C8 7.55228 8.44772 8 9 8C9.55228 8 10 7.55228 10 7C10 5.34315 11.3431 4 13 4H17C18.6569 4 20 5.34315 20 7V17C20 18.6569 18.6569 20 17 20H13C11.3431 20 10 18.6569 10 17C10 16.4477 9.55228 16 9 16C8.44772 16 8 16.4477 8 17C8 19.7614 10.2386 22 13 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2H13Z" fill="currentColor"/>
    <path d="M3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H11.2821C11.1931 13.1098 11.1078 13.2163 11.0271 13.318C10.7816 13.6277 10.5738 13.8996 10.427 14.0945C10.3536 14.1921 10.2952 14.2705 10.255 14.3251L10.2084 14.3884L10.1959 14.4055L10.1915 14.4115C9.86687 14.8583 9.96541 15.4844 10.4122 15.809C10.859 16.1336 11.4843 16.0346 11.809 15.5879L11.8118 15.584L11.822 15.57L11.8638 15.5132C11.9007 15.4632 11.9553 15.3897 12.0247 15.2975C12.1637 15.113 12.3612 14.8546 12.5942 14.5606C13.0655 13.9663 13.6623 13.2519 14.2071 12.7071L14.9142 12L14.2071 11.2929C13.6623 10.7481 13.0655 10.0337 12.5942 9.43937C12.3612 9.14542 12.1637 8.88702 12.0247 8.7025C11.9553 8.61033 11.9007 8.53682 11.8638 8.48679L11.822 8.43002L11.8118 8.41602L11.8095 8.41281C11.4848 7.96606 10.859 7.86637 10.4122 8.19098C9.96541 8.51561 9.86636 9.14098 10.191 9.58778L11 9C10.191 9.58778 10.1909 9.58773 10.191 9.58778L10.1925 9.58985L10.1959 9.59454L10.2084 9.61162L10.255 9.67492C10.2952 9.72946 10.3536 9.80795 10.427 9.90549C10.5738 10.1004 10.7816 10.3723 11.0271 10.682C11.1078 10.7837 11.1931 10.8902 11.2821 11H3Z" fill="currentColor"/>
  </svg>`;

const scrollTargets = [window, profileScreen, upgradeScreen].filter(Boolean);
const lastScrollPositions = new WeakMap();

scrollTargets.forEach((target) => {
  lastScrollPositions.set(target, target === window ? window.scrollY : target.scrollTop);

  target.addEventListener('scroll', () => {
    const currentScrollY = target === window ? window.scrollY : target.scrollTop;
    const lastScrollY = lastScrollPositions.get(target) || 0;
    const scrollDelta = currentScrollY - lastScrollY;

    if (!bottomNav || Math.abs(scrollDelta) < 8) {
      return;
    }

    if (currentScrollY <= 8 || scrollDelta < 0) {
      bottomNav.classList.remove('is-hidden');
    } else {
      bottomNav.classList.add('is-hidden');
    }

    lastScrollPositions.set(target, currentScrollY);
  }, { passive: true });
});

function resolveAssetPath(path) {
  const value = String(path || '').trim();
  if (/^(https?:|data:|blob:)/i.test(value)) {
    return value;
  }

  const normalized = value.replace(/^\.?\/(https?:\/\/)/i, '$1').replace(/^\.?\//, '');
  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  const base = window.location.pathname.includes('/test123') ? '/test123/' : './';
  return `${base}${normalized}`;
}

const REMOTE_SKIN_IMAGES = {
  gray: 'https://jabka.to/cdn/items/18866/large.webp',
  blue: 'https://jabka.to/cdn/items/18866/large.webp',
  green: 'https://jabka.to/cdn/items/18593/large.webp',
  red: 'https://jabka.to/cdn/items/614/large.webp',
  purple: 'https://jabka.to/cdn/items/20537/large.webp',
  pink: 'https://jabka.to/cdn/items/20537/large.webp',
  gold: 'https://jabka.to/cdn/items/614/large.webp'
};

const DEFAULT_REMOTE_CASE_IMAGE = 'https://jabka.to/cdn/items/18866/large.webp';

const DEFAULT_CASE_SECTIONS = [];
let remoteCaseSections = [];

function ensureDefaultCaseSections() {
  try {
    const raw = localStorage.getItem(CASE_SECTIONS_KEY);
    if (!raw) {
      localStorage.setItem(CASE_SECTIONS_KEY, '[]');
    }
  } catch (error) {
    // ignore localStorage issues in restricted browsers
  }
}

function getCaseSections() {
  return remoteCaseSections;
}

function renderHomeCaseSections() {
  const titleEl = document.querySelector('.section-title h2');
  const casesRow = document.querySelector('.cases-row');
  if (!casesRow) {
    return;
  }

  const sections = getCaseSections();
  const activeSection = sections[0] || null;

  if (titleEl && activeSection.name) {
    titleEl.textContent = activeSection.name;
  }

  casesRow.innerHTML = sections.map((section) => `
    <section class="home-case-group">
      ${section === activeSection ? '' : `<h3 class="home-case-group__title">${section.name}</h3>`}
      <div class="home-case-group__cards">
        ${(section.cases || []).map((item) => `
          <article class="case-card ${item.rarity ? `case-card--${item.rarity}` : ''}">
            <div class="case-card__image-wrap">
              <img src="${resolveAssetPath(item.image || DEFAULT_REMOTE_CASE_IMAGE)}" alt="${item.name}" />
            </div>
            <button type="button" data-case-id="${item.id || ''}" data-case-name="${item.name}" data-case-price="${formatPrice(Number(item.price || 0))}" data-case-payout-chance="${Number(item.payoutChance ?? 25)}" data-case-image="${resolveAssetPath(item.image || DEFAULT_REMOTE_CASE_IMAGE)}"><span>${item.name}</span><span class="case-button__separator" aria-hidden="true"></span><strong>${formatPrice(Number(item.price || 0))}</strong></button>
          </article>
        `).join('')}
      </div>
    </section>
  `).join('');

  bindCaseCardEvents();
}

ensureDefaultCaseSections();
renderHomeCaseSections();

async function loadRemoteCaseSections() {
  if (!supabaseClient) {
    return;
  }

  const [{ data: groups, error: groupsError }, { data: remoteCases, error: casesError }] = await Promise.all([
    supabaseClient.from('case_groups').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    supabaseClient.from('cases').select('*').eq('is_active', true).order('sort_order', { ascending: true })
  ]);

  if (groupsError || casesError || !groups?.length) {
    remoteCaseSections = [];
    renderHomeCaseSections();
    return;
  }

  const remoteSections = groups.map((group) => ({
    id: group.id,
    name: group.title,
    cases: (remoteCases || [])
      .filter((item) => item.group_id === group.id)
      .map((item) => ({
        id: item.id,
        name: item.title,
        price: Number(item.price || 0),
        payoutChance: Number(item.payout_chance ?? 25),
        image: item.image_url || DEFAULT_REMOTE_CASE_IMAGE
      }))
  }));

  if (remoteSections.length) {
    remoteCaseSections = remoteSections;
    renderHomeCaseSections();
  }
}

void loadRemoteCaseSections();

/* =========================================
   CASE ROLL — чистая анимация
   Фон полностью прозрачный
========================================= */

const CASE_CONFIG = {
  duration: 3200,
  winnerIndex: 70,
  itemWidth: 150,
  gap: 10
};

let availableSkins = [];
let activeCaseId = null;
let activeCaseSkins = [];

const reel = document.getElementById('caseReel');
const container = document.getElementById('caseRoll');

let items = [];
let currentPosition = 0;
let isRolling = false;
let focusFrameId = null;
let rollTimeoutId = null;
let rollSoundFrameId = null;
let lastRollSoundItemIndex = -1;
let caseRollSoundStartedAt = 0;
let rollAudioContext = null;
let activeCasePrice = '1 337.90 ₽';
let activeCasePayoutChance = 25;
let lastDroppedItem = null;
let pendingCaseReward = null;

function prepareCaseRollAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  if (!rollAudioContext) {
    rollAudioContext = new AudioContextClass();
  }

  if (rollAudioContext.state === 'suspended') {
    void rollAudioContext.resume();
  }

  return rollAudioContext;
}

function playCaseRollTick() {
  const audioContext = prepareCaseRollAudio();
  if (!audioContext) {
    return;
  }

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(155, now);
  oscillator.frequency.exponentialRampToValueAtTime(85, now + 0.032);
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(380, now);
  filter.Q.setValueAtTime(0.7, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.028, now + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);
  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.045);
}

function getCaseRollCenterItemIndex() {
  if (!container || !items.length) {
    return -1;
  }

  const center = container.getBoundingClientRect().left + container.clientWidth / 2;
  return items.findIndex(({ element }) => {
    const rect = element.getBoundingClientRect();
    return center >= rect.left && center <= rect.right;
  });
}

function trackCaseRollSound() {
  if (!isRolling) {
    rollSoundFrameId = null;
    return;
  }

  const currentItemIndex = getCaseRollCenterItemIndex();
  if (currentItemIndex >= 0 && currentItemIndex !== lastRollSoundItemIndex) {
    lastRollSoundItemIndex = currentItemIndex;
    if (performance.now() - caseRollSoundStartedAt >= 100) {
      playCaseRollTick();
    }
  }

  rollSoundFrameId = window.requestAnimationFrame(trackCaseRollSound);
}

function stopCaseRollSoundTracking() {
  if (rollSoundFrameId) {
    window.cancelAnimationFrame(rollSoundFrameId);
    rollSoundFrameId = null;
  }
  lastRollSoundItemIndex = -1;
  caseRollSoundStartedAt = 0;
}

function playUpgradeTick() {
  const audioContext = prepareCaseRollAudio();
  if (!audioContext) {
    return;
  }

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(145, now);
  oscillator.frequency.exponentialRampToValueAtTime(75, now + 0.018);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.028, now + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.026);
}

function playUpgradeResultSound(won) {
  const audioContext = prepareCaseRollAudio();
  if (!audioContext) {
    return;
  }

  const now = audioContext.currentTime;
  const notes = won ? [260, 390, 520] : [180, 120];
  notes.forEach((frequency, index) => {
    const start = now + index * (won ? 0.075 : 0.09);
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(won ? 0.06 : 0.045, start + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + (won ? 0.12 : 0.14));
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + (won ? 0.13 : 0.15));
  });
}

function getUpgradeVisualAngle() {
  const transform = window.getComputedStyle(upgradeScreenEls.arrowOrbit).transform;
  const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
  const matrix3dMatch = transform.match(/matrix3d\(([^)]+)\)/);
  if (!matrixMatch) {
    if (!matrix3dMatch) {
      return null;
    }

    const values3d = matrix3dMatch[1].split(',').map(Number);
    if (!Number.isFinite(values3d[0]) || !Number.isFinite(values3d[1])) {
      return null;
    }

    return normalizeUpgradeAngle(Math.atan2(values3d[1], values3d[0]) * (180 / Math.PI));
  }

  const values = matrixMatch[1].split(',').map(Number);
  if (!Number.isFinite(values[0]) || !Number.isFinite(values[1])) {
    return null;
  }

  return normalizeUpgradeAngle(Math.atan2(values[1], values[0]) * (180 / Math.PI));
}

function trackUpgradeSound() {
  if (!upgradeScreenSpinning) {
    upgradeSoundFrameId = null;
    return;
  }

  const currentAngle = getUpgradeVisualAngle();
  if (currentAngle !== null) {
    if (lastUpgradeSoundAngle === null) {
      lastUpgradeSoundAngle = currentAngle;
    } else if (Math.floor(lastUpgradeSoundAngle / 24) !== Math.floor(currentAngle / 24)) {
      const now = performance.now();
      if (now - lastUpgradeTickTime >= 45) {
        playUpgradeTick();
        lastUpgradeTickTime = now;
      }
      lastUpgradeSoundAngle = currentAngle;
    }

  }

  upgradeSoundFrameId = window.requestAnimationFrame(trackUpgradeSound);
}

function stopUpgradeSoundTracking() {
  if (upgradeSoundFrameId) {
    window.cancelAnimationFrame(upgradeSoundFrameId);
    upgradeSoundFrameId = null;
  }
  lastUpgradeSoundAngle = null;
  lastUpgradeTickTime = 0;
}

function createReel() {
  if (!reel) {
    return;
  }

  reel.innerHTML = '';
  items = [];

  for (let i = 0; i < 100; i += 1) {
    const baseSkinPool = activeCaseSkins.length ? activeCaseSkins : availableSkins;
    const skinPool = baseSkinPool;
    if (!skinPool.length) {
      return;
    }
    const totalChance = skinPool.reduce((sum, item) => sum + Math.max(0, Number(item.dropChance || 0)), 0);
    let randomChance = Math.random() * (totalChance || skinPool.length);
    const skin = skinPool.find((item) => {
      randomChance -= totalChance ? Math.max(0, Number(item.dropChance || 0)) : 1;
      return randomChance <= 0;
    }) || skinPool[skinPool.length - 1];
    const element = document.createElement('div');
    element.className = `case-roll__item ${skin.rarity}`;
    element.innerHTML = `
      <img
        src="${skin.image}"
        draggable="false"
        alt="${skin.name}"
      >
    `;

    reel.appendChild(element);
    items.push({ element, skin });
  }
}

async function loadCaseContents(caseId) {
  if (!caseId || !supabaseClient) {
    activeCaseSkins = [];
    renderCaseContents(activeCaseSkins);
    if (casePriceEl) {
      casePriceEl.disabled = false;
    }
    return;
  }

  const { data, error } = await supabaseClient
    .from('case_items')
    .select('drop_chance, items (title, rarity, price, image_url)')
    .eq('case_id', caseId);

  if (error || !data?.length) {
    activeCaseSkins = [];
    renderCaseContents(activeCaseSkins);
    if (casePriceEl) {
      casePriceEl.disabled = false;
    }
    return;
  }

  activeCaseSkins = data.map((row) => row.items ? ({
    name: row.items.title,
    rarity: row.items.rarity || 'gray',
    price: Number(row.items.price || 0),
    dropChance: Number(row.drop_chance || 0),
    image: resolveAssetPath(row.items.image_url || getSkinImageByRarity(row.items.rarity || 'gray'))
  }) : null).filter(Boolean).sort((left, right) => right.price - left.price);
  renderCaseContents(activeCaseSkins);
  if (casePriceEl) {
    casePriceEl.disabled = false;
  }
}

function renderCaseContents(skins) {
  const list = document.querySelector('.case-detail__items');
  if (!list) {
    return;
  }

  const sortedSkins = [...(skins || [])].sort((left, right) => Number(right.price || 0) - Number(left.price || 0));
  list.innerHTML = sortedSkins.length ? sortedSkins.map((item) => `
    <div class="profile-screen__inventory-item case-detail__content-item">
      <div class="profile-screen__inventory-art ${item.rarity || 'gray'}">
        <div class="profile-screen__inventory-tag">${item.name}</div>
        <img src="${item.image || getSkinImageByRarity(item.rarity || 'gray')}" alt="${item.name}" draggable="false" />
        <div class="profile-screen__inventory-price">${formatPrice(item.price)}</div>
      </div>
    </div>
  `).join('') : '<div class="case-detail__empty">Содержимое кейса пока не настроено</div>';
}

function updateFocus() {
  if (!container || !items.length) {
    return;
  }

  const isCasePreview = caseDetail &&
    !caseDetail.classList.contains('case-opening') &&
    !caseDetail.classList.contains('case-result') &&
    body.classList.contains('case-modal-open');

  if (isCasePreview) {
    items.forEach((item) => {
      item.element.style.opacity = '0.45';
      item.element.style.transform = 'scale(1)';
      item.element.style.filter = 'brightness(0.45) saturate(0.55) blur(2.8px)';
    });
    focusFrameId = requestAnimationFrame(updateFocus);
    return;
  }

  const shouldStayClear = isRolling ||
    (caseDetail && caseDetail.classList.contains('case-opening'));

  if (shouldStayClear) {
    items.forEach((item) => {
      item.element.style.opacity = '1';
      item.element.style.transform = 'scale(1)';
      item.element.style.filter = 'brightness(1) saturate(1) blur(0px)';
    });
    return;
  }

  const containerRect = container.getBoundingClientRect();
  const center = containerRect.left + containerRect.width / 2;
  const radius = 140;

  items.forEach((item) => {
    const isWinner = item.element.classList.contains('is-winner');

    if (isWinner) {
      item.element.style.opacity = '1';
      item.element.style.transform = 'scale(1.08)';
      item.element.style.filter = 'brightness(1.08) saturate(1.08) blur(0px)';
      return;
    }

    const rect = item.element.getBoundingClientRect();
    const itemCenter = rect.left + rect.width / 2;
    const distance = Math.abs(itemCenter - center);

    if (distance <= radius) {
      item.element.style.opacity = '1';
      item.element.style.transform = 'scale(1)';
      item.element.style.filter = 'brightness(1) saturate(1) blur(0px)';
      return;
    }

    const fade = Math.min(1, (distance - radius) / 220);
    const opacity = 1 - fade * 0.55;
    const brightness = 1 - fade * 0.55;
    const saturation = 1 - fade * 0.45;
    const blur = 0.3 + fade * 2.5;

    item.element.style.opacity = String(Math.max(0.4, opacity));
    item.element.style.transform = 'scale(1)';
    item.element.style.filter = `brightness(${brightness}) saturate(${saturation}) blur(${blur}px)`;
  });

  focusFrameId = requestAnimationFrame(updateFocus);
}

function rollCase() {
  if (isRolling || !reel || !container) {
    return;
  }

  if (!activeCaseSkins.length) {
    return;
  }

  if (focusFrameId) {
    cancelAnimationFrame(focusFrameId);
    focusFrameId = null;
  }

  isRolling = true;
  stopCaseRollSoundTracking();

  items.forEach((item) => item.element.classList.remove('is-winner'));

  const caseUser = getActiveUser();
  const casePrice = parsePriceToNumber(activeCasePrice);
  const profitableIndexes = items
    .map((item, index) => Number(item.skin.price || 0) > casePrice ? index : -1)
    .filter((index) => index >= 0);
  const casePayoutChance = Math.max(0, Math.min(100, Number(activeCasePayoutChance ?? 25)));
  const effectivePayoutChance = getPlayerPayoutChance(caseUser, casePayoutChance);
  if (isPayoutSystemEnabled(caseUser) && effectivePayoutChance === 100 && !profitableIndexes.length) {
    isRolling = false;
    if (casePriceEl) casePriceEl.textContent = 'Нет окупаемого предмета';
    return;
  }
  const shouldPayOut = profitableIndexes.length &&
    Math.random() * 100 < effectivePayoutChance;
  const winnerPool = shouldPayOut
    ? profitableIndexes
    : isPayoutSystemEnabled(caseUser) && effectivePayoutChance === 100
      ? profitableIndexes
    : items.map((_, index) => index);
  const selectedWinnerIndex = winnerPool[Math.floor(Math.random() * winnerPool.length)];
  const winnerIndex = CASE_CONFIG.winnerIndex;
  const winner = items[winnerIndex];
  const serverReward = pendingCaseReward;
  winner.skin = serverReward || items[selectedWinnerIndex].skin;
  pendingCaseReward = null;
  lastDroppedItem = {
    name: winner.skin.name,
    price: Number(winner.skin.price || getItemPriceByRarity(winner.skin.rarity)),
    rarity: winner.skin.rarity,
    image: winner.skin.image
  };
  if (!serverReward) {
    addDroppedItemToInventory(lastDroppedItem);
  }
  winner.element.className = `case-roll__item ${winner.skin.rarity}`;
  winner.element.innerHTML = `
    <img src="${winner.skin.image}" draggable="false" alt="${winner.skin.name}">
  `;
  const containerWidth = container.clientWidth;
  const center = containerWidth / 2;
  const randomOffset = Math.random() * 20 - 10;
  const itemStep = CASE_CONFIG.itemWidth + CASE_CONFIG.gap;
  let targetPosition =
    winnerIndex * itemStep +
    CASE_CONFIG.itemWidth / 2 -
    center +
    randomOffset;

  if (Math.abs(targetPosition - currentPosition) < 30) {
    targetPosition += (Math.random() > 0.5 ? 1 : -1) * (itemStep * 3);
  }

  reel.style.transition = 'none';
  reel.style.transform = `translate3d(${-currentPosition}px, -50%, 0)`;
  void reel.offsetWidth;

  reel.style.transition = `transform ${CASE_CONFIG.duration}ms cubic-bezier(0.08, 0.72, 0.12, 1)`;

  let rollFinished = false;
  const finishRoll = () => {
    if (rollFinished) {
      return;
    }

    rollFinished = true;
    if (rollTimeoutId) {
      window.clearTimeout(rollTimeoutId);
      rollTimeoutId = null;
    }

    if (focusFrameId) {
      cancelAnimationFrame(focusFrameId);
      focusFrameId = null;
    }
    stopCaseRollSoundTracking();

    winner.element.classList.add('is-winner');
    winner.element.style.transform = 'scale(1.08)';
    winner.element.style.filter = 'brightness(1.08) saturate(1.08) blur(0px)';
    isRolling = false;
    caseDetail.classList.remove('case-opening');
    caseDetail.classList.add('case-result');

    setResultState(true, formatPrice(lastDroppedItem.price));
    document.querySelectorAll('.case-roll__circle, .case-roll__line').forEach((marker) => {
      marker.style.transition = 'none';
      marker.style.setProperty('opacity', '0', 'important');
      marker.style.setProperty('visibility', 'hidden', 'important');
    });
    casePriceEl.disabled = false;
    updateFocus();
  };

  reel.style.transform = `translate3d(${-currentPosition}px, -50%, 0)`;
  void reel.offsetWidth;
  window.requestAnimationFrame(() => {
    reel.style.transform = `translate3d(${-targetPosition}px, -50%, 0)`;
    caseRollSoundStartedAt = performance.now();
    lastRollSoundItemIndex = getCaseRollCenterItemIndex();
    rollSoundFrameId = window.requestAnimationFrame(trackCaseRollSound);
  });
  currentPosition = targetPosition;

  rollTimeoutId = window.setTimeout(finishRoll, CASE_CONFIG.duration + 250);
}

createReel();
renderLiveFeed();
updateFocus();

async function loadRemoteSkins() {
  if (!supabaseClient) {
    availableSkins = [];
    return;
  }

  const { data, error } = await supabaseClient
    .from('items')
    .select('title, rarity, price, image_url');

  if (error || !data?.length) {
    availableSkins = [];
    return;
  }

  availableSkins = data
    .filter((item) => item && item.is_active !== false)
    .map((item) => ({
    name: item.title,
    rarity: item.rarity || 'blue',
    price: Number(item.price || 0),
    image: resolveAssetPath(item.image_url || getSkinImageByRarity(item.rarity || 'blue'))
    }));

  const user = getActiveUser();
  if (user) {
    const imageByName = new Map(availableSkins.map((item) => [item.name, item.image]));
    user.inventory = getInventoryByUser(user).map((item) => ({
      ...item,
      image: item.image || imageByName.get(item.name) || getSkinImageByRarity(item.rarity || 'blue')
    }));
    if (user.bestDrop) {
      user.bestDrop = {
        ...user.bestDrop,
        image: user.bestDrop.image || imageByName.get(user.bestDrop.name) || getSkinImageByRarity(user.bestDrop.rarity || 'blue')
      };
    }
    saveActiveUser(user);
    renderProfileInventory();
  }
}

void loadRemoteSkins();

function parsePriceToNumber(value) {
  const normalized = String(value || '')
    .replace(/\s+/g, '')
    .replace(',', '.')
    .replace(/[^\d.]/g, '');

  if (!normalized) {
    return 0;
  }

  return Number(normalized) || 0;
}

function formatSupabaseRpcError(error, fallbackMessage) {
  if (!error) {
    return fallbackMessage;
  }

  const parts = [error.message, error.details, error.hint]
    .filter((part, index, values) => part && values.indexOf(part) === index);
  return parts.length ? `${fallbackMessage}: ${parts.join(' ')}` : fallbackMessage;
}

function setResultState(isResult, priceLabel = '1 337 ₽') {
  if (!caseDetail) {
    return;
  }

  caseDetail.classList.toggle('case-result', isResult);

  if (caseIconEl) {
    caseIconEl.hidden = true;
    caseIconEl.style.opacity = '0';
    caseIconEl.style.visibility = 'hidden';
    caseIconEl.style.display = 'none';
  }

  if (caseSellEl) {
    caseSellEl.hidden = !isResult;
    if (isResult) {
      const sellValue = parsePriceToNumber(priceLabel);
      caseSellEl.textContent = `Продать за ${formatPrice(sellValue)}`;
    }
  }

  if (casePriceEl) {
    casePriceEl.disabled = false;
    casePriceEl.textContent = isResult ? 'Открыть ещё раз' : `Открыть за ${priceLabel}`;
  }
}

function resetCaseToStartState() {
  if (!caseDetail) {
    return;
  }

  body.classList.add('case-modal-open');
  caseDetail.classList.remove('case-opening');
  caseDetail.classList.remove('case-result');
  caseDetail.classList.remove('case-opened');
  caseDetail.setAttribute('aria-hidden', 'false');

  if (caseSellEl) {
    caseSellEl.hidden = true;
  }

  if (caseIconEl) {
    caseIconEl.hidden = false;
    caseIconEl.style.opacity = '1';
    caseIconEl.style.visibility = 'visible';
    caseIconEl.style.display = 'block';
  }

  if (casePriceEl) {
    casePriceEl.hidden = false;
    casePriceEl.disabled = false;
    casePriceEl.textContent = `Открыть за ${activeCasePrice}`;
  }
}

async function triggerCaseOpenAction() {
  if (!casePriceEl || !caseDetail) {
    return;
  }

  prepareCaseRollAudio();
  await refreshActiveUserFromSupabase();
  const user = getActiveUser();
  if (!user) {
    closeCaseDetail();
    openAuthModal();
    return;
  }
  const caseCost = parsePriceToNumber(activeCasePrice || '0');
  const payoutChance = getPlayerPayoutChance(user, Math.max(0, Math.min(100, Number(activeCasePayoutChance ?? 25))));
  const caseSkinPool = activeCaseSkins.length ? activeCaseSkins : availableSkins;
  if (isPayoutSystemEnabled(user) && payoutChance === 100 && !caseSkinPool.some((item) => Number(item.price || 0) > caseCost)) {
    alert('В этом кейсе сейчас нет окупаемого предмета.');
    return;
  }

  if (supabaseClient && activeCaseId) {
    const { data: rewardData, error: rewardError } = await supabaseClient
      .rpc('open_case', { requested_case_id: activeCaseId });
    const reward = Array.isArray(rewardData) ? rewardData[0] : rewardData;
    if (rewardError || !reward) {
      alert(formatSupabaseRpcError(rewardError, 'Не удалось открыть кейс'));
      return;
    }
    user.balance = Number(reward.balance || 0);
    pendingCaseReward = {
      name: reward.name,
      price: Number(reward.price || 0),
      rarity: reward.rarity || 'blue',
      image: resolveAssetPath(reward.image || getSkinImageByRarity(reward.rarity || 'blue'))
    };
    saveActiveUser(user);
    addDroppedItemToInventory(pendingCaseReward, false);
    renderProfileBalance();
    updateProfileUI();
  } else if (user && caseCost > 0) {
    const currentBalance = clampBalance(user.balance);
    if (currentBalance < caseCost) {
      alert(`Недостаточно средств. Нужно ${formatPrice(caseCost)}.`);
      return;
    }

    user.balance = currentBalance - caseCost;
    saveActiveUser(user);
    void syncUserToSupabase(user);
    renderProfileBalance();
    updateProfileUI();
  }

  createReel();
  currentPosition = 0;
  reel.style.transition = 'none';
  reel.style.transform = 'translate3d(0, -50%, 0)';

  caseDetail.classList.remove('case-result');
  caseDetail.classList.remove('case-opening');
  void caseDetail.offsetWidth;
  caseDetail.classList.add('case-opening');
  caseDetail.classList.add('case-opened');

  document.querySelectorAll('.case-roll__circle, .case-roll__line').forEach((marker) => {
    marker.style.transition = 'none';
    marker.style.setProperty('opacity', '1', 'important');
    marker.style.setProperty('visibility', 'visible', 'important');
  });

  if (caseIconEl) {
    caseIconEl.hidden = true;
    caseIconEl.style.opacity = '0';
    caseIconEl.style.visibility = 'hidden';
    caseIconEl.style.display = 'none';
  }

  items.forEach((item) => {
    item.element.style.opacity = '1';
    item.element.style.transform = 'scale(1)';
    item.element.style.filter = 'brightness(1) saturate(1) blur(0px)';
  });

  if (caseSellEl) {
    caseSellEl.hidden = true;
  }

  casePriceEl.disabled = true;
  casePriceEl.textContent = 'Открытие...';
  casePriceEl.hidden = false;

  window.setTimeout(() => {
    rollCase();
  }, 40);
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users.map((user) => {
    const sanitizedUser = { ...user };
    delete sanitizedUser.password;
    return sanitizedUser;
  })));
}

function clampBalance(value) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
}

function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.random() * 16 | 0;
    const value = character === 'x' ? random : (random & 0x3 | 0x8);
    return value.toString(16);
  });
}

function isPayoutSystemEnabled(user) {
  return user?.payoutSystemEnabled === true || user?.payout_system_enabled === true ||
    user?.payoutSystemEnabled === 'true' || user?.payout_system_enabled === 'true' ||
    user?.payoutSystemEnabled === 1 || user?.payout_system_enabled === 1;
}

function getPlayerPayoutChance(user, normalChance) {
  const fallback = Math.max(0, Math.min(100, Number(normalChance ?? 25)));
  if (!isPayoutSystemEnabled(user)) {
    return fallback;
  }

  const configuredChance = Number(user?.payoutChance ?? user?.payout_chance ?? fallback);
  return Number.isFinite(configuredChance)
    ? Math.max(0, Math.min(100, configuredChance))
    : fallback;
}

function createProfileDisplayId(value) {
  const source = String(value || 'DustDrop');
  let hash = 0;
  for (let index = 0; index < source.length; index += 1) {
    hash = (hash * 31 + source.charCodeAt(index)) >>> 0;
  }
  return 10000 + (hash % 90000);
}

function normalizeUser(user) {
  if (!user) {
    return null;
  }

  const profileId = Number(user.profileId);

  return {
    ...user,
    profileId: Number.isInteger(profileId) && profileId >= 10000 && profileId <= 99999
      ? profileId
      : createProfileDisplayId(user.id || user.username),
    balance: clampBalance(user.balance),
    openedCases: Number(user.openedCases || 0),
    upgrades: Number(user.upgrades || 0),
    withdrawnTotal: Number(user.withdrawnTotal || 0),
    payoutSystemEnabled: isPayoutSystemEnabled(user),
    payoutChance: Number(user.payoutChance ?? user.payout_chance ?? 25),
    casePayoutChance: Number(user.casePayoutChance ?? 25),
    upgradePayoutChance: Number(user.upgradePayoutChance ?? 40),
    inventory: Array.isArray(user.inventory) ? user.inventory : [],
    bestDrop: user.bestDrop || null
  };
}

async function syncUserToSupabase(user) {
  if (!supabaseClient || !user?.username) {
    lastSupabaseError = 'Supabase client is unavailable or the user has no username.';
    return false;
  }

  const username = String(user.username).trim();
  if (!username) {
    return false;
  }

  try {
    const { data: authResult } = await supabaseClient.auth.getUser();
    const authUser = authResult?.user;
    if (!authUser) {
      lastSupabaseError = 'Войдите в аккаунт через Supabase Auth.';
      return false;
    }

    const { data: existingProfile } = await supabaseClient
      .from('profiles')
      .select('id')
      .eq('auth_user_id', authUser.id)
      .maybeSingle();

    if (existingProfile?.id) {
      user.id = existingProfile.id;
    }

    if (!user.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id)) {
      user.id = generateUuid();
    }

    const safeBalance = clampBalance(user.balance);

    const profilePayload = {
      id: user.id || generateUuid(),
      auth_user_id: authUser.id,
      username,
      email: null,
      role: 'user',
      balance: safeBalance,
      trade_url: user.tradeUrl || null,
      inventory: getInventoryByUser(user),
      opened_cases: Number(user.openedCases || 0),
      upgrades: Number(user.upgrades || 0),
      withdrawn_total: Number(user.withdrawnTotal || 0),
      payout_system_enabled: isPayoutSystemEnabled(user),
      payout_chance: Number(user.payoutChance ?? user.payout_chance ?? 25),
      best_drop: user.bestDrop || null,
      updated_at: new Date().toISOString()
    };

    let insertResult = await supabaseClient
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' });

    if (insertResult.error && /withdrawn_total/i.test(insertResult.error.message || '')) {
      const legacyPayload = { ...profilePayload };
      delete legacyPayload.withdrawn_total;
      insertResult = await supabaseClient
        .from('profiles')
        .upsert(legacyPayload, { onConflict: 'id' });
    }

    if (insertResult.error) {
      lastSupabaseError = insertResult.error.message || 'Profile synchronization failed.';
      console.warn('Supabase profile insert failed:', insertResult.error);
      console.warn('Payload used:', profilePayload);
      return false;
    }

    return true;
  } catch (error) {
    lastSupabaseError = error.message || 'Supabase synchronization failed.';
    console.warn('Supabase sync error:', error);
    return false;
  }
}

function getActiveUser() {
  try {
    return normalizeUser(JSON.parse(localStorage.getItem(ACTIVE_USER_KEY) || 'null'));
  } catch (error) {
    return null;
  }
}

function saveActiveUser(user) {
  const normalized = normalizeUser(user);

  if (!normalized) {
    localStorage.removeItem(ACTIVE_USER_KEY);
    return;
  }

  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(normalized));
}

async function refreshActiveUserFromSupabase() {
  let user = getActiveUser();
  if (!supabaseClient) {
    return false;
  }

  const { data: authResult } = await supabaseClient.auth.getUser();
  const authUser = authResult?.user;
  if (!authUser) {
    return false;
  }

  if (!user?.id) {
    const { data: authProfile } = await supabaseClient
      .from('profiles')
      .select('id, username')
      .eq('auth_user_id', authUser.id)
      .maybeSingle();
    if (!authProfile) {
      return false;
    }
    user = normalizeUser({ id: authProfile.id, username: authProfile.username, role: 'user' });
  }

  let { data, error } = await supabaseClient
    .from('profiles')
    .select('username, role, is_banned, balance, trade_url, inventory, opened_cases, upgrades, withdrawn_total, payout_system_enabled, payout_chance, case_payout_chance, upgrade_payout_chance, best_drop')
    .eq('id', user.id)
    .maybeSingle();

  if (error && /withdrawn_total/i.test(error.message || '')) {
    ({ data, error } = await supabaseClient
      .from('profiles')
      .select('username, role, is_banned, balance, trade_url, inventory, opened_cases, upgrades, payout_system_enabled, payout_chance, case_payout_chance, upgrade_payout_chance, best_drop')
      .eq('id', user.id)
      .maybeSingle());
  }

  if (error || !data) {
    return false;
  }

  if (data.is_banned) {
    await supabaseClient.auth.signOut();
    saveActiveUser(null);
    updateProfileUI();
    window.alert('Ваш аккаунт заблокирован администратором.');
    return false;
  }

  saveActiveUser({
    ...user,
    username: data.username || user.username,
    role: data.role || user.role,
    isBanned: data.is_banned === true,
    balance: data.balance ?? user.balance,
    tradeUrl: data.trade_url || user.tradeUrl,
    inventory: Array.isArray(data.inventory) ? data.inventory : user.inventory,
    openedCases: data.opened_cases ?? user.openedCases,
    upgrades: data.upgrades ?? user.upgrades,
    withdrawnTotal: data.withdrawn_total ?? user.withdrawnTotal,
    payoutSystemEnabled: data.payout_system_enabled === true || data.payout_system_enabled === 'true' || data.payout_system_enabled === 1,
    payoutChance: data.payout_chance ?? user.payoutChance ?? 25,
    casePayoutChance: data.case_payout_chance ?? user.casePayoutChance,
    upgradePayoutChance: data.upgrade_payout_chance ?? user.upgradePayoutChance,
    bestDrop: data.best_drop || user.bestDrop
  });
  updateProfileUI();
  return true;
}

function formatAccountBalance(value) {
  return `${Number(value || 0).toFixed(2)} ${getCurrencySymbol()}`;
}

function formatPrice(value) {
  return `${new Intl.NumberFormat('ru-RU').format(value)} ${getCurrencySymbol()}`;
}

function getCurrencySymbol() {
  return body.classList.contains('streamer-mode') ? '©' : '₽';
}

function replaceVisibleCurrencySymbols() {
  const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node = walker.nextNode();
  while (node) {
    if (!node.parentElement.closest('script, style, input, textarea')) {
      nodes.push(node);
    }
    node = walker.nextNode();
  }
  nodes.forEach((textNode) => {
    textNode.nodeValue = textNode.nodeValue.replace(/₽|©/g, getCurrencySymbol());
  });
}

function getItemPriceByRarity(rarity) {
  const prices = {
    blue: 2500,
    green: 5200,
    red: 9800,
    purple: 18000,
    pink: 35000,
    gold: 60000
  };

  return prices[rarity] || 5000;
}

function getInventoryByUser(user) {
  return Array.isArray(user?.inventory)
    ? user.inventory.filter((item) => item && typeof item === 'object')
    : [];
}

function isWithdrawnItem(item) {
  return Boolean(item?.pendingWithdraw);
}

async function cleanupExpiredWithdrawals(user) {
  if (!supabaseClient || !user?.id) {
    return;
  }

  const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: requests, error } = await supabaseClient
    .from('withdrawal_requests')
    .select('id, item')
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .lt('created_at', cutoff);

  if (error || !requests?.length) {
    return;
  }

  const requestIds = new Set(requests.map((request) => request.id));
  const nextInventory = getInventoryByUser(user).map((item) => {
    if (!requestIds.has(item.withdrawalRequestId)) {
      return item;
    }

    const restoredItem = { ...item };
    delete restoredItem.pendingWithdraw;
    delete restoredItem.withdrawalRequestId;
    delete restoredItem.tradeUrl;
    delete restoredItem.pendingWithdrawAt;
    return restoredItem;
  });

  user.inventory = nextInventory;
  saveActiveUser(user);
  void syncUserToSupabase(user);
  await supabaseClient
    .from('withdrawal_requests')
    .update({ status: 'expired', resolved_at: new Date().toISOString() })
    .in('id', [...requestIds]);
  renderProfileInventory();
}

function getBestDropFromInventory(items) {
  if (!Array.isArray(items) || !items.length) {
    return null;
  }

  return items.reduce((best, item) => {
    if (!best || Number(item?.price || 0) > Number(best?.price || 0)) {
      return item;
    }
    return best;
  }, null);
}

function getBestDropEver(user, items) {
  const inventoryBest = getBestDropFromInventory(items);
  const historicalBest = user?.bestDrop;

  if (!inventoryBest) {
    return historicalBest || null;
  }

  if (!historicalBest || Number(inventoryBest.price || 0) > Number(historicalBest.price || 0)) {
    return inventoryBest;
  }

  return historicalBest;
}

function getSkinImageByRarity(rarity) {
  const map = {
    gray: REMOTE_SKIN_IMAGES.gray,
    blue: REMOTE_SKIN_IMAGES.blue,
    green: REMOTE_SKIN_IMAGES.green,
    red: REMOTE_SKIN_IMAGES.red,
    purple: REMOTE_SKIN_IMAGES.purple,
    pink: REMOTE_SKIN_IMAGES.pink,
    gold: REMOTE_SKIN_IMAGES.gold
  };

  return map[rarity] || REMOTE_SKIN_IMAGES.blue;
}

function renderProfileStats() {
  const user = getActiveUser();
  const openedCasesValue = document.querySelector('.profile-screen__cases-value');

  if (openedCasesValue) {
    openedCasesValue.textContent = Number(user?.openedCases || 0);
  }

  const withdrawnValue = document.querySelector('.profile-screen__line-value');
  if (withdrawnValue) {
    withdrawnValue.textContent = formatAccountBalance(user?.withdrawnTotal || 0);
  }
}

function renderProfileBalance() {
  const user = getActiveUser();
  const balanceValue = formatAccountBalance(user?.balance || 0);

  if (menuProfileBalance) {
    menuProfileBalance.textContent = `На счете: ${formatAccountBalance(user?.balance || 0)}`;
  }

  if (profileScreenBalance) {
    profileScreenBalance.textContent = balanceValue;
  }
}

function renderProfileInventory() {
  const user = getActiveUser();
  const inventory = getInventoryByUser(user);
  const inventoryList = document.querySelector('.profile-screen__inventory');
  const bestDropNode = document.querySelector('.profile-screen__drop-card');

  void cleanupExpiredWithdrawals(user);

  if (bestDropNode) {
    const bestDrop = getBestDropFromInventory(inventory);
    if (bestDrop && Number(bestDrop.price || 0) > 0) {
      bestDropNode.innerHTML = `
        <div class="profile-screen__drop-title">Максимальный выигрыш</div>
        <div class="profile-screen__drop-name">${formatPrice(bestDrop.price)}</div>
      `;
    } else {
      bestDropNode.innerHTML = `
        <div class="profile-screen__drop-title">Максимальный выигрыш</div>
        <div class="profile-screen__drop-name">0 ₽</div>
      `;
    }
  }

  if (!inventoryList) {
    return;
  }

  if (!inventory.length) {
    inventoryList.innerHTML = '<div class="profile-screen__inventory-empty">Нет предметов</div>';
    return;
  }

  inventoryList.innerHTML = inventory.map((item, index) => {
    const itemPending = Boolean(item.pendingWithdraw);
    const actionMarkup = itemPending
      ? ''
      : `
        <div class="profile-screen__inventory-actions">
          <button type="button" class="profile-screen__action profile-screen__action--sell" data-index="${index}" data-action="sell">Продать</button>
          <button type="button" class="profile-screen__action profile-screen__action--withdraw" data-index="${index}" data-action="withdraw" ${user?.tradeUrl ? '' : 'disabled'}>Вывести</button>
        </div>
      `;

    return `
      <div class="profile-screen__inventory-item ${itemPending ? 'is-pending' : ''}" data-index="${index}">
        <div class="profile-screen__inventory-art ${item.rarity || 'purple'} ${itemPending ? 'profile-screen__inventory-art--pending' : ''}">
          ${itemPending ? `
            <div class="profile-screen__inventory-pending">
              <div class="profile-screen__inventory-status-icon">⏱</div>
              <div class="profile-screen__inventory-status-text">В течение 10 мин. поступит обмен.</div>
            </div>
          ` : ''}
          <div class="profile-screen__inventory-tag">${item.name}</div>
          <img src="${item.image || getSkinImageByRarity(item.rarity || 'blue')}" alt="${item.name}" draggable="false" />
          <div class="profile-screen__inventory-price">${formatPrice(item.price)}</div>
        </div>
        ${actionMarkup}
      </div>
    `;
  }).join('');

  inventoryList.querySelectorAll('.profile-screen__inventory-item').forEach((itemNode) => {
    itemNode.addEventListener('click', (event) => {
      if (event.target.closest('.profile-screen__action')) {
        return;
      }

      inventoryList.querySelectorAll('.profile-screen__inventory-item').forEach((node) => node.classList.remove('is-active'));
      itemNode.classList.add('is-active');
    });
  });

  inventoryList.querySelectorAll('.profile-screen__action').forEach((button) => {
    button.addEventListener('click', async () => {
      const action = button.dataset.action;
      const itemIndex = Number(button.dataset.index);
      const selectedUser = getActiveUser();

      if (!selectedUser) {
        return;
      }

      const itemList = getInventoryByUser(selectedUser);
      const item = itemList[itemIndex];
      if (!item) {
        return;
      }

      if (action === 'sell') {
        if (isWithdrawnItem(item)) {
          return;
        }

        selectedUser.balance = Number(selectedUser.balance || 0) + Number(item.price || 0);
        itemList.splice(itemIndex, 1);
        selectedUser.inventory = itemList;
        selectedUser.bestDrop = getBestDropEver(selectedUser, itemList);
        saveActiveUser(selectedUser);
        void syncUserToSupabase(selectedUser);
        renderProfileBalance();
        renderProfileStats();
        renderProfileInventory();
        updateProfileUI();
        return;
      }

      if (action === 'withdraw') {
        if (!selectedUser.tradeUrl) {
          return;
        }

        const itemPrice = Number(item.price || 0);
        const confirmed = window.confirm(`Подтвердить вывод предмета на сумму ${formatPrice(itemPrice)}?`);
        if (!confirmed) {
          return;
        }

        if (!selectedUser.id) {
          selectedUser.id = generateUuid();
        }

        const requestId = generateUuid();
        item.pendingWithdraw = true;
        item.withdrawalRequestId = requestId;
        item.pendingWithdrawAt = new Date().toISOString();
        item.tradeUrl = selectedUser.tradeUrl;
        selectedUser.inventory = itemList;
        saveActiveUser(selectedUser);
        const profileSynced = await syncUserToSupabase(selectedUser);
        if (!profileSynced) {
          delete item.pendingWithdraw;
          delete item.withdrawalRequestId;
          delete item.pendingWithdrawAt;
          delete item.tradeUrl;
          saveActiveUser(selectedUser);
          renderProfileInventory();
          window.alert(`Не удалось сохранить профиль пользователя в Supabase: ${lastSupabaseError || 'неизвестная ошибка'}`);
          return;
        }
        saveActiveUser(selectedUser);
        const { error: requestError } = await supabaseClient.from('withdrawal_requests').insert({
          id: requestId,
          user_id: selectedUser.id,
          item,
          trade_url: selectedUser.tradeUrl
        });
        if (requestError) {
          delete item.pendingWithdraw;
          delete item.withdrawalRequestId;
          delete item.pendingWithdrawAt;
          delete item.tradeUrl;
          saveActiveUser(selectedUser);
          renderProfileInventory();
          lastSupabaseError = requestError.message || 'Withdrawal request insert failed.';
          window.alert(`Не удалось создать заявку на вывод: ${lastSupabaseError}`);
          return;
        }
        renderProfileStats();
        renderProfileInventory();
        updateProfileUI();
      }
    });
  });
}

async function sellAllItems() {
  const user = getActiveUser();
  if (!user) {
    return;
  }

  if (!supabaseClient) {
    return;
  }

  const { data: balance, error } = await supabaseClient.rpc('sell_all_items');
  if (error || balance === null || balance === undefined) {
    window.alert(`Не удалось продать предметы: ${error?.message || 'ошибка Supabase'}`);
    return;
  }

  const inventory = getInventoryByUser(user);
  user.balance = Number(balance);
  user.inventory = inventory.filter((item) => isWithdrawnItem(item));
  user.bestDrop = getBestDropEver(user, user.inventory);
  saveActiveUser(user);
  renderProfileBalance();
  renderProfileStats();
  renderProfileInventory();
}

function getLiveFeedItems() {
  return liveFeedItems;
}

function saveLiveFeedItems(items) {
  liveFeedItems = Array.isArray(items) ? items : [];
}

async function loadLiveFeed() {
  if (!supabaseClient) {
    saveLiveFeedItems([]);
    renderLiveFeed();
    return;
  }

  const { data, error } = await supabaseClient
    .from('live_drops')
    .select('id, name, rarity, price, image, created_at')
    .order('created_at', { ascending: false })
    .limit(30);

  if (error) {
    console.warn('Live feed is unavailable:', error.message);
    saveLiveFeedItems([]);
    renderLiveFeed();
    return;
  }

  saveLiveFeedItems(Array.isArray(data) ? data : []);
  renderLiveFeed();
}

function subscribeToLiveFeed() {
  if (!supabaseClient) {
    return;
  }

  supabaseClient
    .channel('live-drops-feed')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_drops' }, (payload) => {
      const nextItem = payload.new;
      if (!nextItem?.name) {
        return;
      }

      const feed = [nextItem, ...getLiveFeedItems().filter((item) => item.id !== nextItem.id)].slice(0, 30);
      saveLiveFeedItems(feed);
      renderLiveFeed();
    })
    .subscribe();
}

function renderLiveFeed() {
  if (!liveFeedEl) {
    return;
  }

  const feed = getLiveFeedItems();
  const items = feed;

  liveFeedEl.innerHTML = items.map((item) => {
    const rarityClass = `card-image--${item.rarity || 'blue'}`;
    const title = item.name || 'Предмет';
    const subtitle = item.name || 'Скин';
    return `
      <article class="live-card">
        <div class="card-image ${rarityClass}">
          <img src="${item.image || getSkinImageByRarity(item.rarity || 'blue')}" alt="${title}" />
        </div>
        <div class="card-meta">
          <strong>${title.split(' ')[0] || title}</strong>
          <span>${subtitle}</span>
        </div>
      </article>
    `;
  }).join('');
}

void loadLiveFeed();
subscribeToLiveFeed();

function addDroppedItemToInventory(item, persist = true) {
  if (!item) {
    return;
  }

  const user = getActiveUser();
  if (!user) {
    return;
  }

  const inventory = getInventoryByUser(user);
  const nextItem = {
    name: item.name,
    price: Number(item.price || getItemPriceByRarity(item.rarity)),
    rarity: item.rarity || 'blue',
    image: item.image || getSkinImageByRarity(item.rarity || 'blue')
  };

  user.inventory = [...inventory, nextItem];
  user.openedCases = Number(user.openedCases || 0) + 1;
  user.bestDrop = getBestDropEver(user, user.inventory);

  saveActiveUser(user);
  if (persist) {
    void syncUserToSupabase(user);
  }
  renderProfileStats();
  renderProfileInventory();
}

function sellLatestItem() {
  const user = getActiveUser();
  if (!user) {
    return;
  }

  const inventory = [...getInventoryByUser(user)];
  if (!inventory.length) {
    return;
  }

  const lastItemIndex = inventory.findLastIndex((item) => !isWithdrawnItem(item));
  if (lastItemIndex < 0) {
    return;
  }

  const lastItem = inventory[lastItemIndex];
  const sellValue = Number(lastItem?.price || 0);

  user.balance = Number(user.balance || 0) + sellValue;
  inventory.splice(lastItemIndex, 1);
  user.inventory = inventory;
  user.bestDrop = getBestDropEver(user, inventory);
  saveActiveUser(user);
  void syncUserToSupabase(user);
  renderProfileBalance();
  renderProfileStats();
  renderProfileInventory();
  updateProfileUI();
}

function updateProfileUI() {
  const user = getActiveUser();
  const loginBtn = document.querySelector('.menu-login');

  if (user && menuProfile) {
    const avatarText = user.username ? user.username.charAt(0).toUpperCase() : 'П';
    const balanceText = `На счете: ${formatAccountBalance(user.balance || 0)}`;

    if (menuProfileAvatar) {
      menuProfileAvatar.innerHTML = user.avatarUrl
        ? `<img src="${user.avatarUrl}" alt="Аватар ${user.username || ''}" />`
        : avatarText;
    }

    if (profileShortcutAvatar) {
      profileShortcutAvatar.innerHTML = user.avatarUrl
        ? `<img src="${user.avatarUrl}" alt="Аватар ${user.username || ''}" />`
        : avatarText;
    }

    if (menuProfileName) {
      menuProfileName.textContent = user.username;
    }

    if (menuProfileBalance) {
      menuProfileBalance.textContent = balanceText;
    }

    menuProfile.hidden = false;
    menuProfile.style.display = 'flex';
    if (loginBtn) {
      loginBtn.style.display = 'none';
      loginBtn.hidden = true;
    }

    renderProfileBalance();
    renderProfileStats();
    renderProfileInventory();
    return;
  }

  if (menuProfile) {
    menuProfile.hidden = true;
    menuProfile.style.display = 'none';
  }

  if (profileShortcutAvatar) {
    profileShortcutAvatar.innerHTML = loginProfileIcon;
  }

  if (loginBtn) {
    loginBtn.style.display = 'inline-flex';
    loginBtn.hidden = false;
  }
}

function openProfileScreen() {
  const user = getActiveUser() || {
    username: 'ForcePay',
    profileId: '580843',
    balance: 0,
    inventory: [],
    openedCases: 0,
    upgrades: 0,
    withdrawnTotal: 0
  };

  closeCaseDetail();
  closeUpgradeScreen();

  if (profileScreenName) {
    profileScreenName.textContent = user.username;
  }

  if (profileScreenId) {
    profileScreenId.textContent = `ID: ${user.profileId}`;
  }

  renderUserAvatar(profileScreenAvatar, user);

  renderProfileBalance();
  renderProfileStats();
  renderProfileInventory();

  body.classList.add('profile-screen-open');
  if (profileScreen) {
    profileScreen.classList.add('is-open');
    profileScreen.setAttribute('aria-hidden', 'false');
  }

  setMenuState(false);
}

function closeProfileScreen() {
  body.classList.remove('profile-screen-open');
  if (profileScreen) {
    profileScreen.classList.remove('is-open');
    profileScreen.setAttribute('aria-hidden', 'true');
  }
}

function openSettingsModal() {
  if (!settingsModal) {
    return;
  }

  const user = getActiveUser();
  const nickInput = settingsModal.querySelector('.settings-modal__field input');
  const tradeInput = settingsModal.querySelector('.settings-modal__trade-wrap input');

  if (nickInput && user && user.username) {
    nickInput.value = user.username;
  }

  if (tradeInput && user && user.tradeUrl) {
    tradeInput.value = user.tradeUrl;
  }

  if (streamerToggle) {
    streamerToggle.setAttribute('aria-pressed', String(body.classList.contains('streamer-mode')));
  }

  settingsModal.classList.add('is-open');
  settingsModal.setAttribute('aria-hidden', 'false');
}

function renderUserAvatar(node, user) {
  if (!node || !user) {
    return;
  }

  node.innerHTML = user.avatarUrl
    ? `<img src="${user.avatarUrl}" alt="Аватар ${user.username || ''}" />`
    : (user.username || 'П').charAt(0).toUpperCase();
}

const avatarInput = settingsModal?.querySelector('.settings-modal__avatar-input');
avatarInput?.addEventListener('change', () => {
  const file = avatarInput.files?.[0];
  const user = getActiveUser();
  if (!file || !user || !file.type.startsWith('image/')) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', () => {
    user.avatarUrl = String(reader.result || '');
    saveActiveUser(user);
    const users = getUsers();
    const userIndex = users.findIndex((item) => item.id === user.id || item.username === user.username);
    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], avatarUrl: user.avatarUrl };
      saveUsers(users);
    }
    void syncUserToSupabase(user);
    updateProfileUI();
    renderUserAvatar(profileScreenAvatar, user);
  });
  reader.readAsDataURL(file);
});

function saveSettingsForm() {
  const user = getActiveUser();
  if (!user) {
    return;
  }

  const nickInput = settingsModal?.querySelector('.settings-modal__field input');
  const tradeInput = settingsModal?.querySelector('.settings-modal__trade-wrap input');

  const nextUsername = (nickInput?.value || '').trim();
  const nextTradeUrl = (tradeInput?.value || '').trim();

  if (nextUsername) {
    user.username = nextUsername;
  }

  if (nextTradeUrl) {
    try {
      const tradeUrl = new URL(nextTradeUrl);
      if (tradeUrl.protocol !== 'https:' || tradeUrl.hostname !== 'steamcommunity.com' || tradeUrl.pathname !== '/tradeoffer/new/') {
        throw new Error('Invalid trade URL');
      }
      user.tradeUrl = tradeUrl.href;
    } catch (error) {
      tradeInput?.focus();
      return;
    }
  } else {
    user.tradeUrl = '';
  }

  saveActiveUser(user);
  void syncUserToSupabase(user);
  const users = getUsers();
  const userIndex = users.findIndex((item) => item.username === user.username || item.username === (nickInput?.dataset.previousUsername || user.username));

  if (userIndex >= 0) {
    users[userIndex] = {
      ...users[userIndex],
      ...user,
      username: user.username
    };
    saveUsers(users);
  }

  updateProfileUI();
  if (profileScreenName) {
    profileScreenName.textContent = user.username;
  }
  renderUserAvatar(profileScreenAvatar, user);
}

function closeSettingsModal() {
  if (!settingsModal) {
    return;
  }

  settingsModal.classList.remove('is-open');
  settingsModal.setAttribute('aria-hidden', 'true');
}

function setMenuState(isOpen) {
  body.classList.toggle('menu-open', isOpen);

  if (menuOverlay) {
    menuOverlay.classList.toggle('is-open', isOpen);
    menuOverlay.style.display = isOpen ? 'block' : 'none';
    menuOverlay.style.visibility = isOpen ? 'visible' : 'hidden';
    menuOverlay.style.opacity = isOpen ? '1' : '0';
  }

  if (sideMenu) {
    sideMenu.classList.toggle('is-open', isOpen);
    sideMenu.style.display = isOpen ? 'flex' : 'none';
    sideMenu.style.visibility = isOpen ? 'visible' : 'hidden';
    sideMenu.style.opacity = isOpen ? '1' : '0';
    sideMenu.style.transform = isOpen ? 'translateX(0)' : 'translateX(100%)';
  }

  menuToggles.forEach((toggle) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function openAuthModal() {
  if (!authModal) {
    return;
  }

  authModal.classList.add('is-open');
  authModal.setAttribute('aria-hidden', 'false');
  body.classList.add('menu-open');
  setMenuState(false);
}

function closeAuthModal() {
  if (!authModal) {
    return;
  }

  if (document.activeElement && authModal.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  authModal.classList.remove('is-open');
  authModal.setAttribute('aria-hidden', 'true');
  body.classList.remove('menu-open');
}

function openLoginModal() {
  if (!loginModal) {
    return;
  }

  closeAuthModal();
  if (registerModal) {
    registerModal.classList.remove('is-open');
    registerModal.setAttribute('aria-hidden', 'true');
  }
  loginModal.classList.add('is-open');
  loginModal.setAttribute('aria-hidden', 'false');
}

function closeLoginModal() {
  if (!loginModal) {
    return;
  }

  if (document.activeElement && loginModal.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  loginModal.classList.remove('is-open');
  loginModal.setAttribute('aria-hidden', 'true');
}

function openRegisterModal() {
  if (!registerModal) {
    return;
  }

  closeAuthModal();
  if (loginModal) {
    loginModal.classList.remove('is-open');
    loginModal.setAttribute('aria-hidden', 'true');
  }
  registerModal.classList.add('is-open');
  registerModal.setAttribute('aria-hidden', 'false');
}

function closeRegisterModal() {
  if (!registerModal) {
    return;
  }

  if (document.activeElement && registerModal.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  registerModal.classList.remove('is-open');
  registerModal.setAttribute('aria-hidden', 'true');
}

function goToHomeFromCase() {
  closeCaseDetail();
  setMenuState(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToSiteTop() {
  closeProfileScreen();
  closeCaseDetail();
  closeUpgradeScreen();
  setMenuState(false);
  const siteTop = document.getElementById('site-top');

  if (siteTop) {
    siteTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function goToCasesSection() {
  closeProfileScreen();
  closeCaseDetail();
  closeUpgradeScreen();
  setMenuState(false);

  const casesSection = document.querySelector('.cases-section');
  if (casesSection) {
    casesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function toggleMenuState() {
  const isOpen = !body.classList.contains('menu-open');
  setMenuState(isOpen);
  return isOpen;
}

window.toggleMenuState = toggleMenuState;

menuToggles.forEach((toggle) => {
  toggle.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleMenuState();
  };
});

document.querySelector('.profile-shortcut')?.addEventListener('click', () => {
  if (getActiveUser()) {
    openProfileScreen();
    return;
  }

  openAuthModal();
});

if (menuOverlay) {
  menuOverlay.addEventListener('click', () => setMenuState(false));
}

menuCloses.forEach((closeButton) => {
  closeButton.addEventListener('click', () => setMenuState(false));
});

menuLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const href = link.getAttribute('href') || '';
    const section = href.replace('#', '');

    document.querySelectorAll('.bottom-nav__link').forEach((navLink) => {
      navLink.classList.toggle('is-active', navLink === link);
    });

    setMenuState(false);

    if (section === 'profile-inventory' || section === 'inventory') {
      event.preventDefault();
      openProfileScreen();
      setTimeout(() => {
        if (profileScreen && profileInventory) {
          profileScreen.scrollTo({
            top: Math.max(profileInventory.offsetTop - 24, 0),
            behavior: 'smooth'
          });
        }
      }, 60);
      return;
    }

    if (section === 'site-top' || section === 'cases' || section === 'home') {
      event.preventDefault();
      if (section === 'cases') {
        goToCasesSection();
      } else {
        goToSiteTop();
      }
      return;
    }

    if (section === 'profile') {
      event.preventDefault();
      openProfileScreen();
      return;
    }

    if (section === 'upgrade-screen') {
      event.preventDefault();
      openUpgradeScreen();
      return;
    }

  });
});

function openCaseDetail(name, price, imageSrc, payoutChance = 25) {
  if (!getActiveUser()) {
    openAuthModal();
    return;
  }

  body.classList.add('case-modal-open');
  activeCasePrice = price && price.trim() ? price.trim() : '1 337.90 ₽';
  activeCasePayoutChance = Math.max(0, Math.min(100, Number(payoutChance ?? 25)));
  activeCaseSkins = [];

  const contents = document.querySelector('.case-detail__items');
  if (contents) {
    contents.innerHTML = '';
  }

  if (caseDetail) {
    caseDetail.setAttribute('aria-hidden', 'false');
    caseDetail.classList.remove('case-opening');
    caseDetail.classList.remove('case-result');
    caseDetail.classList.remove('case-opened');
  }

  if (caseIconEl) {
    caseIconEl.hidden = false;
    caseIconEl.style.opacity = '1';
    caseIconEl.style.visibility = 'visible';
    caseIconEl.style.display = 'block';
  }

  items.forEach((item) => {
    item.element.style.opacity = '';
    item.element.style.transform = '';
    item.element.style.filter = '';
  });

  if (caseSellEl) {
    caseSellEl.hidden = true;
  }

  if (casePriceEl) {
    casePriceEl.hidden = false;
    casePriceEl.textContent = `Открыть за ${activeCasePrice}`;
    casePriceEl.disabled = false;
  }

  if (caseIconEl && imageSrc) {
    caseIconEl.src = imageSrc;
    caseIconEl.alt = name ? `${name} иконка` : 'Иконка кейса';
    caseIconEl.hidden = false;
    caseIconEl.style.opacity = '1';
    caseIconEl.style.visibility = 'visible';
    caseIconEl.style.display = 'block';
  }
}

function closeCaseDetail() {
  if (rollTimeoutId) {
    window.clearTimeout(rollTimeoutId);
    rollTimeoutId = null;
  }
  if (focusFrameId) {
    cancelAnimationFrame(focusFrameId);
    focusFrameId = null;
  }
  stopCaseRollSoundTracking();
  isRolling = false;
  body.classList.remove('case-modal-open');
  if (caseDetail) {
    caseDetail.setAttribute('aria-hidden', 'true');
    caseDetail.classList.remove('case-opening');
    caseDetail.classList.remove('case-result');
  }
  if (caseIconEl) {
    caseIconEl.hidden = true;
    caseIconEl.style.opacity = '0';
    caseIconEl.style.visibility = 'hidden';
    caseIconEl.style.display = 'none';
  }
}

brandItems.forEach((brand) => {
  brand.addEventListener('click', (event) => {
    event.preventDefault();
    goToSiteTop();
  });
});

function bindCaseCardEvents() {
  const buttons = document.querySelectorAll('.case-card button');
  const openTargets = document.querySelectorAll('.case-card__image-wrap, .case-card__name');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      activeCaseId = button.dataset.caseId || null;
      const name = button.dataset.caseName || 'Кейс';
      const price = button.dataset.casePrice || '1 337.90 ₽';
      const payoutChance = button.dataset.casePayoutChance || 25;
      const image = button.dataset.caseImage || DEFAULT_REMOTE_CASE_IMAGE;
      openCaseDetail(name, price, image, payoutChance);
      if (activeCaseId && casePriceEl) {
        casePriceEl.disabled = true;
      }
      void loadCaseContents(activeCaseId);
    });
  });

  openTargets.forEach((target) => {
    target.addEventListener('click', () => {
      const article = target.closest('.case-card');
      const button = article ? article.querySelector('button') : null;
      if (button) {
        activeCaseId = button.dataset.caseId || null;
        const name = button.dataset.caseName || 'Кейс';
        const price = button.dataset.casePrice || '1 337.90 ₽';
        const payoutChance = button.dataset.casePayoutChance || 25;
        const image = button.dataset.caseImage || DEFAULT_REMOTE_CASE_IMAGE;
        openCaseDetail(name, price, image, payoutChance);
        if (activeCaseId && casePriceEl) {
          casePriceEl.disabled = true;
        }
        void loadCaseContents(activeCaseId);
      }
    });
  });
}

bindCaseCardEvents();

if (menuLoginBtn) {
  menuLoginBtn.addEventListener('click', () => {
    openAuthModal();
  });
}

if (menuProfile) {
  menuProfile.addEventListener('click', () => {
    openProfileScreen();
  });
}

if (menuProfileAction) {
  menuProfileAction.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    openTopupModal();
  });
}

function openTopupModal() {
  if (!topupModal) {
    return;
  }

  topupModal.classList.add('is-open');
  topupModal.setAttribute('aria-hidden', 'false');
}

if (menuProfileTopup) {
  menuProfileTopup.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    openTopupModal();
  });
}

if (profileScreenTopup) {
  profileScreenTopup.addEventListener('click', openTopupModal);
}

if (profileScreenWithdraw) {
  profileScreenWithdraw.addEventListener('click', () => {
    if (!profileScreen || !profileInventory) {
      return;
    }

    profileInventory.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function closeTopupModal() {
  if (!topupModal) {
    return;
  }

  topupModal.classList.remove('is-open');
  topupModal.setAttribute('aria-hidden', 'true');
}

topupCloseBtn?.addEventListener('click', closeTopupModal);
topupBackdrop?.addEventListener('click', closeTopupModal);

const profileSellAllBtn = document.querySelector('.profile-screen__sell-all');
if (profileSellAllBtn) {
  profileSellAllBtn.addEventListener('click', async () => {
    await sellAllItems();
  });
}

if (profileSettingsBtn) {
  profileSettingsBtn.addEventListener('click', () => {
    openSettingsModal();
  });
}

if (profileScreenLogout) {
  profileScreenLogout.addEventListener('click', async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    saveActiveUser(null);
    closeProfileScreen();
    updateProfileUI();
  });
}

async function openUpgradeScreen() {
  await refreshActiveUserFromSupabase();
  if (!getActiveUser()) {
    openAuthModal();
    return;
  }
  await loadRemoteSkins();
  if (upgradeScreenSpinning) {
    closeProfileScreen();
    closeCaseDetail();
    setMenuState(false);
    body.classList.add('upgrade-screen-open');
    if (upgradeScreen) {
      upgradeScreen.hidden = false;
      upgradeScreen.setAttribute('aria-hidden', 'false');
    }
    return;
  }
  closeProfileScreen();
  closeCaseDetail();
  setMenuState(false);
  body.classList.add('upgrade-screen-open');
  upgradeScreenCurrentRotation = 0;
  upgradeScreenSpinning = false;
  upgradeScreenStopAngle = 0;
  selectedUpgradeChance = Number(upgradeScreenConfig.chance) || 40;
  requestedUpgradeChance = selectedUpgradeChance;
  const upgradeUser = getActiveUser();
  if (upgradeUser) {
    selectedUpgradeChance = getCanonicalUpgradeChance(upgradeScreenConfig.chance);
  }
  selectedUpgradeItemIndex = -1;
  selectedUpgradeRewardKey = '';
  selectedUpgradeRewardItem = null;
  renderUpgradeSelectedItem();
  resetUpgradeChanceButtonsState();
  setUpgradeControlsLocked(false);
  if (upgradeScreen) {
    upgradeScreen.hidden = false;
    upgradeScreen.setAttribute('aria-hidden', 'false');
  }
}

function closeUpgradeScreen() {
  body.classList.remove('upgrade-screen-open');
  if (upgradeScreenSpinning) {
    if (typeof finishUpgradeAnimation === 'function') {
      finishUpgradeAnimation();
    }
    if (upgradeScreen) {
      upgradeScreen.setAttribute('aria-hidden', 'true');
      upgradeScreen.hidden = true;
    }
    return;
  }
  if (upgradeAnimationTimeoutId) {
    window.clearTimeout(upgradeAnimationTimeoutId);
    upgradeAnimationTimeoutId = null;
  }
  upgradeScreenCurrentRotation = 0;
  upgradeScreenSpinning = false;
  upgradeScreenStopAngle = 0;
  selectedUpgradeChance = Number(upgradeScreenConfig.chance) || 40;
  resetUpgradeChanceButtonsState();
  setUpgradeControlsLocked(false);
  if (upgradeScreen) {
    upgradeScreen.setAttribute('aria-hidden', 'true');
    upgradeScreen.hidden = true;
  }
}

window.openUpgradeScreen = openUpgradeScreen;
window.closeUpgradeScreen = closeUpgradeScreen;

if (upgradeCloseBtn) {
  upgradeCloseBtn.addEventListener('click', closeUpgradeScreen);
}

const upgradeScreenConfig = {
  chance: 40,
  duration: 5000
};

const UPGRADE_DEFAULT_DURATION = 5000;
const UPGRADE_FAST_DURATION = 1000;

const upgradeScreenEls = {
  arrowOrbit: document.querySelector('.upgrade-screen #arrowOrbit'),
  button: document.querySelector('.upgrade-screen #upgradeButton'),
  status: document.querySelector('.upgrade-screen #status'),
  result: document.querySelector('.upgrade-screen #result'),
  resultTitle: document.querySelector('.upgrade-screen #resultTitle'),
  resultValue: document.querySelector('.upgrade-screen #resultValue'),
  upgrader: document.querySelector('.upgrade-screen #upgrader'),
  speedToggle: document.querySelector('.upgrade-screen #upgradeSpeedToggle'),
  chanceElement: document.querySelector('.upgrade-screen #chance'),
  winArcs: document.querySelectorAll('.upgrade-screen .win-arc, .upgrade-screen .win-arc-inner'),
  selectedItemSlot: document.querySelector('#upgradeSelectedItemSlot'),
  rewardItemSlot: document.querySelector('#upgradeRewardItemSlot'),
  inventoryPicker: document.querySelector('#upgradeInventoryPicker')
};

let upgradeScreenCurrentRotation = 0;
let upgradeScreenSpinning = false;
let selectedUpgradeItemIndex = -1;
let upgradeScreenStopAngle = 0;
let selectedUpgradeChance = 40;
let requestedUpgradeChance = 40;
let upgradeAnimationTimeoutId = null;
let upgradeAnimationFast = false;
let upgradeSoundFrameId = null;
let lastUpgradeSoundAngle = null;
let lastUpgradeTickTime = 0;
let finishUpgradeAnimation = null;
let selectedUpgradeRewardKey = '';
let selectedUpgradeRewardItem = null;

function getCanonicalUpgradeChance(value = selectedUpgradeChance) {
  const nextValue = Number(value ?? upgradeScreenConfig.chance ?? 40);
  const clampedChance = Math.max(5, Math.min(80, Number.isFinite(nextValue) ? nextValue : 40));
  return Math.round(clampedChance * 100) / 100;
}

function getUpgradePayoutChance(value) {
  const nextValue = Number(value ?? 40);
  const payoutChance = Number.isFinite(nextValue) ? nextValue : 40;
  return Math.max(0, Math.min(100, payoutChance));
}

function formatUpgradeChance(value) {
  return getCanonicalUpgradeChance(value).toFixed(2);
}

function setUpgradeControlsLocked(isLocked) {
  const hasSelection = Boolean(getSelectedUpgradeItem());

  if (upgradeScreenEls.button) {
    upgradeScreenEls.button.disabled = isLocked || !hasSelection;
  }

  if (upgradeScreenEls.speedToggle) {
    upgradeScreenEls.speedToggle.disabled = isLocked;
  }

  document.querySelectorAll('.upgrade-screen .upgrade-panel__multiplier').forEach((button) => {
    const lockedForSpin = isLocked || upgradeScreenSpinning;
    button.disabled = lockedForSpin;
  });

  document.querySelectorAll('.upgrade-screen .upgrade-panel__slot').forEach((slot) => {
    slot.style.pointerEvents = isLocked ? 'none' : '';
    slot.setAttribute('aria-disabled', String(isLocked));
  });

  if (upgradeScreenEls.selectedItemSlot) {
    upgradeScreenEls.selectedItemSlot.style.pointerEvents = isLocked ? 'none' : '';
    upgradeScreenEls.selectedItemSlot.setAttribute('aria-disabled', String(isLocked));
  }

  if (upgradeScreenEls.inventoryPicker) {
    upgradeScreenEls.inventoryPicker.style.pointerEvents = isLocked ? 'none' : '';
  }
}

function setUpgradeAnimationSpeed(isFast) {
  upgradeAnimationFast = Boolean(isFast);
  upgradeScreenConfig.duration = upgradeAnimationFast ? UPGRADE_FAST_DURATION : UPGRADE_DEFAULT_DURATION;

  if (upgradeScreenEls.speedToggle) {
    upgradeScreenEls.speedToggle.setAttribute('aria-pressed', String(upgradeAnimationFast));
    upgradeScreenEls.speedToggle.setAttribute('aria-label', upgradeAnimationFast ? 'Вернуть обычную скорость' : 'Ускорить анимацию');
    upgradeScreenEls.speedToggle.title = upgradeAnimationFast ? 'Вернуть обычную скорость' : 'Ускорить анимацию';
  }
}

function resetUpgradeChanceButtonsState(preferredButton = null) {
  const buttons = Array.from(document.querySelectorAll('.upgrade-screen .upgrade-panel__multiplier'));
  const preferredChance = preferredButton && buttons.includes(preferredButton)
    ? Number(preferredButton.dataset.chance || selectedUpgradeChance || upgradeScreenConfig.chance || 40)
    : requestedUpgradeChance;

  requestedUpgradeChance = getCanonicalUpgradeChance(preferredChance ?? upgradeScreenConfig.chance ?? 40);
  selectedUpgradeChance = getCanonicalUpgradeChance(selectedUpgradeChance || requestedUpgradeChance);

  if (upgradeScreenEls.chanceElement) {
    upgradeScreenEls.chanceElement.textContent = `${formatUpgradeChance(selectedUpgradeChance)}%`;
  }

  const hasSelection = Boolean(getSelectedUpgradeItem());
  buttons.forEach((button) => {
    const isActive = Number(button.dataset.chance || 0) === requestedUpgradeChance;
    button.classList.toggle('active', isActive);
    button.disabled = upgradeScreenSpinning;
  });
}

function resetUpgradeState() {
  upgradeScreenSpinning = false;
  resetUpgradeChanceButtonsState();
  setUpgradeControlsLocked(false);
  syncUpgradeButtonState();
  renderUpgradeRewardItem();
}

function getUpgradeInventoryItems() {
  const user = getActiveUser();
  return Array.isArray(user?.inventory)
    ? user.inventory.filter((item) => item && !isWithdrawnItem(item))
    : [];
}

function getUpgradeInventoryItemEntries(user = getActiveUser()) {
  return Array.isArray(user?.inventory)
    ? user.inventory
      .map((item, inventoryIndex) => ({ item, inventoryIndex }))
      .filter(({ item }) => item && typeof item === 'object')
      .filter(({ item }) => !isWithdrawnItem(item))
    : [];
}

function ensureUpgradeSelectionState() {
  const items = getUpgradeInventoryItems();

  if (!items.length) {
    selectedUpgradeItemIndex = -1;
    return null;
  }

  if (selectedUpgradeItemIndex < 0) {
    return null;
  }

  if (selectedUpgradeItemIndex >= items.length) {
    selectedUpgradeItemIndex = 0;
  }

  return items[selectedUpgradeItemIndex];
}

function getSelectedUpgradeItem() {
  const items = getUpgradeInventoryItems();
  if (!items.length) {
    selectedUpgradeItemIndex = -1;
    return null;
  }

  if (selectedUpgradeItemIndex < 0 || selectedUpgradeItemIndex >= items.length) {
    return ensureUpgradeSelectionState();
  }

  return items[selectedUpgradeItemIndex];
}

function syncUpgradeButtonState() {
  const selectedItem = getSelectedUpgradeItem();
  const hasSelection = Boolean(selectedItem);

  if (upgradeScreenEls.button) {
    upgradeScreenEls.button.disabled = !hasSelection || upgradeScreenSpinning;
  }

  document.querySelectorAll('.upgrade-screen .upgrade-panel__multiplier').forEach((button) => {
    button.disabled = upgradeScreenSpinning;
  });
}

function clampUpgradeSelectionIndex(items = getUpgradeInventoryItems()) {
  if (!Array.isArray(items) || !items.length) {
    selectedUpgradeItemIndex = -1;
    return -1;
  }

  const maxIndex = items.length - 1;
  if (selectedUpgradeItemIndex < 0) {
    return -1;
  }
  if (selectedUpgradeItemIndex > maxIndex) {
    selectedUpgradeItemIndex = maxIndex;
  }

  return selectedUpgradeItemIndex;
}

function refreshUpgradeUiAfterChanceChange() {
  selectedUpgradeRewardKey = '';
  selectedUpgradeRewardItem = null;
  resetUpgradeChanceButtonsState();
  syncUpgradeButtonState();
  renderUpgradeRewardItem();
  resetUpgradeChanceButtonsState();
}

function pickUpgradeRewardItem(selectedItem, chance) {
  if (!selectedItem) {
    return null;
  }

  const inputPrice = Number(selectedItem.price || 0);
  const targetPrice = inputPrice * (100 / chance);
  const candidates = availableSkins
    .filter((item) => {
      const price = Number(item.price);
      return Number.isFinite(price) && price > inputPrice;
    })
    .map((item) => ({
      item,
      distance: Math.abs(targetPrice - Number(item.price || 0))
    }))
    .sort((left, right) => left.distance - right.distance);

  return candidates[0]?.item || null;
}

function getUpgradeRewardPreview(selectedItem) {
  if (!selectedItem) {
    return null;
  }

  const chance = getCanonicalUpgradeChance(requestedUpgradeChance);
  const rewardKey = `${selectedUpgradeItemIndex}:${selectedItem.name}:${selectedItem.price}:${chance}`;
  if (selectedUpgradeRewardKey !== rewardKey) {
    selectedUpgradeRewardKey = rewardKey;
    selectedUpgradeRewardItem = pickUpgradeRewardItem(selectedItem, chance);
  }

  if (!selectedUpgradeRewardItem) {
    return null;
  }

  const inputPrice = Number(selectedItem.price || 0);
  const rewardPrice = Number(selectedUpgradeRewardItem.price || 0);
  const actualChance = inputPrice > 0 && rewardPrice > 0
    ? getCanonicalUpgradeChance((inputPrice / rewardPrice) * 100)
    : getCanonicalUpgradeChance(requestedUpgradeChance);
  selectedUpgradeChance = actualChance;
  upgradeScreenConfig.chance = actualChance;
  if (upgradeScreenEls.chanceElement) {
    upgradeScreenEls.chanceElement.textContent = `${formatUpgradeChance(actualChance)}%`;
  }
  upgradeScreenEls.winArcs.forEach((arc) => {
    arc.setAttribute('stroke-dasharray', `${actualChance} ${100 - actualChance}`);
  });

  return {
    ...selectedUpgradeRewardItem,
    name: selectedUpgradeRewardItem.name,
    rarity: selectedUpgradeRewardItem.rarity || 'blue',
    price: Number(selectedUpgradeRewardItem.price || 0),
    isRewardPreview: true
  };
}

function renderUpgradeRewardItem() {
  const slot = upgradeScreenEls.rewardItemSlot;
  if (!slot) {
    return;
  }

  const items = getUpgradeInventoryItems();
  const hasActualSelection = selectedUpgradeItemIndex >= 0 && selectedUpgradeItemIndex < items.length;
  if (!hasActualSelection) {
    slot.innerHTML = '<span class="upgrade-panel__slot-empty">Выберите предмет</span>';
    return;
  }

  const selectedItem = items[selectedUpgradeItemIndex];
  const rewardItem = getUpgradeRewardPreview(selectedItem);

  if (!rewardItem) {
    slot.innerHTML = '<span class="upgrade-panel__slot-empty">Выберите предмет</span>';
    return;
  }

  const image = rewardItem.image || getSkinImageByRarity(rewardItem.rarity || 'blue');
  slot.innerHTML = `
    <div class="upgrade-panel__slot-preview upgrade-panel__slot-preview--selected">
      <img src="${image}" alt="${rewardItem.name}" />
      <span class="upgrade-panel__slot-price">${formatPrice(rewardItem.price)}</span>
    </div>
  `;
}

function renderUpgradeSelectedItem() {
  const slot = upgradeScreenEls.selectedItemSlot;
  const picker = upgradeScreenEls.inventoryPicker;
  const items = getUpgradeInventoryItems();

  if (!slot) {
    return;
  }

  if (!items.length) {
    selectedUpgradeItemIndex = -1;
    slot.innerHTML = '<span class="upgrade-panel__slot-empty">Выберите предмет</span>';
    renderUpgradeRewardItem();
    if (picker) {
      picker.hidden = true;
      picker.innerHTML = '';
    }
    syncUpgradeButtonState();
    return;
  }

  clampUpgradeSelectionIndex(items);

  const selectedItem = selectedUpgradeItemIndex >= 0 ? items[selectedUpgradeItemIndex] : null;
  if (selectedItem) {
    const image = selectedItem.image || getSkinImageByRarity(selectedItem.rarity || 'blue');
    slot.innerHTML = `
      <div class="upgrade-panel__slot-preview upgrade-panel__slot-preview--selected">
        <img src="${image}" alt="${selectedItem.name}" />
        <span class="upgrade-panel__slot-price">${formatPrice(selectedItem.price)}</span>
      </div>
    `;
  } else {
    slot.innerHTML = '<span class="upgrade-panel__slot-empty">Выберите предмет</span>';
  }

  renderUpgradeRewardItem();

  if (picker) {
    picker.hidden = true;
    picker.innerHTML = items.map((item, index) => {
      const itemRarity = item.rarity || 'blue';
      const isActive = index === selectedUpgradeItemIndex;
      return `
        <button type="button" class="upgrade-panel__slot-option ${isActive ? 'is-active' : ''}" data-index="${index}">
          <div class="profile-screen__inventory-item ${isActive ? 'is-active' : ''}">
            <div class="profile-screen__inventory-art ${itemRarity}" style="border-bottom-color: var(--rarity-${itemRarity})">
              <div class="profile-screen__inventory-tag">${item.name}</div>
              <img src="${item.image || getSkinImageByRarity(itemRarity)}" alt="${item.name}" draggable="false" />
              <div class="profile-screen__inventory-price">${formatPrice(item.price)}</div>
            </div>
          </div>
        </button>
      `;
    }).join('');

    picker.querySelectorAll('.upgrade-panel__slot-option').forEach((option) => {
      option.addEventListener('click', () => {
        selectedUpgradeItemIndex = Number(option.dataset.index);
        selectedUpgradeRewardKey = '';
        selectedUpgradeRewardItem = null;
        renderUpgradeSelectedItem();
        syncUpgradeButtonState();
        if (picker) {
          picker.hidden = true;
        }
      });
    });
  }

  syncUpgradeButtonState();
}

function syncUpgradeChanceButtons() {
  const buttons = document.querySelectorAll('.upgrade-screen .upgrade-panel__multiplier');

  buttons.forEach((button) => {
    const isActive = Number(button.dataset.chance || 0) === requestedUpgradeChance;
    button.classList.toggle('active', isActive);
  });
}

function setUpgradeChance(chance) {
  const safeChance = getCanonicalUpgradeChance(chance);
  requestedUpgradeChance = safeChance;
  upgradeScreenConfig.chance = safeChance;
  selectedUpgradeChance = safeChance;

  if (upgradeScreenEls.chanceElement) {
    upgradeScreenEls.chanceElement.textContent = `${formatUpgradeChance(safeChance)}%`;
  }

  upgradeScreenEls.winArcs.forEach((arc) => {
    arc.setAttribute('stroke-dasharray', `${safeChance} ${100 - safeChance}`);
  });

  resetUpgradeChanceButtonsState();
  syncUpgradeChanceButtons();
  renderUpgradeRewardItem();
  syncUpgradeButtonState();
}

function normalizeUpgradeAngle(angle) {
  const normalized = angle % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function isInsideUpgradeWinZone(rotation, chance = upgradeScreenConfig.chance) {
  const angle = normalizeUpgradeAngle(rotation);
  return angle >= 0 && angle <= getUpgradePayoutChance(chance) * 3.6;
}

function getUpgradeStopAngle(payoutChance = upgradeScreenConfig.chance, forcedWin = null) {
  const actualChance = getUpgradePayoutChance(payoutChance);
  const winSize = actualChance * 3.6;
  const shouldWin = forcedWin === null ? Math.random() * 100 < actualChance : forcedWin;

  if (shouldWin) {
    return normalizeUpgradeAngle(Math.random() * winSize);
  }

  const minLoseAngle = winSize + 18;
  const maxLoseAngle = 360 - 18;
  return normalizeUpgradeAngle(minLoseAngle + Math.random() * (maxLoseAngle - minLoseAngle));
}

async function runUpgradeAnimation() {
  if (!upgradeScreenEls.arrowOrbit || !upgradeScreenEls.button || !upgradeScreenEls.result) {
    return;
  }

  const items = getUpgradeInventoryItems();
  if (!items.length) {
    if (upgradeScreenEls.status) {
      upgradeScreenEls.status.textContent = 'Выберите предмет из инвентаря';
    }
    return;
  }

  const selectedItem = getSelectedUpgradeItem();
  if (!selectedItem) {
    if (upgradeScreenEls.status) {
      upgradeScreenEls.status.textContent = 'Выберите предмет из инвентаря';
    }
    syncUpgradeButtonState();
    return;
  }

  const rewardPreview = getUpgradeRewardPreview(selectedItem);
  if (!rewardPreview) {
    if (upgradeScreenEls.status) {
      upgradeScreenEls.status.textContent = 'Нет предмета дороже выбранного для этого шанса';
    }
    syncUpgradeButtonState();
    return;
  }

  if (upgradeScreenSpinning) {
    return;
  }

  if (upgradeAnimationTimeoutId) {
    window.clearTimeout(upgradeAnimationTimeoutId);
    upgradeAnimationTimeoutId = null;
  }
  upgradeScreenSpinning = false;
  stopUpgradeSoundTracking();
  resetUpgradeChanceButtonsState();
  upgradeScreenSpinning = true;
  const user = getActiveUser();
  const payoutChance = getUpgradePayoutChance(selectedUpgradeChance);
  if (!Number.isFinite(payoutChance) || payoutChance <= 0) {
    upgradeScreenSpinning = false;
    setUpgradeControlsLocked(false);
    if (upgradeScreenEls.status) {
      upgradeScreenEls.status.textContent = 'Не удалось рассчитать шанс апгрейда';
    }
    return;
  }

  let upgradeData = null;
  let upgradeError = null;
  if (upgradeScreenEls.status) {
    upgradeScreenEls.status.textContent = 'Проверка апгрейда...';
  }
  try {
    if (!supabaseClient) {
      throw new Error('Supabase недоступен');
    }
    const rpcResult = await supabaseClient.rpc('upgrade_item', {
      selected_item: selectedItem,
      requested_chance: payoutChance
    });
    upgradeData = rpcResult.data;
    upgradeError = rpcResult.error;
  } catch (error) {
    upgradeError = error;
    console.error('Upgrade RPC failed:', error);
  }
  if (upgradeError || !upgradeData?.[0]) {
    upgradeScreenSpinning = false;
    setUpgradeControlsLocked(false);
    if (upgradeScreenEls.status) {
      upgradeScreenEls.status.textContent = formatSupabaseRpcError(upgradeError, 'Не удалось выполнить апгрейд');
    }
    console.error('Upgrade RPC response is invalid:', upgradeError || upgradeData);
    return;
  }
  const upgradeResult = upgradeData[0];
  upgradeScreenStopAngle = getUpgradeStopAngle(payoutChance, upgradeResult.won);
  setUpgradeControlsLocked(true);
  upgradeScreenEls.result.classList.remove('show');
  upgradeScreenEls.upgrader?.classList.remove('win');
  if (upgradeScreenEls.status) {
    upgradeScreenEls.status.textContent = `Улучшение: ${selectedItem.name}`;
  }

  const currentNormalized = normalizeUpgradeAngle(upgradeScreenCurrentRotation);
  const delta = normalizeUpgradeAngle(upgradeScreenStopAngle - currentNormalized);
  const targetRotation = upgradeScreenCurrentRotation + delta + 3600;

  upgradeScreenConfig.chance = getCanonicalUpgradeChance(selectedUpgradeChance);
  selectedUpgradeChance = getCanonicalUpgradeChance(selectedUpgradeChance);

  upgradeScreenEls.arrowOrbit.style.transition = 'none';
  upgradeScreenEls.arrowOrbit.style.transform = `rotate(${upgradeScreenCurrentRotation}deg)`;
  void upgradeScreenEls.arrowOrbit.offsetWidth;
  upgradeScreenEls.arrowOrbit.style.transition = `transform ${upgradeScreenConfig.duration}ms cubic-bezier(.07,.72,.04,1)`;
  upgradeScreenEls.arrowOrbit.style.transform = `rotate(${targetRotation}deg)`;
  upgradeScreenCurrentRotation = targetRotation;
  lastUpgradeSoundAngle = getUpgradeVisualAngle();
  upgradeSoundFrameId = window.requestAnimationFrame(trackUpgradeSound);

  finishUpgradeAnimation = () => {
    upgradeAnimationTimeoutId = null;
    finishUpgradeAnimation = null;
    upgradeScreenEls.arrowOrbit.style.transition = 'none';
    const win = isInsideUpgradeWinZone(upgradeScreenStopAngle, payoutChance);
    const user = getActiveUser();

    stopUpgradeSoundTracking();
    playUpgradeResultSound(win);
    upgradeScreenSpinning = false;
    setUpgradeControlsLocked(false);

    if (user && upgradeResult.inventory) {
      user.inventory = Array.isArray(upgradeResult.inventory) ? upgradeResult.inventory : [];
      user.upgrades = Number(upgradeResult.upgrades || 0);
      user.bestDrop = upgradeResult.best_drop || user.bestDrop;
      saveActiveUser(user);
      renderProfileInventory();
      renderUpgradeSelectedItem();
      upgradeScreenEls.upgrader?.classList.toggle('win', upgradeResult.won === true);
      if (upgradeScreenEls.status) {
        upgradeScreenEls.status.textContent = upgradeResult.won ? 'Улучшение применено' : 'Попробуйте ещё раз';
      }
      resetUpgradeChanceButtonsState();
      syncUpgradeButtonState();
      setUpgradeControlsLocked(false);
      return;
    }

    if (win) {
      const selectedItem = getSelectedUpgradeItem();
      const rewardPreview = getUpgradeRewardPreview(selectedItem);

      if (user && Array.isArray(user.inventory) && selectedUpgradeItemIndex >= 0 && rewardPreview) {
        const selectedEntry = getUpgradeInventoryItemEntries(user)[selectedUpgradeItemIndex];
        const inventoryIndex = selectedEntry?.inventoryIndex ?? -1;
        if (inventoryIndex < 0) {
          return;
        }

        user.inventory.splice(inventoryIndex, 1);
        user.inventory.push({
          ...rewardPreview,
          isRewardPreview: false,
          upgraded: true,
          price: Number(rewardPreview.price || 0)
        });
        selectedUpgradeItemIndex = clampUpgradeSelectionIndex(user.inventory);
        user.upgrades = Number(user.upgrades || 0) + 1;
        user.bestDrop = getBestDropEver(user, user.inventory);
        saveActiveUser(user);
        const users = getUsers();
        const userIndex = users.findIndex((item) => item.id === user.id || item.username === user.username);
        if (userIndex >= 0) {
          users[userIndex] = { ...users[userIndex], ...user };
          saveUsers(users);
        }
        void syncUserToSupabase(user);
        renderProfileInventory();
      }

      upgradeScreenEls.upgrader?.classList.add('win');
      if (upgradeScreenEls.status) {
        upgradeScreenEls.status.textContent = 'Улучшение применено';
      }
    } else {
      if (user && Array.isArray(user.inventory) && selectedUpgradeItemIndex >= 0 && selectedUpgradeItemIndex < user.inventory.length) {
        const selectedEntry = getUpgradeInventoryItemEntries(user)[selectedUpgradeItemIndex];
        const inventoryIndex = selectedEntry?.inventoryIndex ?? -1;
        if (inventoryIndex < 0) {
          return;
        }

        user.inventory.splice(inventoryIndex, 1);
        selectedUpgradeItemIndex = clampUpgradeSelectionIndex(user.inventory);
        user.bestDrop = getBestDropEver(user, user.inventory);
        saveActiveUser(user);
        const users = getUsers();
        const userIndex = users.findIndex((item) => item.id === user.id || item.username === user.username);
        if (userIndex >= 0) {
          users[userIndex] = { ...users[userIndex], ...user };
          saveUsers(users);
        }
        void syncUserToSupabase(user);
        renderProfileInventory();
      }

      if (upgradeScreenEls.status) {
        upgradeScreenEls.status.textContent = 'Попробуйте ещё раз';
      }
    }

    renderUpgradeSelectedItem();
    upgradeScreenSpinning = false;
    resetUpgradeChanceButtonsState();
    syncUpgradeButtonState();
    setUpgradeControlsLocked(false);
    upgradeScreenEls.result.classList.remove('show');
  };

  upgradeAnimationTimeoutId = window.setTimeout(() => {
    if (finishUpgradeAnimation) {
      finishUpgradeAnimation();
    }
  }, upgradeScreenConfig.duration + 150);
}

setUpgradeChance(upgradeScreenConfig.chance);
setUpgradeAnimationSpeed(false);
selectedUpgradeItemIndex = -1;
renderUpgradeSelectedItem();
syncUpgradeButtonState();

if (upgradeScreenEls.selectedItemSlot) {
  upgradeScreenEls.selectedItemSlot.addEventListener('click', () => {
    if (!upgradeScreenEls.inventoryPicker) {
      return;
    }

    const items = getUpgradeInventoryItems();
    if (!items.length) {
      upgradeScreenEls.inventoryPicker.hidden = true;
      return;
    }

    upgradeScreenEls.inventoryPicker.innerHTML = items.map((item, index) => {
      const itemRarity = item.rarity || 'blue';
      const isActive = index === selectedUpgradeItemIndex;
      return `
        <button type="button" class="upgrade-panel__slot-option ${isActive ? 'is-active' : ''}" data-index="${index}">
          <div class="profile-screen__inventory-item ${isActive ? 'is-active' : ''}">
            <div class="profile-screen__inventory-art ${itemRarity}" style="border-bottom-color: var(--rarity-${itemRarity})">
              <div class="profile-screen__inventory-tag">${item.name}</div>
              <img src="${item.image || getSkinImageByRarity(itemRarity)}" alt="${item.name}" draggable="false" />
              <div class="profile-screen__inventory-price">${formatPrice(item.price)}</div>
            </div>
          </div>
        </button>
      `;
    }).join('');

    upgradeScreenEls.inventoryPicker.querySelectorAll('.upgrade-panel__slot-option').forEach((option) => {
      option.addEventListener('click', () => {
        selectedUpgradeItemIndex = Number(option.dataset.index);
        selectedUpgradeRewardKey = '';
        selectedUpgradeRewardItem = null;
        renderUpgradeSelectedItem();
        upgradeScreenEls.inventoryPicker.hidden = true;
      });
    });

    upgradeScreenEls.inventoryPicker.hidden = !upgradeScreenEls.inventoryPicker.hidden;
  });

  upgradeScreenEls.selectedItemSlot.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      upgradeScreenEls.selectedItemSlot.click();
    }
  });
}

const upgradeChanceButtons = document.querySelectorAll('.upgrade-screen .upgrade-panel__multiplier');
upgradeChanceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (upgradeScreenSpinning) {
      return;
    }

    const chance = Number(button.dataset.chance || upgradeScreenConfig.chance || 40);
    if (Number.isFinite(chance)) {
      upgradeScreenSpinning = false;
      setUpgradeControlsLocked(false);
      setUpgradeChance(chance);
      refreshUpgradeUiAfterChanceChange();
    }
  });
});

if (upgradeScreenEls.button) {
  upgradeScreenEls.button.addEventListener('click', () => {
    const selectedItem = getSelectedUpgradeItem();
    if (!selectedItem) {
      if (upgradeScreenEls.status) {
        upgradeScreenEls.status.textContent = 'Выберите предмет из инвентаря';
      }
      syncUpgradeButtonState();
      return;
    }

    runUpgradeAnimation();
  });
}

if (upgradeScreenEls.speedToggle) {
  upgradeScreenEls.speedToggle.addEventListener('click', () => {
    if (upgradeScreenSpinning) {
      return;
    }

    setUpgradeAnimationSpeed(!upgradeAnimationFast);
  });
}

if (upgradeScreenEls.result) {
  upgradeScreenEls.result.addEventListener('click', () => {
    upgradeScreenEls.result.classList.remove('show');
  });
}

if (settingsCloseBtn) {
  settingsCloseBtn.addEventListener('click', closeSettingsModal);
}

if (settingsBackdrop) {
  settingsBackdrop.addEventListener('click', closeSettingsModal);
}

if (settingsSubmit) {
  settingsSubmit.addEventListener('click', () => {
    saveSettingsForm();
    closeSettingsModal();
  });
}

streamerToggle?.addEventListener('click', () => {
  const enabled = !body.classList.contains('streamer-mode');
  body.classList.toggle('streamer-mode', enabled);
  localStorage.setItem(STREAMER_MODE_KEY, String(enabled));
  streamerToggle.setAttribute('aria-pressed', String(enabled));
  replaceVisibleCurrencySymbols();
  renderHomeCaseSections();
  renderProfileBalance();
  renderProfileInventory();
  renderProfileStats();
  renderLiveFeed();
});

if (authCloseBtn) {
  authCloseBtn.addEventListener('click', closeAuthModal);
}

if (authBackdrop) {
  authBackdrop.addEventListener('click', closeAuthModal);
}

if (authSubmit) {
  authSubmit.addEventListener('click', () => {
    if (!authSubmit.disabled) {
      openLoginModal();
    }
  });
}

if (authRegisterBtn) {
  authRegisterBtn.addEventListener('click', () => {
    if (!authRegisterBtn.disabled) {
      openRegisterModal();
    }
  });
}

if (loginCloseBtn) {
  loginCloseBtn.addEventListener('click', () => {
    closeLoginModal();
    if (loginError) {
      loginError.textContent = '';
    }
  });
}

if (loginBackdrop) {
  loginBackdrop.addEventListener('click', () => {
    closeLoginModal();
    if (loginError) {
      loginError.textContent = '';
    }
  });
}

if (registerCloseBtn) {
  registerCloseBtn.addEventListener('click', () => {
    closeRegisterModal();
    if (registerError) {
      registerError.textContent = '';
    }
  });
}

if (registerBackdrop) {
  registerBackdrop.addEventListener('click', () => {
    closeRegisterModal();
    if (registerError) {
      registerError.textContent = '';
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usernameInput = loginForm.querySelector('input[type="text"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');
    const username = (usernameInput?.value || '').trim();
    const password = (passwordInput?.value || '').trim();

    if (!username || !password) {
      if (loginError) {
        loginError.textContent = 'Введите имя пользователя и пароль.';
      }
      return;
    }

    if (!supabaseClient) {
      if (loginError) {
        loginError.textContent = 'Сервис авторизации недоступен.';
      }
      return;
    }

    const email = `${username.toLowerCase()}@users.dustdrop.local`;
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      if (loginError) {
        loginError.textContent = 'Пользователь не найден. Проверьте данные.';
      }
      return;
    }

    const profile = await refreshActiveUserFromSupabase();
    if (!profile) {
      await supabaseClient.auth.signOut();
      if (loginError) loginError.textContent = 'Профиль пользователя не найден.';
      return;
    }

    closeLoginModal();
    updateProfileUI();
    if (loginError) loginError.textContent = '';
    if (loginUsernameInput) {
      loginUsernameInput.value = '';
    }
    if (passwordInput) {
      passwordInput.value = '';
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fields = registerForm.querySelectorAll('input');
    const [usernameInput, passwordInput, repeatPasswordInput] = fields;
    const username = (usernameInput?.value || '').trim();
    const password = (passwordInput?.value || '').trim();
    const repeatPassword = (repeatPasswordInput?.value || '').trim();

    if (!username || !password || !repeatPassword) {
      if (registerError) {
        registerError.textContent = 'Заполните все поля.';
      }
      return;
    }

    if (!/^[A-Za-z]{5,}$/.test(username)) {
      if (registerError) {
        registerError.textContent = 'Ник должен содержать минимум 5 латинских букв без цифр.';
      }
      return;
    }

    if (password.length < 6) {
      if (registerError) {
        registerError.textContent = 'Пароль должен содержать минимум 6 символов.';
      }
      return;
    }

    if (password !== repeatPassword) {
      if (registerError) {
        registerError.textContent = 'Пароли не совпадают.';
      }
      return;
    }

    if (!supabaseClient) {
      if (registerError) registerError.textContent = 'Сервис авторизации недоступен.';
      return;
    }

    const email = `${username.toLowerCase()}@users.dustdrop.local`;
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: { data: { username } }
    });
    if (error || !data.user) {
      if (registerError) registerError.textContent = error?.message || 'Не удалось создать аккаунт.';
      return;
    }

    const newUser = normalizeUser({ id: generateUuid(), username, role: 'user' });
    saveActiveUser(newUser);
    if (!await syncUserToSupabase(newUser)) {
      if (registerError) registerError.textContent = lastSupabaseError || 'Не удалось создать профиль.';
      return;
    }
    closeRegisterModal();
    updateProfileUI();
    if (registerError) {
      registerError.textContent = '';
    }
    fields.forEach((field) => {
      field.value = '';
    });
  });
}

if (authCheckboxes.length) {
  authCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', () => {
      const nextValue = checkbox.getAttribute('aria-checked') === 'true' ? 'false' : 'true';
      checkbox.setAttribute('aria-checked', nextValue);

      const hasAllChecked = Array.from(authCheckboxes).every((item) => item.getAttribute('aria-checked') === 'true');
      if (authSubmit) {
        authSubmit.disabled = !hasAllChecked;
      }
      if (authRegisterBtn) {
        authRegisterBtn.disabled = !hasAllChecked;
      }
    });
  });
}

if (casePriceEl) {
  casePriceEl.addEventListener('click', () => {
    if (caseDetail && caseDetail.classList.contains('case-result')) {
      triggerCaseOpenAction();
      return;
    }

    triggerCaseOpenAction();
  });
}

if (caseSellEl) {
  caseSellEl.addEventListener('click', () => {
    sellLatestItem();
    resetCaseToStartState();
  });
}

if (caseClose) {
  caseClose.addEventListener('click', closeCaseDetail);
}

if (caseDetail) {
  caseDetail.addEventListener('click', (event) => {
    if (event.target === caseDetail) {
      closeCaseDetail();
    }
  });
}

if (supabaseClient) {
  supabaseClient.auth.getSession().then(({ data }) => {
    if (data?.session) {
      void refreshActiveUserFromSupabase();
    } else {
      saveActiveUser(null);
      updateProfileUI();
    }
  });
} else {
  saveActiveUser(null);
  updateProfileUI();
}

if (supabaseClient) {
  supabaseClient
    .channel('cb_profile_updates')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
      void refreshActiveUserFromSupabase();
    })
    .subscribe();

  supabaseClient
    .channel('cb_payout_settings')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
      void refreshActiveUserFromSupabase();
    })
    .subscribe();
}
