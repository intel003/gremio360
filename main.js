/* ============================================
   GREMIO 360 – main.js
   Minimal, dependency-free JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ---------- 1. Live Date ---------- */
  function setDate() {
    var el = document.getElementById('current-date');
    if (!el) return;
    var opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    el.textContent = new Date().toLocaleDateString('es-AR', opts);
  }

  /* ---------- 2. Footer Year ---------- */
  function setYear() {
    var el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- 3. Hamburger Menu ---------- */
  function initMenu() {
    var btn     = document.getElementById('hamburger-btn');
    var nav     = document.getElementById('main-nav');
    var overlay = document.getElementById('nav-overlay');
    if (!btn || !nav || !overlay) return;

    function openMenu() {
      nav.hidden = false;
      nav.classList.add('is-open');
      overlay.classList.add('is-visible');
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      nav.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      // After animation, hide from accessibility tree
      setTimeout(function () {
        if (!nav.classList.contains('is-open')) nav.hidden = true;
      }, 240);
    }

    function toggleMenu() {
      btn.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    }

    btn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // Close on nav link click (mobile)
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 768) closeMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && nav.classList.contains('is-open')) {
        closeMenu();
        btn.focus();
      }
    });

    // On desktop resize: ensure nav is visible and body overflow is reset
    var mq = window.matchMedia('(min-width: 768px)');
    function handleBreakpoint(e) {
      if (e.matches) {
        nav.hidden = false;
        document.body.style.overflow = '';
        overlay.classList.remove('is-visible');
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        if (!nav.classList.contains('is-open')) nav.hidden = true;
      }
    }
    mq.addEventListener('change', handleBreakpoint);
    handleBreakpoint(mq);
  }

  /* ---------- 4. Ticker Duplicate (seamless loop) ---------- */
  function initTicker() {
    var track = document.getElementById('ticker-track');
    if (!track) return;
    // Duplicate content for seamless infinite scroll
    var clone = track.innerHTML;
    track.innerHTML += clone;
  }

  /* ---------- 5. Newsletter form ---------- */
  function initNewsletter() {
    var form = document.querySelector('.newsletter-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('.newsletter-input');
      var btn   = form.querySelector('.newsletter-btn');
      if (!input || !btn) return;
      btn.textContent = 'Suscripto!';
      btn.disabled = true;
      input.value = '';
      setTimeout(function () {
        btn.textContent = 'Suscribirme';
        btn.disabled = false;
      }, 4000);
    });
  }

  /* ---------- 6. Smooth scroll for anchor links ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href.length <= 1) return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var headerH = document.querySelector('.site-header');
          var offset  = headerH ? headerH.offsetHeight + 8 : 64;
          var top     = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ---------- 7. Header shadow on scroll ---------- */
  function initScrollHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,.12)' : '';
    }, { passive: true });
  }

  


  /* ---------- 9. Conflict Day Counter ---------- */
  function initConflictCounter() {
    var el = document.getElementById('conflict-days');
    if (!el) return;
    // ← CONFIGURAR: fecha de inicio del conflicto (YYYY, MM-1, DD)
    var conflictStart = new Date(2026, 6, 23); // 23 julio 2026
    var today = new Date();
    var diff = Math.floor((today - conflictStart) / (1000 * 60 * 60 * 24));
    el.textContent = diff > 0 ? diff : 0;
  }

  /* ---------- 10. WhatsApp Channel Banner close ---------- */
  function initWaBanner() {
    var bar   = document.querySelector('.wa-channel-bar');
    var close = document.getElementById('wa-channel-close');
    if (!bar || !close) return;

    // Remember dismissed state per session
    if (sessionStorage.getItem('g360-wa-closed')) {
      bar.classList.add('is-hidden');
      return;
    }
    close.addEventListener('click', function () {
      bar.classList.add('is-hidden');
      sessionStorage.setItem('g360-wa-closed', '1');
    });
  }

  /* ---------- 11. Salary Calculator ---------- */
  function initCalculator() {
    var btn     = document.getElementById('calc-btn');
    var results = document.getElementById('calc-results');
    if (!btn || !results) return;

    function fmt(n) {
      return '$' + Math.round(n).toLocaleString('es-AR');
    }

    btn.addEventListener('click', function () {
      var raw = parseFloat(document.getElementById('calc-sueldo').value);
      var cat = parseFloat(document.getElementById('calc-categoria').value);
      if (!raw || raw <= 0) {
        document.getElementById('calc-sueldo').focus();
        return;
      }
      var base  = raw * cat;
      var low   = base * 1.12;
      var high  = base * 1.18;
      var diff  = high - low;
      var annual = diff * 12;

      document.getElementById('calc-low').textContent   = fmt(low);
      document.getElementById('calc-high').textContent  = fmt(high);
      document.getElementById('calc-diff').textContent  = fmt(diff);
      document.getElementById('calc-annual').textContent = fmt(annual);

      // WhatsApp share link
      var msg = encodeURIComponent(
        'Gremio 360 - Calculadora Salarial\n' +
        'Mi sueldo basico: ' + fmt(raw) + '\n' +
        'Con oferta patronal 12%: ' + fmt(low) + '\n' +
        'Con pedido de base 18%: ' + fmt(high) + '\n' +
        'Me estan robando ' + fmt(diff) + ' por mes!\n' +
        'Calcula el tuyo: https://gremio360.com.ar'
      );
      var shareLink = document.getElementById('calc-share');
      if (shareLink) shareLink.href = 'https://wa.me/?text=' + msg;

      results.hidden = false;
      results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Also trigger on Enter in input
    var input = document.getElementById('calc-sueldo');
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') btn.click();
      });
    }
  }

  /* ---------- 12. Hero Mode Switch (En Criollo) ---------- */
  function initHeroModeSwitch() {
    var btnFormal  = document.getElementById('hero-mode-formal');
    var btnCriollo = document.getElementById('hero-mode-criollo');
    var leadText   = document.getElementById('hero-lead-text');
    var criolloBox = document.getElementById('hero-criollo-box');

    if (!btnFormal || !btnCriollo || !leadText || !criolloBox) return;

    btnFormal.addEventListener('click', function () {
      btnFormal.classList.add('active');
      btnCriollo.classList.remove('active');
      leadText.hidden = false;
      criolloBox.hidden = true;
    });

    btnCriollo.addEventListener('click', function () {
      btnCriollo.classList.add('active');
      btnFormal.classList.remove('active');
      leadText.hidden = true;
      criolloBox.hidden = false;
    });
  }

  /* ---------- 13. Termómetro de la Base (Live Poll) ---------- */
  function initPoll() {
    var container = document.getElementById('poll-options');
    var votedMsg  = document.getElementById('poll-voted-msg');
    var totalEl   = document.getElementById('poll-total-votes');
    if (!container) return;

    var hasVoted = localStorage.getItem('g360-poll-voted');

    if (hasVoted) {
      container.classList.add('has-voted');
      if (votedMsg) votedMsg.hidden = false;
      var selectedBtn = container.querySelector('[data-choice="' + hasVoted + '"]');
      if (selectedBtn) selectedBtn.classList.add('is-selected');
    }

    container.querySelectorAll('.poll-opt-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (container.classList.contains('has-voted')) return;

        var choice = this.getAttribute('data-choice');
        localStorage.setItem('g360-poll-voted', choice);

        this.classList.add('is-selected');
        container.classList.add('has-voted');
        if (votedMsg) votedMsg.hidden = false;

        // Visual counter bump
        if (totalEl) totalEl.textContent = 'Total: 1.429 votos';
      });
    });
  }

  
  /* ---------- 14. Weather & Dollar (Auto) ---------- */
  function initWeatherAndDollar() {
    var weatherEl = document.getElementById('header-weather');
    if (!weatherEl) return;
    
    // Fetch Weather (Open-Meteo)
    fetch('https://api.open-meteo.com/v1/forecast?latitude=-34.6131&longitude=-58.3772&current_weather=true')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.current_weather) {
          var temp = Math.round(data.current_weather.temperature);
          var code = data.current_weather.weathercode;
          var icon = '☀️'; // Default sun
          if (code >= 1 && code <= 3) icon = '⛅'; // Clouds/Sun
          if (code >= 45 && code <= 48) icon = '🌫️'; // Fog
          if (code >= 51 && code <= 67) icon = '🌧️'; // Rain
          if (code >= 71 && code <= 77) icon = '❄️'; // Snow
          if (code >= 95 && code <= 99) icon = '⛈️'; // Thunderstorm
          
          weatherEl.innerHTML = icon + ' CABA ' + temp + '&deg;C';
        }
      })
      .catch(function(err) { console.error(err); });

    // Fetch Dólar Blue (DolarAPI)
    var dollarEl = document.createElement('span');
    dollarEl.className = 'header-dollar';
    dollarEl.style.marginLeft = '12px';
    dollarEl.innerHTML = 'Cargando dólar...';
    weatherEl.parentNode.insertBefore(dollarEl, weatherEl.nextSibling);

    fetch('https://dolarapi.com/v1/dolares/blue')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data && data.venta) {
          dollarEl.innerHTML = '💵 Blue: $' + data.venta;
        }
      })
      .catch(function(err) { dollarEl.style.display = 'none'; });
  }


  /* ---------- 15. Paritarias Selector ---------- */
  function initParitarias() {
    var select = document.getElementById('gremio-select');
    var ofertaEl = document.getElementById('paritaria-oferta');
    var pedidoEl = document.getElementById('paritaria-pedido');
    var estadoText = document.getElementById('paritaria-estado-text');
    var reunionEl = document.getElementById('paritaria-reunion');
    var conflictDays = document.getElementById('conflict-days');
    var conflictWidget = document.getElementById('conflict-widget');

    if (!select || !ofertaEl) return;

    var gremiosData = {
    'comercio': {
      oferta: '5,7% trimestral + Bono $120.000',
      pedido: 'Revisión permanente sin topes',
      estado: 'ACUERDO CERRADO (Último tramo en sep)',
      reunion: 'Octubre 2026 (próxima revisión)'
    },
    'camioneros': {
      oferta: '10,1% semestral (cerrado)',
      pedido: 'Reapertura urgente + 20% extra por profesionalidad',
      estado: 'EN NEGOCIACIÓN / TENSIÓN',
      reunion: 'Audiencia pedida urgente'
    },
    'seguridad': {
      oferta: '17,35% semestral (Básico Sept: $1.037.600)',
      pedido: 'Conformado bruto $1.79M',
      estado: 'ACUERDO CERRADO (Homologado)',
      reunion: 'Diciembre 2026'
    },
    'bancarios': {
      oferta: 'Cláusula gatillo mensual (1,7% en agosto)',
      pedido: 'Sostener IPC + mejora del ROE para bases',
      estado: 'ACUERDO CERRADO',
      reunion: 'Actualización automática'
    },
    'uom': {
      oferta: '23,5% homologado (Rama 17) / 14% escalonado',
      pedido: 'Paro puntual en Bragado logró súper bono $1.3M',
      estado: 'CERRADO (Con focos de conflicto)',
      reunion: 'Febrero 2027 (Revisión gral)'
    },
    'sanidad': {
      oferta: '7,3% + bonos fijos de hasta $90.000',
      pedido: 'Aumento al básico sin componentes no remunerativos',
      estado: 'ACUERDO CERRADO',
      reunion: 'Último trimestre 2026'
    }
  };

    function updateParitaria() {
      var val = select.value;
      var data = gremiosData[val];
      if (!data) return;

      ofertaEl.textContent = data.oferta;
      pedidoEl.textContent = data.pedido;
      reunionEl.innerHTML = 'Proxima reunion: <strong>' + data.reunion + '</strong>';

      var dotHtml = data.dot ? '<span class="estado-dot" style="background:' + data.color + '"></span> ' : '';
      estadoText.innerHTML = dotHtml + data.estado;
      estadoText.style.color = data.color;

      // Update conflict counter
      if (data.startConflicto) {
        conflictWidget.style.display = 'flex';
        var now = new Date();
        var diffTime = Math.abs(now - data.startConflicto);
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        conflictDays.textContent = diffDays;
      } else {
        conflictWidget.style.display = 'none';
      }
    }

    select.addEventListener('change', updateParitaria);
    updateParitaria();
  }

  
  /* ---------- 16. Article Modal ---------- */
function initArticleModal() {
    var modal = document.getElementById('article-modal');
    if (!modal) return;
    
    var closeBtn = document.getElementById('modal-close');
    var overlay = document.getElementById('modal-overlay');
    var mTitle = document.getElementById('modal-title');
    var mCat = document.getElementById('modal-cat');
    var mMeta = document.getElementById('modal-meta');
    var mBody = document.getElementById('modal-body');
    
    var modeSwitch = document.getElementById('modal-mode-switch');
    var btnFormal = document.getElementById('modal-mode-formal');
    var btnCriollo = document.getElementById('modal-mode-criollo');
    
    var currentDevHtml = '';
    var currentCriolloHtml = '';

    document.addEventListener('click', function(e) {
      var target = e.target.closest('.leer-nota');
      if (!target) return;
      
      e.preventDefault();
      
      var isHero = target.classList.contains('btn--primary');
      var container = isHero ? document.querySelector('.hero-article') : target.closest('article');
      
      if (!container) return;
      
      var tEl = isHero ? container.querySelector('.hero-title') : (container.querySelector('.subnote-title') || container.querySelector('.politics-title'));
      var cEl = isHero ? document.querySelector('.hero-category-badge') : (container.querySelector('.subnote-category') || container.querySelector('.politics-category'));
      var mEl = isHero ? container.querySelector('.hero-meta') : (container.querySelector('.subnote-meta') || container.querySelector('.politics-meta'));
      
      var title = tEl ? tEl.textContent : '';
      var cat = cEl ? cEl.textContent : '';
      var meta = mEl ? mEl.innerHTML : '';
      
      var devEl = container.querySelector('.hidden-desarrollo');
      var criolloEl = container.querySelector('.hidden-criollo'); // We will add this when injecting
      
      currentDevHtml = devEl ? devEl.innerHTML : '<p>Contenido en desarrollo...</p>';
      if(currentDevHtml.indexOf('<p>') === -1) {
        currentDevHtml = '<p>' + currentDevHtml.replace(/

/g, '</p><p>') + '</p>';
      }
      
      if (criolloEl) {
        currentCriolloHtml = criolloEl.innerHTML;
        if(currentCriolloHtml.indexOf('<ul>') === -1 && currentCriolloHtml.indexOf('<p>') === -1) {
             currentCriolloHtml = '<p>' + currentCriolloHtml.replace(/

/g, '</p><p>') + '</p>';
        }
        if (modeSwitch) modeSwitch.hidden = false;
      } else {
        currentCriolloHtml = '';
        if (modeSwitch) modeSwitch.hidden = true;
      }

      if (mTitle) mTitle.textContent = title;
      if (mCat) mCat.textContent = cat;
      if (mMeta) mMeta.innerHTML = meta;
      
      // Default to formal
      if (mBody) mBody.innerHTML = currentDevHtml;
      if (btnFormal) btnFormal.classList.add('active');
      if (btnCriollo) btnCriollo.classList.remove('active');
      
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    });

    if (btnFormal) {
      btnFormal.addEventListener('click', function() {
        btnFormal.classList.add('active');
        btnCriollo.classList.remove('active');
        if (mBody) mBody.innerHTML = currentDevHtml;
      });
    }

    if (btnCriollo) {
      btnCriollo.addEventListener('click', function() {
        btnCriollo.classList.add('active');
        btnFormal.classList.remove('active');
        if (mBody) mBody.innerHTML = currentCriolloHtml;
      });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);
    
    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = '';
    }
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });
  }
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    setDate();
    setYear();
    initMenu();
    initTicker();
    initNewsletter();
    initSmoothScroll();
    initScrollHeader();
    
    initConflictCounter(); // old logic, will be overridden by paritarias
    initWaBanner();
    initCalculator();
    initHeroModeSwitch();
    initPoll();
    initWeatherAndDollar();
    initParitarias();
    initArticleModal();
  });

})();


