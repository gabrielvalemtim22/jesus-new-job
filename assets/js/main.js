/* Jesus New Job — interações e animações */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const WHATSAPP = '5511982895825';
  const waLink = text => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

  /* ---------- intro ---------- */
  let ready = false;
  const setReady = () => { if (!ready) { ready = true; root.classList.add('is-ready'); } };
  let seen = false;
  try { seen = sessionStorage.getItem('jnj-intro') === '1'; sessionStorage.setItem('jnj-intro', '1'); } catch (e) {}
  if (reduce || seen) {
    root.classList.add('skip-intro');
    requestAnimationFrame(setReady);
  } else {
    const minTime = new Promise(r => setTimeout(r, 1300));
    const fonts = document.fonts ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2000))]) : Promise.resolve();
    Promise.all([minTime, fonts]).then(setReady);
    setTimeout(setReady, 3000);
  }

  /* ---------- WhatsApp links ---------- */
  $$('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa); });

  /* ---------- header, progress, menu ---------- */
  const header = $('[data-header]');
  const bar = $('.progress span');
  const waFloat = $('.wa-float');
  const burger = $('.burger');
  const menu = $('#menu');

  const setMenu = open => {
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.inert = !open;
  };
  burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menu-open')) setMenu(false); });
  matchMedia('(min-width: 1101px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  // link ativo no menu
  const navLinks = $$('.nav a');
  const sections = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const navIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navIO.observe(s));

  /* ---------- reveal ---------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target._reveal.classList.add('in'); revealIO.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  // elementos com clip-path começam com área visível zero: observa o pai
  $$('[data-reveal]').forEach(el => {
    const watch = el.dataset.reveal === 'clip' ? el.parentElement : el;
    watch._reveal = el;
    revealIO.observe(watch);
  });

  /* ---------- manifesto: palavras acendem com o scroll ---------- */
  const words = $('[data-words]');
  let wordEls = [];
  if (words) {
    const hl = (words.dataset.hl || '').split(',').map(s => s.trim()).filter(Boolean);
    const text = words.textContent.trim().split(/\s+/);
    words.textContent = '';
    text.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'w' + (hl.includes(w) ? ' hl' : '');
      span.textContent = w;
      words.append(span, i < text.length - 1 ? ' ' : '');
    });
    wordEls = $$('.w', words);
    if (reduce) wordEls.forEach(w => w.classList.add('on'));
  }
  let litWords = -1;

  /* ---------- deck do hero ---------- */
  const deck = $('[data-deck]');
  if (deck) {
    const cards = $$('.deck__card', deck);
    const order = cards.map((_, i) => i);
    const layout = () => order.forEach((ci, pos) => { cards[ci].dataset.pos = Math.min(pos, 3); });
    layout();
    let busy = false, timer, visible = true, hover = false;
    const next = () => {
      if (busy) return;
      busy = true;
      const first = order.shift();
      const card = cards[first];
      card.classList.add('is-out');
      order.forEach((ci, pos) => { cards[ci].dataset.pos = Math.min(pos, 3); });
      setTimeout(() => {
        card.classList.add('no-tr');
        card.classList.remove('is-out');
        order.push(first);
        card.dataset.pos = 3;
        void card.offsetWidth;
        card.classList.remove('no-tr');
        layout();
        busy = false;
      }, 750);
    };
    const schedule = () => {
      clearInterval(timer);
      if (!reduce) timer = setInterval(() => { if (visible && !hover && !document.hidden) next(); }, 3600);
    };
    deck.addEventListener('click', () => { next(); schedule(); });
    deck.addEventListener('mouseenter', () => { hover = true; });
    deck.addEventListener('mouseleave', () => { hover = false; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(deck);
    schedule();

    // leve inclinação 3D acompanhando o mouse
    const hero = $('.hero');
    if (fine && !reduce) {
      hero.addEventListener('mousemove', e => {
        const r = hero.getBoundingClientRect();
        deck.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
        deck.style.setProperty('--my', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
      });
      hero.addEventListener('mouseleave', () => { deck.style.setProperty('--mx', 0); deck.style.setProperty('--my', 0); });
    }
  }

  /* ---------- serviços: imagem flutuante + pré-seleção no formulário ---------- */
  const serviceSelect = $('#f-service');
  const setService = value => {
    if (!serviceSelect || !value) return;
    serviceSelect.value = value;
    serviceSelect.classList.toggle('has-value', !!serviceSelect.value);
  };
  const svcItems = $$('.svc');
  svcItems.forEach(li => $('a', li).addEventListener('click', () => setService(li.dataset.service)));

  const float = $('.svc-float');
  if (float && fine && !reduce) {
    const imgs = svcItems.map(li => {
      const img = new Image();
      img.src = li.dataset.img;
      img.alt = '';
      img.decoding = 'async';
      float.append(img);
      return img;
    });
    const list = $('.svc-list');
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.16; y += (ty - y) * 0.16;
      float.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    list.addEventListener('mouseenter', e => { x = tx = e.clientX; y = ty = e.clientY; float.classList.add('on'); cancelAnimationFrame(raf); loop(); });
    list.addEventListener('mouseleave', () => { float.classList.remove('on'); setTimeout(() => { if (!float.classList.contains('on')) cancelAnimationFrame(raf); }, 500); });
    list.addEventListener('mousemove', e => { tx = e.clientX + 150; ty = e.clientY; });
    svcItems.forEach((li, i) => li.addEventListener('mouseenter', () => imgs.forEach((img, j) => img.classList.toggle('on', i === j))));
  }

  /* ---------- portfólio: filtros ---------- */
  const grid = $('[data-grid]');
  const workCards = grid ? $$('.work-card', grid) : [];
  const filterBtns = $$('[data-filter]');
  const pill = $('.filters__pill');
  const count = $('[data-count]');
  const movePill = btn => {
    if (!pill || !btn) return;
    pill.style.width = btn.offsetWidth + 'px';
    pill.style.transform = `translate(${btn.offsetLeft}px, ${btn.offsetTop}px)`;
  };
  const activeBtn = () => filterBtns.find(b => b.getAttribute('aria-pressed') === 'true');
  movePill(activeBtn());
  addEventListener('resize', () => movePill(activeBtn()));
  if (document.fonts) document.fonts.ready.then(() => movePill(activeBtn()));

  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    if (btn.getAttribute('aria-pressed') === 'true') return;
    filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    movePill(btn);
    const f = btn.dataset.filter;
    grid.classList.add('is-filtering');
    setTimeout(() => {
      let i = 0;
      workCards.forEach(c => {
        c.hidden = !(f === 'all' || c.dataset.cat === f);
        if (!c.hidden) c.style.setProperty('--d', (i++ * 0.05) + 's');
      });
      if (count) count.textContent = i;
      requestAnimationFrame(() => grid.classList.remove('is-filtering'));
    }, reduce ? 0 : 320);
  }));

  /* ---------- lightbox ---------- */
  const lb = $('#lightbox');
  if (lb && workCards.length) {
    const lbImg = $('.lb__img', lb), lbVideo = $('.lb__video', lb), lbTitle = $('.lb__title', lb), lbCat = $('.lb__cat', lb), lbCount = $('.lb__count', lb), lbCta = $('.lb__cta', lb);
    let list = [], idx = 0, token = 0;
    const pad = n => String(n).padStart(2, '0');
    const show = () => {
      const card = list[idx];
      const img = $('img', card);
      const name = $('.work-card__info strong', card).textContent;
      const cat = $('.work-card__info span', card).textContent;
      const my = ++token;
      lbImg.classList.add('is-swap');
      lbTitle.textContent = name;
      lbCat.textContent = cat;
      lbCount.textContent = `${pad(idx + 1)} / ${pad(list.length)}`;
      lbCta.href = waLink(`Olá, Jesus New Job! Vi o projeto "${name}" no site e quero um orçamento para algo parecido.`);
      lbVideo.pause();
      if (card.dataset.video) {
        lbImg.hidden = true;
        lbVideo.hidden = false;
        lbVideo.poster = img.dataset.full;
        lbVideo.src = card.dataset.video;
        lbVideo.setAttribute('aria-label', 'Vídeo: ' + img.alt);
        lbVideo.play().catch(() => {});
        return;
      }
      lbVideo.hidden = true;
      lbVideo.removeAttribute('src');
      lbImg.hidden = false;
      const pre = new Image();
      pre.onload = pre.onerror = () => {
        if (my !== token) return;
        lbImg.src = pre.src;
        lbImg.alt = img.alt;
        requestAnimationFrame(() => lbImg.classList.remove('is-swap'));
      };
      pre.src = img.dataset.full || img.src;
      // pré-carrega o próximo
      const nxt = list[(idx + 1) % list.length];
      if (nxt) { const p = new Image(); p.src = $('img', nxt).dataset.full; }
    };
    const go = d => { idx = (idx + d + list.length) % list.length; show(); };
    workCards.forEach(card => card.addEventListener('click', () => {
      list = workCards.filter(c => !c.hidden);
      idx = list.indexOf(card);
      lbImg.removeAttribute('src');
      show();
      lb.showModal();
      root.classList.add('lb-open');
    }));
    $('.lb__close', lb).addEventListener('click', () => lb.close());
    $('.lb__prev', lb).addEventListener('click', () => go(-1));
    $('.lb__next', lb).addEventListener('click', () => go(1));
    lb.addEventListener('close', () => { root.classList.remove('lb-open'); lbVideo.pause(); });
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });
    let sx = 0, sy = 0;
    lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    });
  }

  /* ---------- vídeo dos bastidores ---------- */
  const phone = $('.phone');
  const video = phone && $('video', phone);
  if (video) {
    const btn = $('.phone__btn', phone);
    let userPaused = false;
    const load = () => { if (!video.src) video.src = video.dataset.src; };
    const play = () => { load(); video.play().then(() => phone.classList.add('is-playing')).catch(() => {}); };
    const pause = () => { video.pause(); phone.classList.remove('is-playing'); };
    btn.addEventListener('click', () => {
      if (video.paused) { userPaused = false; play(); } else { userPaused = true; pause(); }
    });
    video.addEventListener('play', () => { phone.classList.add('is-playing'); btn.setAttribute('aria-label', 'Pausar vídeo'); });
    video.addEventListener('pause', () => { phone.classList.remove('is-playing'); btn.setAttribute('aria-label', 'Reproduzir vídeo'); });
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!reduce && !userPaused) play(); }
      else if (!video.paused) pause();
    }, { threshold: 0.35 }).observe(video);

    // troca de vídeo
    const tabs = $$('.phone__tabs button', phone);
    const label = $('[data-video-label]', phone);
    const text = $('[data-video-text]');
    tabs.forEach(tab => tab.addEventListener('click', () => {
      if (tab.getAttribute('aria-pressed') === 'true') return;
      tabs.forEach(b => b.setAttribute('aria-pressed', String(b === tab)));
      phone.classList.add('is-switching');
      setTimeout(() => {
        video.pause();
        video.poster = tab.dataset.poster;
        video.dataset.src = tab.dataset.src;
        video.src = tab.dataset.src;
        video.setAttribute('aria-label', 'Vídeo: ' + tab.dataset.label);
        label.textContent = tab.dataset.label;
        if (text) text.textContent = tab.dataset.text;
        userPaused = false;
        play();
        phone.classList.remove('is-switching');
      }, reduce ? 0 : 260);
    }));
  }

  /* ---------- FAQ com animação ---------- */
  $$('.faq__list details').forEach(d => {
    const summary = $('summary', d);
    const body = $('.faq__a', d);
    summary.addEventListener('click', e => {
      if (reduce || !body.animate) return;
      e.preventDefault();
      if (d.open) {
        d.classList.add('is-closing');
        const a = body.animate([{ height: body.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 380, easing: 'cubic-bezier(.65,0,.35,1)' });
        a.onfinish = () => { d.open = false; d.classList.remove('is-closing'); };
      } else {
        d.open = true;
        body.animate([{ height: '0px', opacity: 0 }, { height: body.offsetHeight + 'px', opacity: 1 }], { duration: 480, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
    });
  });

  /* ---------- formulário → WhatsApp ---------- */
  const form = $('#quote-form');
  if (form) {
    serviceSelect.addEventListener('change', () => {
      serviceSelect.classList.toggle('has-value', !!serviceSelect.value);
      serviceSelect.closest('.field').classList.remove('is-invalid');
    });
    $('#f-name').addEventListener('input', e => e.target.closest('.field').classList.remove('is-invalid'));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#f-name').value.trim();
      const service = serviceSelect.value;
      const place = $('#f-place').value.trim();
      const msg = $('#f-msg').value.trim();
      const status = $('.form__status', form);
      $('#f-name').closest('.field').classList.toggle('is-invalid', !name);
      serviceSelect.closest('.field').classList.toggle('is-invalid', !service);
      if (!name || !service) {
        status.textContent = 'Preencha seu nome e o serviço para continuar.';
        (!name ? $('#f-name') : serviceSelect).focus();
        return;
      }
      const lines = [`Olá, Jesus New Job! Meu nome é ${name}.`, 'Vim pelo site e quero um orçamento.', '', `• Serviço: ${service}`];
      if (place) lines.push(`• Local: ${place}`);
      if (msg) lines.push(`• Ideia: ${msg}`);
      lines.push('', 'Podemos conversar sobre o projeto?');
      const url = waLink(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
      status.replaceChildren(document.createTextNode('Mensagem pronta! Se o WhatsApp não abriu, '));
      const link = document.createElement('a');
      link.href = url; link.target = '_blank'; link.rel = 'noopener';
      link.textContent = 'clique aqui.';
      status.append(link);
    });
  }

  /* ---------- botões magnéticos ---------- */
  if (fine && !reduce) {
    $$('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.32}px)`;
      });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
  }

  /* ---------- loop de scroll ---------- */
  const parallax = reduce ? [] : $$('[data-speed]');
  const steps = $('[data-steps]');
  const stepEls = steps ? $$('.step', steps) : [];
  const update = () => {
    const y = scrollY, vh = innerHeight;
    header.classList.toggle('is-scrolled', y > 30);
    const max = root.scrollHeight - vh;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    waFloat.classList.toggle('is-visible', y > vh * 0.7);

    if (wordEls.length && !reduce) {
      const r = words.getBoundingClientRect();
      const p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.3));
      const n = Math.round(p * wordEls.length);
      if (n !== litWords) { litWords = n; wordEls.forEach((w, i) => w.classList.toggle('on', i < n)); }
    }

    parallax.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const c = r.top + r.height / 2 - vh / 2;
      el.style.translate = `0 ${(c * parseFloat(el.dataset.speed)).toFixed(1)}px`;
    });

    if (steps) {
      const r = steps.getBoundingClientRect();
      const p = reduce ? 1 : clamp((vh * 0.7 - r.top) / (r.height + vh * 0.1));
      steps.style.setProperty('--p', p.toFixed(3));
      stepEls.forEach((s, i) => s.classList.toggle('is-active', p >= (i + 0.2) / stepEls.length));
    }
  };
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  addEventListener('resize', update);
  update();

  /* ---------- ano ---------- */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
