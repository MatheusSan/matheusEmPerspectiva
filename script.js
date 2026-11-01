const state = {
  reports: [],
  quotes: []
};

const reportList = document.getElementById('report-list');
const quotesList = document.getElementById('quotes-list');
const modal = document.getElementById('report-modal');
const modalImage = document.getElementById('modal-image');
const modalMeta = document.getElementById('modal-meta');
const modalTitle = document.getElementById('modal-title');
const modalExcerpt = document.getElementById('modal-excerpt');
const modalBody = document.getElementById('modal-body');
const modalQuote = document.getElementById('modal-quote');
const modalActions = document.getElementById('modal-actions');

async function loadData() {
  try {
    const response = await fetch('./data/reports.json', { cache: 'no-store' });

    if (!response.ok) {
      throw new Error('JSON not found');
    }

    const data = await response.json();
    state.reports = data.reports || [];
    state.quotes = data.quotes || [];
  } catch (error) {
    const fallbackData = {
      reports: [
        {
          id: 'fallback-1',
          title: 'Ruas, sons e silêncio em uma cidade que respira devagar',
          date: '21 de março de 2026',
          location: 'Foz do Iguaçu',
          image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
          excerpt: 'Um relato sobre o ritmo de uma cidade que surpreende pela calma e pela intensidade dos detalhes.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          tags: ['cotidiano', 'reflexão', 'viagem'],
          body: [
            'A rotina de uma cidade nova nem sempre aparece em grandes monumentos. Às vezes, ela está no som de uma rua vazia, no café da esquina e na forma como o tempo parece se dobrar para quem observa com atenção.',
            'É fascinante perceber como o cotidiano pode revelar uma cultura inteira sem precisar de roteiro. Há histórias nas pequenas pausas, na conversa breve com um morador e na forma como a paisagem se entrega ao olhar atento.',
            'Esse tipo de experiência ajuda a enxergar que a viagem também é interior. Ela muda a forma como percebemos a rotina e, ao mesmo tempo, nos lembra que o mundo é muito maior do que o espaço imediato em que estamos acostumados a viver.'
          ],
          quote: 'Nem toda grande descoberta começa com um destino. Muitas vezes, começa com um olhar mais lento.'
        },
        {
          id: 'fallback-2',
          title: 'Entre mercados e caminhos: aprendendo a ouvir o lugar',
          date: '14 de abril de 2026',
          location: 'Mérida',
          image: 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80',
          excerpt: 'A partir de um mercado local, surgem observações sobre cultura, relação e tempo.',
          videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
          tags: ['cultura', 'encontro', 'observação'],
          body: [
            'Os caminhos se apresentam de forma mais clara quando estamos dispostos a reduzir a velocidade. O mercado revela não só aquilo que é vendido, mas também a maneira como as pessoas convivem com a cidade, com o dinheiro, com a memória.',
            'É no detalhe que a experiência ganha profundidade: a comida, as vozes, os gestos, a presença de quem sabe o lugar melhor do que qualquer guia turístico.',
            'Ao escutar o ambiente, percebemos que viajar pode ser também um ato de humildade. O mundo não precisa ser entendido de uma vez, basta ser reconhecido com atenção.'
          ],
          quote: 'A melhor forma de conhecer um lugar é aprender a escutar antes de julgar.'
        }
      ],
      quotes: [
        { text: 'Nem todo destino é uma paisagem; às vezes, é uma forma diferente de olhar.', author: 'Matheus em Perspectiva' },
        { text: 'O cotidiano de outra cultura é um espelho que nos ensina a observar o nosso.', author: 'Matheus em Perspectiva' },
        { text: 'Há beleza em quem vive intencionalmente, mesmo sem saber que é protagonista de uma história.', author: 'Matheus em Perspectiva' }
      ]
    };

    state.reports = fallbackData.reports;
    state.quotes = fallbackData.quotes;
  }

  renderReports();
  renderQuotes();
}

function renderReports() {
  if (!reportList) return;

  reportList.innerHTML = state.reports
    .map(
      (report) => `
        <article class="report-card">
          <button type="button" data-report-id="${report.id}" aria-label="Abrir relato: ${report.title}">
            <div class="report-media">
              <img src="${report.image}" alt="${report.title}" />
            </div>
            <div class="report-content">
              <div class="report-meta">
                <span>${report.location}</span>
                <span>${report.date}</span>
              </div>
              <h3>${report.title}</h3>
              <p class="report-excerpt">${report.excerpt}</p>
              <div class="report-tag-list">
                ${report.tags
                  .map((tag) => `<span class="report-tag">${tag}</span>`)
                  .join('')}
              </div>
            </div>
          </button>
        </article>
      `
    )
    .join('');

  reportList.querySelectorAll('[data-report-id]').forEach((button) => {
    button.addEventListener('click', () => openReport(button.dataset.reportId));
  });
}

function renderQuotes() {
  if (!quotesList) return;

  quotesList.innerHTML = state.quotes
    .map(
      (quote) => `
        <article class="quote-card">
          <p>“${quote.text}”</p>
          <footer>${quote.author}</footer>
        </article>
      `
    )
    .join('');
}

function openReport(id) {
  const report = state.reports.find((item) => item.id === id);

  if (!report || !modal) return;

  modalImage.src = report.image;
  modalImage.alt = report.title;
  modalMeta.textContent = `${report.location} • ${report.date}`;
  modalTitle.textContent = report.title;
  modalExcerpt.textContent = report.excerpt;
  modalBody.innerHTML = (report.body || []).map((paragraph) => `<p>${paragraph}</p>`).join('');
  modalQuote.textContent = report.quote || '';

  modalActions.innerHTML = `
    <a class="watch-link" href="${report.videoUrl}" target="_blank" rel="noreferrer">Assistir ao vídeo</a>
    <button type="button" class="btn close-link" data-close="true">Fechar</button>
  `;

  const closeButton = modalActions.querySelector('[data-close="true"]');
  if (closeButton) {
    closeButton.addEventListener('click', closeReport);
  }

  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeReport() {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

document.addEventListener('click', (event) => {
  const closeTarget = event.target.closest('[data-close="true"]');
  if (closeTarget) {
    closeReport();
    return;
  }

  if (event.target === modal) {
    closeReport();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeReport();
  }
});

loadData();
