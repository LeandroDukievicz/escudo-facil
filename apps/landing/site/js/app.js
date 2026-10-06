import { LEVEL_COPY, SHARE_MESSAGE } from './core/copy.js';
import { analyzeLink } from './core/url/analyzeUrl.js';
import { analyzeText } from './core/text/analyzeText.js';

const examples = {
  link: [
    ['Banco falso', 'http://itau-seguranca.verifique-conta.xyz/login'],
    ['Link encurtado', 'https://bit.ly/regularize-cpf'],
    ['Site oficial', 'https://www.gov.br/inss'],
  ],
  text: [
    ['Falso banco', 'Sua conta será bloqueada hoje. Confirme o código e a senha ou faça um Pix de R$ 250.'],
    ['Falso parente', 'Oi mãe, troquei de número. Preciso pagar um boleto urgente, me manda um Pix?'],
    ['Mensagem comum', 'Oi! Vamos almoçar no domingo na casa da vó? Leva a sobremesa!'],
  ],
};

const form = document.querySelector('#analyze-form');
const resultBox = document.querySelector('#analysis-result');
const errorBox = document.querySelector('#input-error');
const exampleBox = document.querySelector('#example-buttons');
const tabs = {
  link: document.querySelector('#tab-link'),
  text: document.querySelector('#tab-text'),
};
const panels = {
  link: document.querySelector('#panel-link'),
  text: document.querySelector('#panel-text'),
};
const inputs = {
  link: document.querySelector('#link-input'),
  text: document.querySelector('#text-input'),
};
let selectedTab = 'link';

function element(tag, className = '', text = '') {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function list(items) {
  const ul = element('ul');
  for (const item of items) ul.append(element('li', '', item));
  return ul;
}

function selectTab(tab, focus = false) {
  selectedTab = tab;
  for (const kind of ['link', 'text']) {
    const active = kind === tab;
    tabs[kind].setAttribute('aria-selected', String(active));
    tabs[kind].tabIndex = active ? 0 : -1;
    panels[kind].hidden = !active;
  }
  exampleBox.replaceChildren();
  for (const [label, value] of examples[tab]) {
    const button = element('button', '', label);
    button.type = 'button';
    button.addEventListener('click', () => {
      inputs[tab].value = value;
      inputs[tab].focus();
      errorBox.hidden = true;
    });
    exampleBox.append(button);
  }
  form.hidden = false;
  resultBox.hidden = true;
  errorBox.hidden = true;
  if (focus) inputs[tab].focus();
}

for (const tab of ['link', 'text']) {
  tabs[tab].addEventListener('click', () => selectTab(tab, true));
  tabs[tab].addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const next = tab === 'link' ? 'text' : 'link';
    selectTab(next);
    tabs[next].focus();
  });
}
selectTab('link');

function renderMessagePreview(text, highlights) {
  if (!highlights.length) return null;
  const box = element('div', 'message-preview');
  box.append(element('h4', '', 'Trechos que chamaram atenção'));
  const paragraph = element('p');
  let cursor = 0;
  for (const h of [...highlights].sort((a, b) => a.start - b.start)) {
    if (h.start < cursor || h.end > text.length) continue;
    paragraph.append(document.createTextNode(text.slice(cursor, h.start)));
    const mark = element('mark', '', text.slice(h.start, h.end));
    mark.title = h.category;
    paragraph.append(mark);
    cursor = h.end;
  }
  paragraph.append(document.createTextNode(text.slice(cursor)));
  box.append(paragraph);
  return box;
}

function actionButton(label, style, onClick) {
  const button = element('button', `button ${style}`, label);
  button.type = 'button';
  button.addEventListener('click', onClick);
  return button;
}

function renderResult(result, highlights, originalText) {
  const copy = LEVEL_COPY[result.level];
  const head = element('div', `result-head result-${result.level}`);
  head.append(element('span', 'result-icon', copy.icon));
  head.append(element('h3', '', result.title));
  if (copy.reminder && result.level === 'high') head.append(element('p', '', copy.reminder));

  const body = element('div', 'result-body');
  body.append(element('p', '', result.summary));
  if (selectedTab === 'text') {
    const preview = renderMessagePreview(originalText, highlights);
    if (preview) body.append(preview);
  }
  if (result.signals.length) {
    body.append(element('h4', '', 'Sinais encontrados'));
    body.append(list(result.signals.map((signal) => signal.label)));
  }
  if (result.checked.length) {
    body.append(element('h4', '', 'O que foi analisado'));
    body.append(list(result.checked));
  }
  if (result.notice) body.append(element('p', 'result-notice', result.notice));
  body.append(element('h4', '', 'O que fazer agora'));
  body.append(list(result.actions));

  const details = element('details');
  details.append(element('summary', '', 'Ver detalhes técnicos'));
  const dl = element('dl');
  for (const item of result.technical) {
    dl.append(element('dt', '', item.label));
    dl.append(element('dd', '', item.value));
  }
  details.append(dl);
  body.append(details);

  const actions = element('div', 'result-actions');
  actions.append(actionButton('Compartilhar com familiar', 'button-primary', async () => {
    // Share the risk explanation only. The pasted link or message stays local.
    const shareText = `${SHARE_MESSAGE}\n\nResultado: ${result.title}.\n${result.signals.map((s) => `• ${s.label}`).join('\n')}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Escudo Fácil', text: shareText });
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
  }));
  if ('speechSynthesis' in window) {
    let speaking = false;
    const speechButton = actionButton('Ouvir resultado', 'button-outline', () => {
      window.speechSynthesis.cancel();
      if (speaking) {
        speaking = false;
        speechButton.textContent = 'Ouvir resultado';
        return;
      }
      const spoken = new SpeechSynthesisUtterance(`${result.title}. ${result.summary} O que fazer agora: ${result.actions.join('. ')}.`);
      spoken.lang = 'pt-BR';
      spoken.onend = () => { speaking = false; speechButton.textContent = 'Ouvir resultado'; };
      window.speechSynthesis.speak(spoken);
      speaking = true;
      speechButton.textContent = 'Parar leitura';
    });
    actions.append(speechButton);
  }
  actions.append(actionButton('Nova análise', 'button-outline', () => {
    window.speechSynthesis?.cancel();
    inputs[selectedTab].value = '';
    form.hidden = false;
    resultBox.hidden = true;
    inputs[selectedTab].focus();
  }));

  resultBox.replaceChildren(head, body, actions);
  form.hidden = true;
  resultBox.hidden = false;
  resultBox.focus();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = inputs[selectedTab].value.trim();
  if (!value) {
    errorBox.textContent = selectedTab === 'link' ? 'Cole ou digite um link primeiro.' : 'Cole o texto da mensagem primeiro.';
    errorBox.hidden = false;
    inputs[selectedTab].focus();
    return;
  }
  errorBox.hidden = true;
  try {
    if (selectedTab === 'link') {
      renderResult(analyzeLink(value), [], value);
    } else {
      const analysis = analyzeText(value);
      renderResult(analysis.result, analysis.highlights, value);
    }
  } catch {
    errorBox.textContent = 'Não foi possível concluir a análise. Confira o texto e tente novamente.';
    errorBox.hidden = false;
  }
});

function setPreference(key, active) {
  const className = key === 'large-text' ? 'large-text' : 'high-contrast';
  document.body.classList.toggle(className, active);
  document.querySelector(`#${key}`).setAttribute('aria-pressed', String(active));
  try { localStorage.setItem(`escudo-${key}`, active ? '1' : '0'); } catch { /* Storage is optional. */ }
}

for (const key of ['large-text', 'high-contrast']) {
  let active = false;
  try { active = localStorage.getItem(`escudo-${key}`) === '1'; } catch { /* Private mode can block storage. */ }
  setPreference(key, active);
  document.querySelector(`#${key}`).addEventListener('click', () => {
    setPreference(key, document.querySelector(`#${key}`).getAttribute('aria-pressed') !== 'true');
  });
}
document.querySelector('#year').textContent = String(new Date().getFullYear());
