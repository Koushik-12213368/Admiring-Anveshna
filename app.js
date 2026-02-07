(function () {
  'use strict';

  // Her password (with hint on login screen)
  const PASSWORD = 'LOVE';
  // Your admin password — see all days regardless of date
  const ADMIN_PASSWORD = '1968';
  const STORAGE_KEY = 'valentine_unlocked';
  const STORAGE_ADMIN = 'valentine_admin';

  // Edit the 'note' for each day to add your personal message for Anveshna
  const VALENTINE_WEEK = {
    rose:      { date: 7,  label: 'Rose Day',      emoji: '🌹', greeting: 'Happy Rose Day Anveshna', note: 'You make every day bloom. Here\'s to you — my favourite person.' },
    propose:   { date: 8,  label: 'Propose Day',   emoji: '💍', greeting: 'Happy Propose Day Anveshna', note: 'I choose you, today and every day.' },
    chocolate: { date: 9,  label: 'Chocolate Day', emoji: '🍫', greeting: 'Happy Chocolate Day Anveshna', note: 'Sweet like you. Thanks for being the sweetest part of my life.' },
    teddy:     { date: 10, label: 'Teddy Day',     emoji: '🧸', greeting: 'Happy Teddy Day Anveshna', note: 'You\'re the one I want to hold close, always.' },
    promise:   { date: 11, label: 'Promise Day',   emoji: '💝', greeting: 'Happy Promise Day Anveshna', note: 'I promise to be there for you, to make you smile, and to love you through it all.' },
    hug:       { date: 12, label: 'Hug Day',       emoji: '🤗', greeting: 'Happy Hug Day Anveshna', note: 'Sending you the biggest hug. You mean the world to me.' },
    kiss:      { date: 13, label: 'Kiss Day',      emoji: '💋', greeting: 'Happy Kiss Day Anveshna', note: 'Every moment with you is worth celebrating.' },
    valentine: { date: 14, label: "Valentine's Day", emoji: '❤️', greeting: "Happy Valentine's Day Anveshna", note: 'Thank you for being you. I love you, today and forever.' }
  };

  const DAY_KEYS = Object.keys(VALENTINE_WEEK);

  // Optional videos per day (shown in main content)
  const DAY_VIDEOS = {
    rose: 'Packages/WhatsApp Video 2026-02-06 at 1.22.15 AM.mp4',
    propose: 'Packages/WhatsApp Video 2026-02-06 at 3.56.11 PM.mp4',
    chocolate: 'Packages/WhatsApp Video 2026-02-08 at 1.02.19 AM.mp4',
    teddy: 'Packages/WhatsApp Video 2026-02-08 at 12.47.19 AM.mp4'
  };

  // All dates and times use Philadelphia (America/New_York)
  const TIMEZONE = 'America/New_York';

  function getPhillyParts() {
    var formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIMEZONE,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    var parts = formatter.formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    return o;
  }

  function getToday() {
    var p = getPhillyParts();
    return {
      year: parseInt(p.year, 10),
      month: parseInt(p.month, 10) - 1,
      date: parseInt(p.day, 10)
    };
  }

  function getValentineWeekState() {
    var t = getToday();
    const feb = 1; // February
    if (t.month !== feb) {
      if (t.month < feb || (t.month === feb && t.date < 7))
        return { status: 'before', dayKey: null };
      return { status: 'after', dayKey: null };
    }
    if (t.date < 7) return { status: 'before', dayKey: null };
    if (t.date > 14) return { status: 'after', dayKey: null };
    const dayKey = DAY_KEYS.find(function (k) { return VALENTINE_WEEK[k].date === t.date; });
    return { status: 'active', dayKey: dayKey || null };
  }

  function isUnlocked() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1' || sessionStorage.getItem(STORAGE_ADMIN) === '1';
    } catch (e) {
      return false;
    }
  }

  function isAdminMode() {
    try {
      return sessionStorage.getItem(STORAGE_ADMIN) === '1';
    } catch (e) {
      return false;
    }
  }

  function setUnlocked(admin) {
    try {
      if (admin) {
        sessionStorage.setItem(STORAGE_ADMIN, '1');
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        sessionStorage.setItem(STORAGE_KEY, '1');
        sessionStorage.removeItem(STORAGE_ADMIN);
      }
    } catch (e) {}
  }

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(function (el) {
      el.classList.toggle('active', el.id === id);
    });
  }

  function showLoginError(msg) {
    var el = document.getElementById('login-error');
    if (el) el.textContent = msg || '';
  }

  function playUnlockAnimation(callback) {
    var lockBody = document.getElementById('lock-body');
    if (lockBody) lockBody.classList.add('unlocking');
    setTimeout(function () {
      heartsBurst();
      setTimeout(function () {
        if (lockBody) lockBody.classList.remove('unlocking');
        if (callback) callback();
      }, 1400);
    }, 700);
  }

  function heartsBurst() {
    var container = document.getElementById('unlock-celebration');
    if (!container) return;
    container.innerHTML = '';
    var symbols = ['❤', '💕', '💗', '🌸', '💖'];
    var count = 28;
    var centerX = 50;
    var centerY = 50;
    for (var i = 0; i < count; i++) {
      var el = document.createElement('span');
      el.className = 'burst-heart';
      el.textContent = symbols[i % symbols.length];
      var angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      var dist = 80 + Math.random() * 60;
      var tx = Math.cos(angle) * dist - 50;
      var ty = Math.sin(angle) * dist - 50;
      el.style.left = centerX + '%';
      el.style.top = centerY + '%';
      el.style.setProperty('--tx', tx + 'px');
      el.style.setProperty('--ty', ty + 'px');
      container.appendChild(el);
    }
    setTimeout(function () { container.innerHTML = ''; }, 1300);
  }

  var typewriterTimer = null;
  function typewriterMessage(el, text, callback) {
    if (!el) return;
    if (typewriterTimer) clearTimeout(typewriterTimer);
    el.textContent = '';
    el.classList.add('typewriting');
    var i = 0;
    function tick() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        typewriterTimer = setTimeout(tick, 50 + Math.random() * 30);
      } else {
        el.classList.remove('typewriting');
        typewriterTimer = null;
        if (callback) callback();
      }
    }
    tick();
  }

  function spawnClickBurst(clientX, clientY) {
    var symbols = ['❤', '💕', '💗', '💖'];
    for (var i = 0; i < 10; i++) {
      var el = document.createElement('span');
      el.className = 'burst-float';
      el.textContent = symbols[i % symbols.length];
      var bx = (Math.random() - 0.5) * 80;
      var by = (Math.random() - 0.5) * 40;
      el.style.left = (clientX + bx) + 'px';
      el.style.top = (clientY + by) + 'px';
      el.style.setProperty('--bx', (Math.random() - 0.5) * 40 + 'px');
      el.style.setProperty('--by', (Math.random() - 0.5) * 20 + 'px');
      document.body.appendChild(el);
      setTimeout(function (elem) {
        if (elem.parentNode) elem.parentNode.removeChild(elem);
      }, 1600, el);
    }
  }

  function renderTimer(state, isAdmin) {
    var timerEl = document.getElementById('timer');
    if (!timerEl) return;
    if (isAdmin) {
      timerEl.textContent = 'View any day — admin';
      return;
    }
    var t = getToday();
    var feb = 1; // February = month index 1
    var now = Date.now();

    if (state.status === 'before') {
      // Feb 7 00:00 Philadelphia (EST = UTC-5 in February)
      var roseDayUTC = Date.UTC(t.year, feb, 7, 5, 0, 0);
      if (now > roseDayUTC) roseDayUTC = Date.UTC(t.year + 1, feb, 7, 5, 0, 0);
      var diff = roseDayUTC - now;
      if (diff <= 0) {
        timerEl.textContent = "Valentine's week starts today!";
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      timerEl.textContent = "Rose Day in " + d + "d " + h + "h " + m + "m (Philadelphia time)";
      return;
    }

    if (state.status === 'after') {
      timerEl.textContent = "Valentine's Week has ended. See you next year! 💕";
      return;
    }

    // Active day: time left in current day in Philadelphia
    var p = getPhillyParts();
    var hour = parseInt(p.hour, 10);
    var minute = parseInt(p.minute, 10);
    var second = parseInt(p.second, 10);
    var secsSinceMidnight = hour * 3600 + minute * 60 + second;
    var secsLeftInDay = 86400 - secsSinceMidnight;
    if (secsLeftInDay <= 0) {
      timerEl.textContent = "Day just ended. Come back tomorrow!";
      return;
    }
    var lh = Math.floor(secsLeftInDay / 3600);
    var lm = Math.floor((secsLeftInDay % 3600) / 60);
    var dayInfo = VALENTINE_WEEK[state.dayKey];
    timerEl.textContent = dayInfo.label + " — " + lh + "h " + lm + "m left today (Philadelphia time)";
  }

  function renderDayContent(state, forceDayKey) {
    var content = document.getElementById('day-content');
    var badge = document.getElementById('day-badge');
    var message = document.getElementById('day-message');
    var visual = document.getElementById('day-visual');
    var footer = document.getElementById('footer-note');
    var dayNoteEl = document.getElementById('day-note');
    var app = document.getElementById('app-screen');

    if (!content || !app) return;

    var videoWrap = document.getElementById('day-video-wrap');
    var dayVideo = document.getElementById('day-video');

    var clickMe = document.getElementById('rose-click-me');

    // Admin: force showing a specific day
    if (forceDayKey && VALENTINE_WEEK[forceDayKey]) {
      var day = VALENTINE_WEEK[forceDayKey];
      app.setAttribute('data-day', forceDayKey);
      if (badge) badge.textContent = day.label;
      typewriterMessage(message, day.greeting);

      if (DAY_VIDEOS[forceDayKey]) {
        if (videoWrap) videoWrap.removeAttribute('hidden');
        if (visual) { visual.textContent = ''; visual.style.display = 'none'; visual.classList.remove('click-burst'); }
        if (dayVideo) {
          dayVideo.src = DAY_VIDEOS[forceDayKey];
          if (clickMe) clickMe.removeAttribute('hidden');
          dayVideo.setAttribute('hidden', '');
          dayVideo.load();
        }
      } else {
        if (videoWrap) videoWrap.setAttribute('hidden', '');
        if (visual) {
          visual.textContent = day.emoji;
          visual.style.display = '';
          visual.classList.toggle('click-burst', forceDayKey === 'kiss' || forceDayKey === 'hug');
        }
        if (clickMe) clickMe.setAttribute('hidden', '');
      }
      if (dayNoteEl) { dayNoteEl.textContent = day.note || ''; dayNoteEl.style.display = day.note ? 'block' : 'none'; }
      if (footer) footer.textContent = 'Day ' + day.date + " of Valentine's Week (admin)";
      return;
    }

    if (state.status === 'before') {
      app.removeAttribute('data-day');
      if (badge) badge.textContent = "Coming soon";
      if (message) { message.textContent = "Your surprises begin on Rose Day — February 7. Come back then!"; message.classList.remove('typewriting'); }
      if (videoWrap) videoWrap.setAttribute('hidden', '');
      if (visual) { visual.textContent = '🌹'; visual.style.display = ''; visual.classList.remove('click-burst'); }
      if (dayNoteEl) dayNoteEl.style.display = 'none';
      if (footer) footer.textContent = "Rose Day → Propose Day → ... → Valentine's Day";
      return;
    }

    if (state.status === 'after') {
      app.removeAttribute('data-day');
      if (badge) badge.textContent = "Valentine's Week Over";
      if (message) { message.textContent = "Thank you for every day, Anveshna. Until next year! 💕"; message.classList.remove('typewriting'); }
      if (videoWrap) videoWrap.setAttribute('hidden', '');
      if (visual) { visual.textContent = '💕'; visual.style.display = ''; visual.classList.remove('click-burst'); }
      if (dayNoteEl) dayNoteEl.style.display = 'none';
      if (footer) footer.textContent = "February 7–14";
      return;
    }

    var day = VALENTINE_WEEK[state.dayKey];
    app.setAttribute('data-day', state.dayKey);
    if (badge) badge.textContent = day.label;
    typewriterMessage(message, day.greeting);
    if (DAY_VIDEOS[state.dayKey]) {
      if (videoWrap) videoWrap.removeAttribute('hidden');
      if (visual) { visual.textContent = ''; visual.style.display = 'none'; visual.classList.remove('click-burst'); }
      if (dayVideo) {
        dayVideo.src = DAY_VIDEOS[state.dayKey];
        if (clickMe) clickMe.removeAttribute('hidden');
        dayVideo.setAttribute('hidden', '');
        dayVideo.load();
      }
    } else {
      if (videoWrap) videoWrap.setAttribute('hidden', '');
      if (visual) {
        visual.textContent = day.emoji;
        visual.style.display = '';
        visual.classList.toggle('click-burst', state.dayKey === 'kiss' || state.dayKey === 'hug');
      }
      if (clickMe) clickMe.setAttribute('hidden', '');
    }
    if (dayNoteEl) { dayNoteEl.textContent = day.note || ''; dayNoteEl.style.display = day.note ? 'block' : 'none'; }
    var nextDayKey = DAY_KEYS[DAY_KEYS.indexOf(state.dayKey) + 1];
    var tomorrowText = nextDayKey ? 'Tomorrow: ' + VALENTINE_WEEK[nextDayKey].label + ' ' + VALENTINE_WEEK[nextDayKey].emoji : '';
    if (footer) footer.textContent = "Day " + day.date + " of Valentine's Week" + (tomorrowText ? " · " + tomorrowText : '');
  }

  function openDailyPopup(state, forceDayKey) {
    var popup = document.getElementById('daily-popup');
    var title = document.getElementById('popup-title');
    var visual = document.getElementById('popup-visual');
    var subtitle = document.getElementById('popup-subtitle');
    if (!popup || !title || !visual) return;
    var dayKey = forceDayKey || (state.status === 'active' ? state.dayKey : null);
    if (!dayKey || !VALENTINE_WEEK[dayKey]) return;

    var day = VALENTINE_WEEK[dayKey];
    title.textContent = day.greeting;
    visual.textContent = day.emoji;
    visual.className = 'popup-visual';
    var card = popup.querySelector('.popup-card');
    if (card) card.classList.toggle('rose-popup', dayKey === 'rose');
    if (subtitle) subtitle.textContent = day.label;
    popup.removeAttribute('hidden');

    var dayMusicIds = { rose: 'rose-popup-music', propose: 'propose-popup-music', chocolate: 'chocolate-popup-music', teddy: 'teddy-popup-music' };
    var musicId = dayMusicIds[dayKey];
    if (musicId) {
      var el = document.getElementById(musicId);
      if (el) el.play().catch(function () {});
    }
  }

  function closeDailyPopup() {
    var popup = document.getElementById('daily-popup');
    if (popup) popup.setAttribute('hidden', '');
    ['rose-popup-music', 'propose-popup-music', 'chocolate-popup-music', 'teddy-popup-music'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.pause();
    });
  }

  function tickTimer(state, isAdmin) {
    renderTimer(state, isAdmin);
  }

  function buildAdminDayPicker(selectedKey, onSelect) {
    var wrap = document.getElementById('admin-day-picker');
    if (!wrap) return;
    wrap.innerHTML = '';
    wrap.removeAttribute('hidden');
    DAY_KEYS.forEach(function (k) {
      var day = VALENTINE_WEEK[k];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = day.emoji + ' ' + day.label;
      btn.classList.toggle('active', k === selectedKey);
      btn.addEventListener('click', function () {
        wrap.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        onSelect(k);
      });
      wrap.appendChild(btn);
    });
  }

  function startFloatingHearts(dayKey) {
    var container = document.getElementById('floating-hearts');
    if (!container || container.children.length > 0) return;
    var symbols = dayKey === 'rose' ? ['🌹', '🌸', '🌷'] : ['❤', '💕', '💗'];
    for (var i = 0; i < 12; i++) {
      var el = document.createElement('span');
      el.className = 'heart';
      el.textContent = symbols[i % symbols.length];
      el.style.left = Math.random() * 100 + '%';
      el.style.animationDelay = Math.random() * 12 + 's';
      el.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
      container.appendChild(el);
    }
  }

  function enterAdminMode() {
    var state = getValentineWeekState();
    var initialKey = (state.status === 'active' && state.dayKey) ? state.dayKey : DAY_KEYS[0];
    buildAdminDayPicker(initialKey, function (dayKey) {
      renderDayContent(state, dayKey);
      openDailyPopup(state, dayKey);
    });
    renderDayContent(state, initialKey);
    renderTimer(state, true);
    openDailyPopup(state, initialKey);
    startFloatingHearts(initialKey);
  }

  // Login form
  var form = document.getElementById('login-form');
  var input = document.getElementById('password');
  if (form && input) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showLoginError('');
      var value = (input.value || '').trim();
      if (value === ADMIN_PASSWORD) {
        setUnlocked(true);
        input.value = '';
        showScreen('app-screen');
        enterAdminMode();
      } else if (value === PASSWORD) {
        setUnlocked(false);
        input.value = '';
        playUnlockAnimation(function () {
          showScreen('app-screen');
          var state = getValentineWeekState();
          startFloatingHearts(state.dayKey);
          renderDayContent(state);
          renderTimer(state, false);
          openDailyPopup(state);
          setInterval(function () { tickTimer(getValentineWeekState(), false); }, 60000);
        });
      } else {
        showLoginError('Wrong key. Try again.');
      }
    });
  }

  // Popup close
  var closeBtn = document.getElementById('popup-close');
  var popup = document.getElementById('daily-popup');
  if (closeBtn) closeBtn.addEventListener('click', closeDailyPopup);
  var backdrop = document.querySelector('.popup-backdrop');
  if (backdrop) backdrop.addEventListener('click', closeDailyPopup);

  var roseClickMe = document.getElementById('rose-click-me');
  var dayVideo = document.getElementById('day-video');
  if (roseClickMe && dayVideo) {
    roseClickMe.addEventListener('click', function () {
      roseClickMe.setAttribute('hidden', '');
      dayVideo.removeAttribute('hidden');
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('click-burst')) {
      spawnClickBurst(e.clientX, e.clientY);
    }
  });

  // Already unlocked (from previous tab/session)
  if (isUnlocked()) {
    showScreen('app-screen');
    var state = getValentineWeekState();
    startFloatingHearts(isAdminMode() ? (state.status === 'active' ? state.dayKey : null) : state.dayKey);
    if (isAdminMode()) {
      enterAdminMode();
    } else {
      renderDayContent(state);
      renderTimer(state, false);
      openDailyPopup(state);
      setInterval(function () { tickTimer(getValentineWeekState(), false); }, 60000);
    }
  }
})();
