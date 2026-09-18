import { pinyin as getPinyin, polyphonic } from "pinyin-pro";
import cnchar from "cnchar";
import radicalPlugin from "cnchar-radical";
import wordsPlugin from "cnchar-words";
import HanziWriter from "hanzi-writer";

cnchar.use(radicalPlugin);
cnchar.use(wordsPlugin);

const CHARACTER_STORAGE_KEY = "moge-learning-character";
const DEFAULT_CHARACTER = "永";
const MAX_VISIBLE_WORDS = 12;
const HAN_CHARACTER_RE = /^\p{Script=Han}$/u;

const els = {
  form: document.querySelector("#character-form"),
  input: document.querySelector("#character-input"),
  error: document.querySelector("#character-error"),
  status: document.querySelector("#learning-status"),
  statusText: document.querySelector("#learning-status-text"),
  replay: document.querySelector("#replay-button"),
  stage: document.querySelector("#animation-stage"),
  writerTarget: document.querySelector("#writer-target"),
  placeholder: document.querySelector("#animation-placeholder"),
  animationNote: document.querySelector("#animation-note"),
  loopBadge: document.querySelector("#loop-badge"),
  glyph: document.querySelector("#character-glyph"),
  pinyin: document.querySelector("#character-pinyin"),
  pinyinNote: document.querySelector("#character-pinyin-note"),
  radical: document.querySelector("#character-radical"),
  structure: document.querySelector("#character-structure"),
  strokes: document.querySelector("#character-strokes"),
  strokeCount: document.querySelector("#stroke-count"),
  strokeGrid: document.querySelector("#stroke-grid"),
  strokeEmpty: document.querySelector("#stroke-empty"),
  wordList: document.querySelector("#word-list"),
  wordsCount: document.querySelector("#words-count"),
  wordsEmpty: document.querySelector("#words-empty"),
  wordsToggle: document.querySelector("#words-toggle")
};

const strokeData = new Map();
const strokeLoads = new Map();
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

let currentCharacter = null;
let currentWords = [];
let wordsExpanded = false;
let writer = null;
let writerCharacter = null;
let requestId = 0;
let composing = false;

function isHanCharacter(value) {
  if (!value || [...value].length !== 1) return false;
  return HAN_CHARACTER_RE.test(value) || /^[\u3400-\u9fff]$/.test(value);
}

function readSavedCharacter() {
  try {
    const saved = localStorage.getItem(CHARACTER_STORAGE_KEY);
    return isHanCharacter(saved) ? saved : DEFAULT_CHARACTER;
  }
  catch {
    return DEFAULT_CHARACTER;
  }
}

function saveCharacter(character) {
  try { localStorage.setItem(CHARACTER_STORAGE_KEY, character); }
  catch { /* 隐私模式或禁用存储时不影响学习 */ }
}

function validateInput(rawValue) {
  const value = String(rawValue || "").trim();
  if (!value) return { character: null, message: "请输入一个汉字。" };
  const chars = [...value];
  if (chars.length !== 1) return { character: null, message: "每次只能输入一个汉字。" };
  if (!isHanCharacter(chars[0])) return { character: null, message: "请输入有效的汉字，不要包含数字或标点。" };
  return { character: chars[0], message: "" };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setHidden(element, hidden) {
  element.hidden = hidden;
}

function setStatus(message, kind = "loading") {
  els.status.className = `learning-status ${kind}`.trim();
  els.statusText.textContent = message;
}

function clearAnimationMessage() {
  els.placeholder.classList.remove("error");
  els.placeholder.textContent = "正在加载笔顺…";
  setHidden(els.placeholder, false);
}

function getCharacterInfo(character) {
  let radicalInfo = {};
  try { radicalInfo = cnchar.radical(character)?.[0] || {}; }
  catch { /* 无部首数据时使用占位信息 */ }

  let readings = [];
  try {
    readings = [...new Set(polyphonic(character, { toneType: "symbol", type: "array" })?.[0] || [])];
  }
  catch { /* pinyin-pro 对极少数字符可能没有读音 */ }

  if (!readings.length) {
    try { readings = [getPinyin(character, { toneType: "symbol" })].filter(Boolean); }
    catch { /* ignore */ }
  }

  let strokeCount = 0;
  try { strokeCount = Number(cnchar.stroke(character)) || 0; }
  catch { /* ignore */ }

  return {
    pinyin: readings.join(" / "),
    readings,
    radical: radicalInfo.radical || "—",
    structure: radicalInfo.struct || "结构待查",
    strokeCount
  };
}

function renderCharacterInfo(character) {
  const info = getCharacterInfo(character);
  els.glyph.textContent = character;
  els.stage.setAttribute("aria-label", `${character} 的笔顺动画`);
  els.pinyin.textContent = info.pinyin || "—";
  els.pinyinNote.textContent = info.readings.length > 1 ? `常见读音 · ${info.readings.length} 个` : "常见读音";
  els.radical.textContent = info.radical;
  els.structure.textContent = info.structure;
  els.strokes.textContent = info.strokeCount ? `${info.strokeCount} 画` : "—";
  els.strokeCount.textContent = info.strokeCount ? `${info.strokeCount} 画` : "—";
}

function clearCharacterInfo() {
  els.glyph.textContent = "—";
  els.stage.setAttribute("aria-label", "等待输入汉字");
  els.pinyin.textContent = "—";
  els.pinyinNote.textContent = "输入后显示读音";
  els.radical.textContent = "—";
  els.structure.textContent = "—";
  els.strokes.textContent = "—";
  els.strokeCount.textContent = "—";
}

function getWords(character) {
  try {
    const words = cnchar.words(character);
    if (!Array.isArray(words)) return [];
    return [...new Set(words.filter(word => typeof word === "string" && word.includes(character)))];
  }
  catch {
    return [];
  }
}

function getWordPinyin(word) {
  try { return getPinyin(word, { toneType: "symbol" }); }
  catch { return "拼音待查"; }
}

function renderWords() {
  const count = currentWords.length;
  els.wordsCount.textContent = `${count} 个词`;
  els.wordList.innerHTML = "";
  setHidden(els.wordsEmpty, count > 0);
  setHidden(els.wordsToggle, count <= MAX_VISIBLE_WORDS);

  if (!count) return;

  const visibleWords = wordsExpanded ? currentWords : currentWords.slice(0, MAX_VISIBLE_WORDS);
  els.wordList.innerHTML = visibleWords.map(word => `
    <div class="word-item" role="listitem">
      <span class="word-text">${escapeHtml(word)}</span>
      <span class="word-pinyin" lang="zh-Latn">${escapeHtml(getWordPinyin(word))}</span>
    </div>
  `).join("");
  els.wordList.setAttribute("role", "list");

  if (count > MAX_VISIBLE_WORDS) {
    els.wordsToggle.textContent = wordsExpanded ? "收起" : "展开全部";
    els.wordsToggle.setAttribute("aria-expanded", String(wordsExpanded));
  }
}

function renderStrokeLoading() {
  els.strokeGrid.innerHTML = `<div class="stroke-loading">正在加载笔顺…</div>`;
  setHidden(els.strokeEmpty, true);
}

function renderStrokeError() {
  els.strokeGrid.innerHTML = "";
  setHidden(els.strokeEmpty, false);
}

function renderStrokeSvg(paths, fillForPath = () => "#b8b3ae") {
  const visiblePaths = paths.map((path, index) => `
      <path d="${escapeHtml(path)}" fill="${fillForPath(index)}" />
    `).join("");
  return `<svg viewBox="0 0 1024 1024" aria-hidden="true"><g transform="translate(0 900) scale(1 -1)">${visiblePaths}</g></svg>`;
}

function renderStrokeGrid(character, data) {
  if (!data || !Array.isArray(data.strokes) || !data.strokes.length) {
    renderStrokeError();
    return;
  }

  const paths = data.strokes;
  els.strokeCount.textContent = `${paths.length} 画`;
  const cells = [`
    <div class="stroke-step-cell reference" role="img" aria-label="${escapeHtml(character)} 完整字形">
      ${renderStrokeSvg(paths, () => "#6f6962")}
      <span class="stroke-label reference-label">参考</span>
    </div>
  `];

  for (let step = 1; step <= paths.length; step += 1) {
    cells.push(`
      <div class="stroke-step-cell" role="img" aria-label="${escapeHtml(character)} 第 ${step} 画">
        ${renderStrokeSvg(paths.slice(0, step), index => index === step - 1 ? "#a63225" : "#b8b3ae")}
        <span class="stroke-label">${step}</span>
      </div>
    `);
  }

  els.strokeGrid.innerHTML = cells.join("");
  setHidden(els.strokeEmpty, true);
}

function loadStrokeData(character) {
  if (strokeData.has(character)) return Promise.resolve(strokeData.get(character));
  if (strokeLoads.has(character)) return strokeLoads.get(character);

  const request = Promise.resolve()
    .then(() => HanziWriter.loadCharacterData(character))
    .then(data => {
      if (!data || !Array.isArray(data.strokes) || !data.strokes.length) throw new Error("笔顺数据为空");
      strokeData.set(character, data);
      return data;
    })
    .catch(() => {
      strokeData.set(character, null);
      return null;
    })
    .finally(() => strokeLoads.delete(character));

  strokeLoads.set(character, request);
  return request;
}

function cancelWriterAnimations(instance = writer) {
  if (!instance) return;
  try { instance.cancelQuiz?.(); }
  catch { /* ignore */ }
  try { instance._renderState?.cancelAll?.(); }
  catch { /* HanziWriter 内部实现变化时仍继续清理 DOM */ }
}

function teardownWriter() {
  const oldWriter = writer;
  writer = null;
  writerCharacter = null;
  if (oldWriter) {
    cancelWriterAnimations(oldWriter);
    try { oldWriter._hanziWriterRenderer?.destroy?.(); }
    catch { /* ignore */ }
    try { oldWriter.destroy?.(); }
    catch { /* 兼容没有公开 destroy 方法的 HanziWriter 版本 */ }
  }
  els.writerTarget.replaceChildren();
  els.replay.disabled = true;
}

function showAnimationError(token, message = "笔顺加载失败，请稍后刷新重试") {
  if (token !== requestId) return;
  els.placeholder.textContent = message;
  els.placeholder.classList.add("error");
  setHidden(els.placeholder, false);
  setHidden(els.loopBadge, true);
  els.animationNote.textContent = "暂时无法播放笔顺动画";
  els.replay.disabled = true;
}

function createWriter(character, token) {
  const instance = HanziWriter.create(els.writerTarget, character, {
    width: 360,
    height: 360,
    padding: 26,
    showOutline: true,
    showCharacter: false,
    strokeColor: "#a63225",
    outlineColor: "#d8cbc0",
    radicalColor: "#7d2118",
    strokeAnimationSpeed: 1,
    delayBetweenStrokes: 1000,
    delayBetweenLoops: 1800,
    charDataLoader: char => {
      const cached = strokeData.get(char);
      if (cached) return cached;
      return loadStrokeData(char).then(data => {
        if (!data) throw new Error("笔顺数据加载失败");
        return data;
      });
    },
    onLoadCharDataError: () => showAnimationError(token)
  });
  // HanziWriter's SVG has fixed 360px coordinates; viewBox keeps them responsive with the grid.
  const svg = els.writerTarget.querySelector("svg");
  svg?.setAttribute("viewBox", "0 0 360 360");
  writer = instance;
  writerCharacter = character;
  return instance;
}

function cancelCurrentAnimation() {
  cancelWriterAnimations(writer);
}

function startAnimation({ manual = false } = {}) {
  const instance = writer;
  const token = requestId;
  if (!instance || writerCharacter !== currentCharacter) return;
  cancelCurrentAnimation();

  if (reducedMotionQuery.matches && !manual) {
    setHidden(els.loopBadge, true);
    els.animationNote.textContent = "已按系统设置显示静态笔顺";
    Promise.resolve(instance.showCharacter({ duration: 0 })).catch(() => showAnimationError(token));
    setStatus(`“${currentCharacter}”已准备好，系统已减少动态效果`, "ready");
    return;
  }

  if (reducedMotionQuery.matches && manual) {
    setHidden(els.loopBadge, true);
    els.animationNote.textContent = "本次播放完成后不会自动循环";
    Promise.resolve(instance.animateCharacter()).then(() => {
      if (token === requestId && writer === instance) setStatus(`“${currentCharacter}”单轮播放完成`, "ready");
    }).catch(() => showAnimationError(token));
    return;
  }

  setHidden(els.loopBadge, false);
  els.animationNote.textContent = "播放完成后会自动循环";
  setStatus(`正在循环播放“${currentCharacter}”的笔顺`, "ready");
  Promise.resolve(instance.loopCharacterAnimation()).catch(() => showAnimationError(token));
}

async function mountAnimation(character, data, token) {
  if (token !== requestId || currentCharacter !== character || !data) return;
  teardownWriter();
  clearAnimationMessage();
  const instance = createWriter(character, token);
  try {
    const loadedCharacter = await instance.getCharacterData();
    if (token !== requestId || currentCharacter !== character || writer !== instance || !loadedCharacter) return;
    setHidden(els.placeholder, true);
    els.replay.disabled = false;
    startAnimation();
  }
  catch {
    showAnimationError(token);
  }
}

function clearLearningResult(message) {
  requestId += 1;
  currentCharacter = null;
  currentWords = [];
  wordsExpanded = false;
  teardownWriter();
  clearCharacterInfo();
  els.strokeGrid.innerHTML = "";
  setHidden(els.strokeEmpty, true);
  renderWords();
  els.loopBadge.hidden = true;
  els.animationNote.textContent = "输入有效汉字后开始播放";
  els.placeholder.textContent = "等待输入汉字…";
  els.placeholder.classList.remove("error");
  setHidden(els.placeholder, false);
  setStatus(message, "error");
}

function learnCharacter(character) {
  if (currentCharacter === character) {
    startAnimation({ manual: true });
    return;
  }

  const token = ++requestId;
  currentCharacter = character;
  wordsExpanded = false;
  saveCharacter(character);
  els.input.value = character;
  els.error.textContent = "";
  renderCharacterInfo(character);
  currentWords = getWords(character);
  renderWords();
  renderStrokeLoading();
  teardownWriter();
  clearAnimationMessage();
  els.animationNote.textContent = "正在准备笔顺动画…";
  els.loopBadge.hidden = reducedMotionQuery.matches;
  setStatus(`正在准备“${character}”的笔顺…`, "loading");

  loadStrokeData(character).then(data => {
    if (token !== requestId || currentCharacter !== character) return;
    if (!data) {
      renderStrokeError();
      showAnimationError(token);
      setStatus(`“${character}”的笔顺数据暂时不可用`, "error");
      return;
    }
    renderStrokeGrid(character, data);
    mountAnimation(character, data, token);
  });
}

function handleFormValue(rawValue, { forceReplay = false } = {}) {
  const result = validateInput(rawValue);
  if (!result.character) {
    els.error.textContent = result.message;
    clearLearningResult(result.message);
    return;
  }
  els.error.textContent = "";
  if (forceReplay && currentCharacter === result.character) startAnimation({ manual: true });
  else learnCharacter(result.character);
}

function handleVisibilityChange() {
  if (!writer || reducedMotionQuery.matches) return;
  if (document.hidden) {
    Promise.resolve(writer.pauseAnimation()).catch(() => {});
    setStatus("已暂停，返回此页面后继续循环播放", "ready");
  }
  else {
    Promise.resolve(writer.resumeAnimation()).catch(() => {});
    setStatus(`正在循环播放“${currentCharacter}”的笔顺`, "ready");
  }
}

function handleReducedMotionChange() {
  if (!writer || !currentCharacter) return;
  startAnimation();
}

function bindEvents() {
  els.form.addEventListener("submit", event => {
    event.preventDefault();
    handleFormValue(els.input.value, { forceReplay: true });
  });
  els.input.addEventListener("compositionstart", () => { composing = true; });
  els.input.addEventListener("compositionend", () => {
    composing = false;
    handleFormValue(els.input.value);
  });
  els.input.addEventListener("input", () => {
    if (!composing) handleFormValue(els.input.value);
  });
  els.replay.addEventListener("click", () => startAnimation({ manual: true }));
  els.wordsToggle.addEventListener("click", () => {
    wordsExpanded = !wordsExpanded;
    renderWords();
  });
  document.addEventListener("visibilitychange", handleVisibilityChange);
  if (typeof reducedMotionQuery.addEventListener === "function") reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
  else reducedMotionQuery.addListener(handleReducedMotionChange);
}

function init() {
  const savedCharacter = readSavedCharacter();
  els.input.value = savedCharacter;
  bindEvents();
  learnCharacter(savedCharacter);
}

init();
