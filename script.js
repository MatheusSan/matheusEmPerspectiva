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
    console.error('Error loading data:', error);
  }

  renderReports();
  renderQuotes();
}

function renderReports() {
  if (!reportList) return;

  if (state.reports.length === 0) {
    reportList.innerHTML = '<p class="no-reports">Não foi possível carregar os relatos.<br><strong>Por favor, tente novamente mais tarde.</strong></p>';
    return;
  }

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

  const closeButtonHeader = modal.querySelector('.modal-close');
  if (closeButtonHeader) {
    closeButtonHeader.addEventListener('click', closeReport);
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
