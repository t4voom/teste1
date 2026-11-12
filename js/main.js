(() => {
  'use strict';

  const menosMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Fotos na ordem do diário (usadas na foto ampliada) */
  const FOTOS = [
    { nome: 'amigas',   legenda: 'a bordo com a dupla', alt: 'Aynebrenda e uma amiga sentadas de costas na beirada de um barco, olhando lanchas ancoradas e um morro verde' },
    { nome: 'timao',    legenda: 'capitã por um dia',   alt: 'Aynebrenda de costas, de casaco de renda branco, no timão de um barco com mata verde ao fundo' },
    { nome: 'ceu-azul', legenda: 'de frente pro mar',   alt: 'Aynebrenda de costas, com tatuagem de tartaruga no braço, olhando o mar verde-água sob céu azul' },
    { nome: 'girassol', legenda: 'flores pra ela',      alt: 'Buquê com girassol, rosas pink, alstroemérias e eucalipto embrulhado em papel kraft' },
  ];

  /* ---------- Pilha de polaroids (abertura) ---------- */
  const pilha = document.querySelector('.pilha');
  if (pilha) {
    let ordem = [...pilha.querySelectorAll('.polaroid')];
    let ocupado = false;

    const arrumar = () => ordem.forEach((el, i) => {
      el.style.setProperty('--i', i);
      el.classList.toggle('topo', i === 0);
    });
    arrumar();

    pilha.addEventListener('click', () => {
      if (ocupado) return;
      ocupado = true;
      const topo = ordem[0];
      topo.classList.add('saindo');
      setTimeout(() => {
        ordem.push(ordem.shift());
        arrumar();
        topo.classList.remove('saindo');
        setTimeout(() => { ocupado = false; }, 450);
      }, menosMovimento ? 0 : 380);
    });
  }

  /* ---------- Bolhas ---------- */
  if (!menosMovimento) {
    document.querySelectorAll('.bolhas').forEach((caixa) => {
      const qtd = Number(caixa.dataset.qtd) || 12;
      for (let i = 0; i < qtd; i++) {
        const b = document.createElement('span');
        const tam = 4 + Math.random() * 14;
        b.className = 'bolha';
        b.style.left = `${Math.random() * 100}%`;
        b.style.width = b.style.height = `${tam}px`;
        b.style.animationDuration = `${9 + Math.random() * 12}s`;
        b.style.animationDelay = `${-Math.random() * 20}s`;
        b.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
        caixa.append(b);
      }
    });
  }

  /* ---------- Aparecer ao rolar ---------- */
  const revelaveis = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((itens) => {
      itens.forEach((it) => {
        if (it.isIntersecting) {
          it.target.classList.add('visivel');
          io.unobserve(it.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revelaveis.forEach((el) => io.observe(el));
  } else {
    revelaveis.forEach((el) => el.classList.add('visivel'));
  }

  /* ---------- Rota do barquinho ---------- */
  const trilha = document.querySelector('.trilha');
  if (trilha) {
    const svg = trilha.querySelector('.rota');
    const tracejada = svg.querySelector('.rota__tracejada');
    const feita = svg.querySelector('.rota__feita');
    const barco = trilha.querySelector('.barquinho');
    const celular = matchMedia('(max-width: 760px)');
    let comprimento = 0;
    let pedido = 0;

    const desenhar = () => {
      const w = trilha.clientWidth;
      const h = trilha.clientHeight;
      if (!w || !h) return;
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

      const mini = celular.matches;
      const cx = mini ? 16 : w / 2;
      const amp = mini ? 7 : 22;
      const passo = mini ? 200 : 300;

      let d = `M${cx} 0`;
      let y = 0;
      let lado = 1;
      while (y < h) {
        const y2 = Math.min(y + passo, h);
        d += ` Q${cx + lado * amp * 2} ${(y + y2) / 2} ${cx} ${y2}`;
        y = y2;
        lado *= -1;
      }
      tracejada.setAttribute('d', d);
      feita.setAttribute('d', d);
      comprimento = feita.getTotalLength();
      feita.style.strokeDasharray = `${comprimento}`;
      mover();
    };

    const mover = () => {
      pedido = 0;
      if (!comprimento) return;
      const r = trilha.getBoundingClientRect();
      const alvo = innerHeight * 0.55;
      const p = Math.max(0, Math.min(1, (alvo - r.top) / r.height));
      const l = p * comprimento;
      const a = feita.getPointAtLength(l);
      const b = feita.getPointAtLength(Math.min(comprimento, l + 3));
      const virar = b.x < a.x - 0.05 ? -1 : 1;
      feita.style.strokeDashoffset = `${comprimento - l}`;
      barco.style.transform = `translate(${a.x}px, ${a.y}px) translate(-50%, -80%) scaleX(${virar})`;
    };

    const aoRolar = () => { if (!pedido) pedido = requestAnimationFrame(mover); };

    addEventListener('scroll', aoRolar, { passive: true });
    addEventListener('resize', desenhar);
    if ('ResizeObserver' in window) new ResizeObserver(desenhar).observe(trilha);
    desenhar();
  }

  /* ---------- Foto ampliada ---------- */
  const caixa = document.querySelector('.lightbox');
  if (caixa && typeof caixa.showModal === 'function') {
    const img = caixa.querySelector('img');
    const legenda = caixa.querySelector('figcaption');
    const contador = caixa.querySelector('.lightbox__contador');
    const moldura = caixa.querySelector('.lightbox__polaroid');
    let atual = 0;

    const mostrar = (i) => {
      atual = (i + FOTOS.length) % FOTOS.length;
      const f = FOTOS[atual];
      img.src = `images/${f.nome}.webp`;
      img.alt = f.alt;
      legenda.textContent = f.legenda;
      contador.textContent = `${atual + 1} / ${FOTOS.length}`;
      moldura.style.transform = `rotate(${atual % 2 ? 1.2 : -1.2}deg)`;
    };

    document.querySelectorAll('[data-foto]').forEach((btn) => {
      btn.addEventListener('click', () => {
        mostrar(Number(btn.dataset.foto));
        caixa.showModal();
      });
    });

    caixa.querySelector('.lightbox__fechar').addEventListener('click', () => caixa.close());
    caixa.querySelector('.lightbox__nav--ant').addEventListener('click', () => mostrar(atual - 1));
    caixa.querySelector('.lightbox__nav--prox').addEventListener('click', () => mostrar(atual + 1));
    caixa.addEventListener('click', (e) => { if (e.target === caixa) caixa.close(); });
    caixa.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') mostrar(atual - 1);
      if (e.key === 'ArrowRight') mostrar(atual + 1);
    });

    let toqueX = null;
    caixa.addEventListener('touchstart', (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
    caixa.addEventListener('touchend', (e) => {
      if (toqueX === null) return;
      const dx = e.changedTouches[0].clientX - toqueX;
      if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
      toqueX = null;
    });
  }
})();
