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

  


  /* ---------- 10. WhatsApp Channel Banner close ---------- */
  function initWaBanner() {
    var bar   = document.querySelector('.wa-channel-bar');
    var close = document.getElementById('wa-banner-close');
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
    var conflictWidget = document.getElementById('conflict-widget');
    var conflictDays = document.getElementById('conflict-days');

    if (!select || !ofertaEl) return;

    var gremiosData = {};

    function updateParitaria() {
      var val = select.value;
      var data = gremiosData[val];
      if (!data) return;

      ofertaEl.textContent = data.oferta;
      pedidoEl.textContent = data.pedido;
      reunionEl.innerHTML = 'Proxima reunion: <strong>' + data.reunion + '</strong>';

      var dotHtml = data.dot ? '<span class="estado-dot" style="background:' + data.color + '"></span> ' : '';
      estadoText.innerHTML = dotHtml + data.estado;
      estadoText.style.color = data.color || '';

      if (data.startConflicto) {
        conflictWidget.style.display = 'flex';
        var now = new Date();
        var diffTime = Math.abs(now - new Date(data.startConflicto));
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        conflictDays.textContent = diffDays;
      } else {
        if(conflictWidget) conflictWidget.style.display = 'none';
      }
    }

    fetch('paritarias.json?v=' + Date.now())
      .then(res => res.json())
      .then(data => {
        gremiosData = data;
        select.addEventListener('change', updateParitaria);
        updateParitaria();
      })
      .catch(err => console.error("Error loading paritarias:", err));
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
        currentDevHtml = '<p>' + currentDevHtml.replace(/\n\n/g, '</p><p>') + '</p>';
      }
      
      if (criolloEl) {
        currentCriolloHtml = criolloEl.innerHTML;
        if(currentCriolloHtml.indexOf('<ul>') === -1 && currentCriolloHtml.indexOf('<p>') === -1) {
             currentCriolloHtml = '<p>' + currentCriolloHtml.replace(/\n\n/g, '</p><p>') + '</p>';
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
      if (container.id) history.pushState(null, null, '#' + container.id);
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
      history.pushState(null, null, window.location.pathname + window.location.search);
      document.body.style.overflow = '';
    }
    
    
    // --- WHATSAPP SHARE (Delegation for dynamic content) ---
    document.body.addEventListener('click', function(e) {
      var btn = e.target.closest('.share-btn-wa');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        var title = btn.getAttribute('data-title');
        var id = btn.getAttribute('data-id');
        var url = window.location.origin + window.location.pathname + '#' + id;
        var text = 'Mirá esta nota en Gremio 360:\n*' + title + '*\n\n' + url;
        window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
      }
    });

    // --- DEEP LINKING (Read hash on load) ---
    function checkHashForModal() {
      var hash = window.location.hash;
      if (hash && hash.startsWith('#nota-')) {
        var article = document.querySelector(hash);
        if (article) {
          var link = article.querySelector('.leer-nota') || article.classList.contains('leer-nota') ? article : null;
          if (link) {
            // Simulate click to open modal
            // We need to extract the logic from the click listener or just dispatch an event
            var event = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            });
            article.querySelector('.leer-nota').dispatchEvent(event);
          }
        }
      }
    }
    
    // Call it after a small delay to ensure everything is initialized
    setTimeout(checkHashForModal, 100);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !modal.hidden) {
        closeModal();
      }
    });
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
    
    
    initWaBanner();
    initCalculator();
    initHeroModeSwitch();
    initPoll();
    initWeatherAndDollar();
    initParitarias();
    initArticleModal();

    /* ---------- 14. SEARCH MODAL ---------- */
    var searchBtn = document.querySelector('.search-btn');
    var searchModal = document.getElementById('search-modal');
    var searchClose = document.getElementById('search-close');
    var searchOverlay = document.getElementById('search-overlay');
    var searchInput = document.getElementById('search-input');
    var searchResults = document.getElementById('search-results');
    var noticiasDB = [];

    function openSearch() {
      if(!searchModal) return;
      searchModal.hidden = false;
      searchModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput.focus(), 100);
      
      // Fetch DB if not loaded
      if (noticiasDB.length === 0) {
        fetch('noticias.json')
          .then(res => res.json())
          .then(data => {
            noticiasDB = data;
          })
          .catch(err => console.error('Error cargando noticias:', err));
      }
    }

    function closeSearch() {
      if(!searchModal) return;
      searchModal.hidden = true;
      searchModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      searchInput.value = '';
      searchResults.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem; text-align:center; margin-top:32px;">Escribí arriba para buscar en nuestro archivo histórico.</p>';
    }

    if (searchBtn) searchBtn.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);
    if (searchOverlay) searchOverlay.addEventListener('click', closeSearch);

    if (searchInput) {
      searchInput.addEventListener('input', function() {
        var q = this.value.toLowerCase().trim();
        if (q.length < 2) {
          searchResults.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem; text-align:center; margin-top:32px;">Escribí arriba para buscar en nuestro archivo histórico.</p>';
          return;
        }
        
        var matches = noticiasDB.filter(function(n) {
          return n.title.toLowerCase().includes(q) || n.resume.toLowerCase().includes(q) || n.category.toLowerCase().includes(q);
        });

        if (matches.length === 0) {
          searchResults.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem; text-align:center; margin-top:32px;">No se encontraron noticias para "'+q+'"</p>';
          return;
        }

        var html = '';
        matches.forEach(function(n) {
          // Build small card
          html += '<article class="politics-card" style="margin-bottom:0; cursor:pointer;" onclick="window.location.href=\'' + window.location.pathname + '#' + n.id + '\'; window.location.reload();">';
          html += '<span class="politics-category">' + n.category + '</span>';
          html += '<h3 class="politics-title" style="font-size:1.1rem;">' + n.title + '</h3>';
          html += '<div class="politics-meta">' + n.date + '</div>';
          html += '</article>';
        });
        searchResults.innerHTML = html;
      });
    }


    /* ---------- 15. CATEGORY LINKS TO SEARCH ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var hash = this.getAttribute('href');
        var catMap = {
          '#salarios': 'salar',
          '#elecciones': 'eleccion',
          '#denuncias': 'denuncia',
          '#base': 'base',
          '#paritarias': 'paritaria',
          '#investigacion': 'investiga'
        };
        
        if (catMap[hash]) {
          e.preventDefault();
          
          // Close mobile nav only if on mobile
          if (window.innerWidth < 992) {
            var nav = document.getElementById('main-nav');
            var overlay = document.getElementById('nav-overlay');
            var btn = document.getElementById('hamburger-btn');
            if (nav) {
              nav.hidden = true;
              nav.setAttribute('aria-hidden', 'true');
            }
            if(overlay) overlay.hidden = true;
            if(btn) {
              btn.classList.remove('active');
              btn.setAttribute('aria-expanded', 'false');
            }
          }
          
          // Open search modal without triggering its internal fetch race condition
          var searchModal = document.getElementById('search-modal');
          var searchInput = document.getElementById('search-input');
          if(searchModal) {
            searchModal.hidden = false;
            searchModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            setTimeout(() => searchInput && searchInput.focus(), 100);
          }
          
          var executeCatSearch = function() {
            if(searchInput) {
              var niceTerm = hash.replace('#', '');
              // capitalize first letter
              niceTerm = niceTerm.charAt(0).toUpperCase() + niceTerm.slice(1);
              searchInput.value = niceTerm;
              
              var results = document.getElementById('search-results');
              var q = catMap[hash];
              
              var matches = noticiasDB.filter(function(n) {
                return n.title.toLowerCase().includes(q) || n.resume.toLowerCase().includes(q) || n.category.toLowerCase().includes(q);
              });
              
              if (matches.length === 0) {
                results.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem; text-align:center; margin-top:32px;">No se encontraron noticias para esta categoría.</p>';
                return;
              }
              
              var html = '';
              matches.forEach(function(n) {
                html += '<article class="politics-card" style="margin-bottom:0; cursor:pointer;" onclick="window.location.href=\'' + window.location.pathname + '#' + n.id + '\'; window.location.reload();">';
                html += '<span class="politics-category">' + n.category + '</span>';
                html += '<h3 class="politics-title" style="font-size:1.1rem;">' + n.title + '</h3>';
                html += '<div class="politics-meta">' + n.date + '</div>';
                html += '</article>';
              });
              results.innerHTML = html;
            }
          };
          
          if (noticiasDB.length === 0) {
            fetch('noticias.json?v=' + Date.now())
              .then(res => res.json())
              .then(data => {
                noticiasDB = data;
                executeCatSearch();
              });
          } else {
            executeCatSearch();
          }
        }
      });
    });


    // --- PREMIUM FEATURES (GODLY / 21st.dev) ---

    // 1. Reading Progress Bar
    var modalScrollArea = document.querySelector('.modal-scroll-area');
    var progressBar = document.getElementById('reading-progress');
    if (modalScrollArea && progressBar) {
      modalScrollArea.addEventListener('scroll', function() {
        var scrollTop = modalScrollArea.scrollTop;
        var scrollHeight = modalScrollArea.scrollHeight - modalScrollArea.clientHeight;
        var progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
      });
    }

    // 2. Spotlight Hover Effect
    document.querySelectorAll('.spotlight-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        card.style.setProperty('--x', x + 'px');
        card.style.setProperty('--y', y + 'px');
      });
    });

    // 3. Scroll Reveal Intersection Observer
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Reveal only once
          }
        });
      }, { rootMargin: "0px 0px -50px 0px" });
      
      reveals.forEach(function(reveal) {
        revealObserver.observe(reveal);
      });
    } else {
      reveals.forEach(function(reveal) { reveal.classList.add('active'); });
    }

    
    // 4. Duplicate Ticker for Infinite Marquee (with accessibility)
    var tickerTrack = document.getElementById('ticker-track');
    if (tickerTrack && !tickerTrack.hasAttribute('data-cloned')) {
      var clone = tickerTrack.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.removeAttribute('id');
      // Append children from clone to original
      while (clone.firstChild) {
        tickerTrack.appendChild(clone.firstChild);
      }
      tickerTrack.setAttribute('data-cloned', 'true');
    }


    // 5. QR Code Modal Logic
    var qrModal = document.getElementById('qr-modal');
    var qrClose = document.getElementById('qr-close');
    var qrOverlay = document.getElementById('qr-overlay');
    var qrImg = document.getElementById('qr-image');

    function closeQr() {
      if(qrModal) {
        qrModal.hidden = true;
        qrModal.setAttribute('aria-hidden', 'true');
      }
    }

    if (qrClose) qrClose.addEventListener('click', closeQr);
    if (qrOverlay) qrOverlay.addEventListener('click', closeQr);

    document.body.addEventListener('click', function(e) {
      var btn = e.target.closest('.qr-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        var id = btn.getAttribute('data-id');
        var url = window.location.origin + window.location.pathname + '#' + id;
        
        // Generate QR code using public API
        var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=' + encodeURIComponent(url);
        
        if (qrImg && qrModal) {
          qrImg.src = qrUrl;
          qrModal.hidden = false;
          qrModal.setAttribute('aria-hidden', 'false');
          // Important: make sure it's on top of other modals if one is open
        }
      }
    });

  });

})();


