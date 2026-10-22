const i18n = {
  uk: {
    eyebrow: 'RSVP · ШВИДКЕ ЧИТАННЯ',
    heroTitle: 'Читайте текст<br><span>по одному слову.</span>',
    heroText: 'Rapid Word Reader показує слова в заданому темпі. Червона літера — точка фіксації: кожне слово вирівнюється відносно неї, щоб очі менше рухались по рядку.',
    methodTitle: 'Як це працює',
    methodText: 'Замість руху очима по сторінці ви тримаєте погляд у центрі. Слова змінюються автоматично, а оптимальна літера залишається в одній точці.',
    setupTitle: 'Підготуйте текст',
    setupHint: 'Файл обробляється лише у вашому браузері',
    uploadTitle: 'Завантажте файл',
    uploadHint: 'TXT, MD, PDF або DOCX · можна перетягнути сюди',
    previewTitle: 'Попередній перегляд',
    removeFile: 'Видалити файл',
    encodingWarning: 'Файл має кодування Windows-1251. Текст автоматично перекодовано — перевірте прев’ю перед читанням.',
    speedLabel: 'Швидкість',
    speedHint: 'Слів за хвилину',
    wpm: 'слів/хв',
    startReading: 'Почати читати',
    privacy: 'Текст не завантажується на сервер',
    spaceHelp: 'пауза / продовжити',
    escHelp: 'вийти з читання',
    words: 'слів',
    readingFile: 'Читання',
    unsupported: 'Цей формат поки не підтримується.',
    emptyFile: 'Не вдалося знайти текст у файлі.',
    parseError: 'Не вдалося прочитати файл.',
    loading: 'Читаю файл…',
    finished: 'Текст прочитано. Натисніть Space, щоб почати знову.'
  },
  en: {
    eyebrow: 'RSVP · SPEED READING',
    heroTitle: 'Read text<br><span>one word at a time.</span>',
    heroText: 'Rapid Word Reader displays words at a set pace. The red letter is your fixation point: every word is aligned around it so your eyes move less across the line.',
    methodTitle: 'How it works',
    methodText: 'Instead of moving your eyes across a page, keep your gaze in the center. Words advance automatically while the optimal letter remains fixed in one place.',
    setupTitle: 'Prepare your text',
    setupHint: 'The file is processed only in your browser',
    uploadTitle: 'Upload a file',
    uploadHint: 'TXT, MD, PDF or DOCX · or drag it here',
    previewTitle: 'Text preview',
    removeFile: 'Remove file',
    encodingWarning: 'This file uses Windows-1251 encoding. It was converted automatically — check the preview before reading.',
    speedLabel: 'Speed',
    speedHint: 'Words per minute',
    wpm: 'wpm',
    startReading: 'Start reading',
    privacy: 'Your text is not uploaded to a server',
    spaceHelp: 'pause / resume',
    escHelp: 'exit reader',
    words: 'words',
    readingFile: 'Reading',
    unsupported: 'This file format is not supported yet.',
    emptyFile: 'No readable text was found in this file.',
    parseError: 'Could not read this file.',
    loading: 'Reading file…',
    finished: 'Finished. Press Space to start again.'
  }
};

const state = {
  lang: 'uk',
  theme: 'light',
  text: '',
  fileName: '',
  fileSize: 0,
  encoding: '',
  legacyEncoding: false,
  words: [],
  index: 0,
  wpm: 500,
  playing: false,
  timer: null,
  toastTimer: null
};

const els = {
  html: document.documentElement,
  themeToggle: document.getElementById('themeToggle'),
  fileInput: document.getElementById('fileInput'),
  dropZone: document.getElementById('dropZone'),
  fileCard: document.getElementById('fileCard'),
  fileName: document.getElementById('fileName'),
  fileMeta: document.getElementById('fileMeta'),
  removeFile: document.getElementById('removeFile'),
  textPreview: document.getElementById('textPreview'),
  previewCopy: document.getElementById('previewCopy'),
  encodingBadge: document.getElementById('encodingBadge'),
  encodingWarning: document.getElementById('encodingWarning'),
  encodingWarningText: document.getElementById('encodingWarningText'),
  speedRange: document.getElementById('speedRange'),
  speedNumber: document.getElementById('speedNumber'),
  startButton: document.getElementById('startButton'),
  reader: document.getElementById('reader'),
  readerFileName: document.getElementById('readerFileName'),
  progressPercent: document.getElementById('progressPercent'),
  progressBar: document.getElementById('progressBar'),
  readerClose: document.getElementById('readerClose'),
  wordBefore: document.getElementById('wordBefore'),
  wordFocus: document.getElementById('wordFocus'),
  wordAfter: document.getElementById('wordAfter'),
  readerSpeed: document.getElementById('readerSpeed'),
  playButton: document.getElementById('playButton'),
  wordPosition: document.getElementById('wordPosition'),
  wordTotal: document.getElementById('wordTotal'),
  toast: document.getElementById('toast')
};

function boot() {
  const savedTheme = localStorage.getItem('rapid-word-reader-theme');
  const savedLang = localStorage.getItem('rapid-word-reader-lang');
  const savedWpm = Number(localStorage.getItem('rapid-word-reader-wpm'));

  state.theme = savedTheme === 'dark' ? 'dark' : 'light';
  state.lang = savedLang === 'en' ? 'en' : 'uk';
  if (Number.isFinite(savedWpm) && savedWpm >= 100 && savedWpm <= 1200) state.wpm = savedWpm;

  els.speedRange.value = String(state.wpm);
  els.speedNumber.value = String(state.wpm);
  applyTheme();
  applyLanguage();
  bindEvents();
  renderIcons();
  updateStartState();
}

function bindEvents() {
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });

  els.themeToggle.addEventListener('click', toggleTheme);
  els.dropZone.addEventListener('click', () => els.fileInput.click());
  els.fileInput.addEventListener('change', event => handleFiles(event.target.files));
  els.removeFile.addEventListener('click', () => clearFile());

  ['dragenter', 'dragover'].forEach(type => {
    els.dropZone.addEventListener(type, event => {
      event.preventDefault();
      els.dropZone.classList.add('is-dragging');
    });
  });

  ['dragleave', 'drop'].forEach(type => {
    els.dropZone.addEventListener(type, event => {
      event.preventDefault();
      els.dropZone.classList.remove('is-dragging');
    });
  });

  els.dropZone.addEventListener('drop', event => handleFiles(event.dataTransfer.files));
  els.speedRange.addEventListener('input', () => setWpm(Number(els.speedRange.value)));
  els.speedNumber.addEventListener('change', () => setWpm(Number(els.speedNumber.value)));
  els.speedNumber.addEventListener('blur', () => setWpm(Number(els.speedNumber.value)));
  els.startButton.addEventListener('click', openReader);
  els.readerClose.addEventListener('click', closeReader);
  els.playButton.addEventListener('click', togglePlayback);

  document.addEventListener('keydown', event => {
    if (!els.reader.classList.contains('is-open')) return;
    if (event.code === 'Space') {
      event.preventDefault();
      togglePlayback();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeReader();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      seek(-10);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      seek(10);
    }
  });
}

function setLanguage(lang) {
  state.lang = lang === 'en' ? 'en' : 'uk';
  localStorage.setItem('rapid-word-reader-lang', state.lang);
  applyLanguage();
}

function applyLanguage() {
  els.html.lang = state.lang;
  document.querySelectorAll('[data-lang]').forEach(button => button.classList.toggle('is-active', button.dataset.lang === state.lang));
  document.querySelectorAll('[data-i18n]').forEach(node => {
    const key = node.dataset.i18n;
    if (i18n[state.lang][key] != null) node.textContent = i18n[state.lang][key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(node => {
    const key = node.dataset.i18nHtml;
    if (i18n[state.lang][key] != null) node.innerHTML = i18n[state.lang][key];
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(node => {
    const key = node.dataset.i18nAria;
    if (i18n[state.lang][key] != null) node.setAttribute('aria-label', i18n[state.lang][key]);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(node => {
    const key = node.dataset.i18nTitle;
    if (i18n[state.lang][key] != null) node.setAttribute('title', i18n[state.lang][key]);
  });
  document.title = state.lang === 'uk' ? 'Rapid Word Reader — швидке читання' : 'Rapid Word Reader — speed reading';
  renderFileMeta();
  renderPreview();
  renderReaderMeta();
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('rapid-word-reader-theme', state.theme);
  applyTheme();
}

function applyTheme() {
  els.html.dataset.theme = state.theme;
  const icon = state.theme === 'light' ? 'moon' : 'sun';
  els.themeToggle.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
  document.querySelector('meta[name="theme-color"]').setAttribute('content', state.theme === 'light' ? '#fffdf9' : '#15130f');
  renderIcons();
}

function setWpm(value) {
  const safe = Math.min(1200, Math.max(100, Number.isFinite(value) ? Math.round(value / 10) * 10 : 500));
  state.wpm = safe;
  els.speedRange.value = String(safe);
  els.speedNumber.value = String(safe);
  els.readerSpeed.textContent = String(safe);
  localStorage.setItem('rapid-word-reader-wpm', String(safe));
  if (state.playing) scheduleNext();
}

async function handleFiles(fileList) {
  const file = fileList && fileList[0];
  if (!file) return;

  showToast(i18n[state.lang].loading, 0);
  try {
    const result = await extractText(file);
    const cleaned = normalizeText(result.text);
    if (!cleaned) throw new Error('empty');

    state.text = cleaned;
    state.fileName = file.name;
    state.fileSize = file.size;
    state.encoding = result.encoding;
    state.legacyEncoding = Boolean(result.legacyEncoding);
    state.words = [];
    state.index = 0;

    els.fileName.textContent = file.name;
    els.fileCard.hidden = false;
    els.textPreview.hidden = false;
    renderFileMeta();
    renderPreview();
    updateStartState();
    hideToast();
  } catch (error) {
    clearFile();
    const message = error.message === 'unsupported' ? i18n[state.lang].unsupported : error.message === 'empty' ? i18n[state.lang].emptyFile : i18n[state.lang].parseError;
    showToast(message);
  }
}

async function extractText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.markdown')) return decodePlainText(file);
  if (name.endsWith('.pdf')) return { text: await extractPdf(file), encoding: 'PDF', legacyEncoding: false };
  if (name.endsWith('.docx')) return { text: await extractDocx(file), encoding: 'DOCX', legacyEncoding: false };
  throw new Error('unsupported');
}

async function decodePlainText(file) {
  const buffer = await file.arrayBuffer();
  try {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    return { text, encoding: 'UTF-8', legacyEncoding: false };
  } catch (error) {
    const text = new TextDecoder('windows-1251').decode(buffer);
    return { text, encoding: 'Windows-1251', legacyEncoding: true };
  }
}

async function extractPdf(file) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'pdfjsLib');
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await window.pdfjsLib.getDocument({ data }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => item.str).join(' '));
  }
  return pages.join('\n');
}

async function extractDocx(file) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js', 'mammoth');
  const result = await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
}

function loadScript(src, globalName) {
  if (window[globalName]) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-loader="${globalName}"]`);
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.loader = globalName;
    script.addEventListener('load', resolve, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });
}

function normalizeText(text) {
  return String(text || '')
    .replace(/\uFEFF/g, '')
    .replace(/\u00ad/g, '')
    .replace(/[\u00a0\t]+/g, ' ')
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function clearFile() {
  stopTimer();
  state.text = '';
  state.fileName = '';
  state.fileSize = 0;
  state.encoding = '';
  state.legacyEncoding = false;
  state.words = [];
  state.index = 0;
  state.playing = false;
  els.fileInput.value = '';
  els.fileName.textContent = '';
  els.fileMeta.textContent = '';
  els.previewCopy.textContent = '';
  els.encodingBadge.textContent = '';
  els.encodingWarningText.textContent = '';
  els.fileCard.hidden = true;
  els.textPreview.hidden = true;
  els.encodingWarning.hidden = true;
  updateStartState();
}

function renderFileMeta() {
  if (!state.fileName) return;
  const wordCount = tokenize(state.text).length;
  const sizeText = state.fileSize ? ` · ${formatBytes(state.fileSize)}` : '';
  els.fileMeta.textContent = `${wordCount.toLocaleString(state.lang === 'uk' ? 'uk-UA' : 'en-US')} ${i18n[state.lang].words}${sizeText}`;
}

function renderPreview() {
  if (!state.fileName || !state.text) return;
  const preview = state.text.length > 760 ? `${state.text.slice(0, 760).trimEnd()}…` : state.text;
  els.previewCopy.textContent = preview;
  els.encodingBadge.textContent = state.encoding;
  els.encodingBadge.classList.toggle('is-warning', state.legacyEncoding);
  els.encodingWarning.hidden = !state.legacyEncoding;
  els.encodingWarningText.textContent = state.legacyEncoding ? i18n[state.lang].encodingWarning : '';
  els.textPreview.hidden = false;
  renderIcons();
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function updateStartState() {
  els.startButton.disabled = tokenize(state.text).length === 0;
}

function tokenize(text) {
  const normalized = normalizeText(text);
  return normalized ? normalized.split(/\s+/u).filter(Boolean) : [];
}

function openReader() {
  state.words = tokenize(state.text);
  if (!state.words.length) return;
  state.index = 0;
  state.playing = true;
  document.body.classList.add('reader-open');
  els.reader.classList.add('is-open');
  els.reader.setAttribute('aria-hidden', 'false');
  els.wordTotal.textContent = String(state.words.length);
  els.readerSpeed.textContent = String(state.wpm);
  renderReaderMeta();
  renderWord();
  updatePlayButton();
  scheduleNext();
}

function closeReader() {
  stopTimer();
  state.playing = false;
  els.reader.classList.remove('is-open');
  els.reader.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('reader-open');
  updatePlayButton();
}

function renderReaderMeta() {
  if (!els.readerFileName) return;
  els.readerFileName.textContent = state.fileName || i18n[state.lang].readingFile;
}

function togglePlayback() {
  if (!state.words.length) return;
  if (state.index >= state.words.length - 1 && !state.playing) state.index = 0;
  state.playing = !state.playing;
  updatePlayButton();
  renderWord();
  if (state.playing) scheduleNext();
  else stopTimer();
}

function updatePlayButton() {
  const icon = state.playing ? 'pause' : 'play';
  els.playButton.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i>`;
  renderIcons();
}

function scheduleNext() {
  stopTimer();
  if (!state.playing) return;
  const delay = 60000 / state.wpm;
  state.timer = window.setTimeout(advanceWord, delay);
}

function advanceWord() {
  if (!state.playing) return;
  if (state.index >= state.words.length - 1) {
    state.index = state.words.length - 1;
    state.playing = false;
    stopTimer();
    renderWord();
    updatePlayButton();
    showToast(i18n[state.lang].finished);
    return;
  }
  state.index += 1;
  renderWord();
  scheduleNext();
}

function seek(amount) {
  state.index = Math.min(state.words.length - 1, Math.max(0, state.index + amount));
  renderWord();
  if (state.playing) scheduleNext();
}

function renderWord() {
  const word = state.words[state.index] || '';
  const pivot = getOrpIndex(word);
  const glyphs = Array.from(word);
  els.wordBefore.textContent = glyphs.slice(0, pivot).join('');
  els.wordFocus.textContent = glyphs[pivot] || '•';
  els.wordAfter.textContent = glyphs.slice(pivot + 1).join('');

  const current = Math.min(state.words.length, state.index + 1);
  const progress = state.words.length ? (current / state.words.length) * 100 : 0;
  els.progressPercent.textContent = `${Math.round(progress)}%`;
  els.progressBar.style.width = `${progress}%`;
  els.wordPosition.textContent = String(current);
}

function getOrpIndex(word) {
  if (!word) return 0;
  const letters = Array.from(word);
  const lexical = [];
  for (let i = 0; i < letters.length; i += 1) {
    if (/\p{L}|\p{N}/u.test(letters[i])) lexical.push(i);
  }
  if (!lexical.length) return Math.floor((letters.length - 1) / 2);

  const length = lexical.length;
  let lexicalIndex = 0;
  if (length >= 2 && length <= 5) lexicalIndex = 1;
  else if (length >= 6 && length <= 9) lexicalIndex = 2;
  else if (length >= 10 && length <= 13) lexicalIndex = 3;
  else if (length >= 14) lexicalIndex = 4;
  lexicalIndex = Math.min(lexicalIndex, length - 1);
  return lexical[lexicalIndex];
}

function stopTimer() {
  if (state.timer) window.clearTimeout(state.timer);
  state.timer = null;
}

function showToast(message, duration = 2800) {
  window.clearTimeout(state.toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add('is-visible');
  if (duration > 0) state.toastTimer = window.setTimeout(hideToast, duration);
}

function hideToast() {
  els.toast.classList.remove('is-visible');
}

function renderIcons() {
  if (window.lucide) window.lucide.createIcons();
}

boot();