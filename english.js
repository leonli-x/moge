import {
  ENGLISH_PHONETICS,
  EXPLICIT_BREAKDOWNS,
  PREFIXES_LIST,
  ROOTS_LIST,
  SUFFIXES_LIST,
  PRESET_WORD_GROUPS,
  PRESET_SENTENCES
} from "./english-data.js";

// 全局应用状态
const state = {
  mode: 'letter', // 'letter' | 'word' | 'sentence'

  // 模式 1：字母笔顺状态
  letterCat: 'all', // 'all' | 'pairs' | 'upper' | 'lower' | 'vowels' | 'custom'
  customLetters: 'A B C a b c',
  showLetterStrokeCard: true,
  letterTraceCount: 3,

  // 模式 2：单词字帖状态
  wordCat: 'primary',
  customWords: '',
  showPhonetics: true,
  showRootColors: true,
  wordTraceCount: 2,

  // 模式 3：文章句子状态
  sentenceCat: 'quotes',
  customSentences: '',
  showSentenceRootColors: true,

  // 四线三格与字体风格
  gridColorType: 'red-blue', // 'red-blue' | 'gray'
  showSlantLines: true,
  fontFamily: 'hengshui', // 'hengshui' | 'italic'
  traceOpacity: 25, // 15 - 60

  // 纸张与版面
  sheetTitle: '规范英语书法练习字帖',
  showInfoBar: true
};

// 预设字母表数据
const LETTER_SETS = {
  all: [
    'A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e', 'F', 'f', 'G', 'g',
    'H', 'h', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm', 'N', 'n',
    'O', 'o', 'P', 'p', 'Q', 'q', 'R', 'r', 'S', 's', 'T', 't', 'U', 'u',
    'V', 'v', 'W', 'w', 'X', 'x', 'Y', 'y', 'Z', 'z'
  ],
  pairs: [
    'Aa', 'Bb', 'Cc', 'Dd', 'Ee', 'Ff', 'Gg', 'Hh', 'Ii', 'Jj', 'Kk', 'Ll',
    'Mm', 'Nn', 'Oo', 'Pp', 'Qq', 'Rr', 'Ss', 'Tt', 'Uu', 'Vv', 'Ww', 'Xx',
    'Yy', 'Zz'
  ],
  upper: [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ],
  lower: [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ],
  vowels: ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u']
};

// 词根拆分引擎
function decomposeWord(word) {
  if (!word || typeof word !== 'string') return [{ text: word || '', type: 'plain' }];
  
  // 清洗非英文字符
  const cleanWord = word.trim();
  const lower = cleanWord.toLowerCase();

  // 1. 如果有词内连字符（用户主动标注），直接优先按照用户连字符切分
  if (cleanWord.includes('-')) {
    const segments = cleanWord.split('-');
    return segments.map((seg, idx) => {
      let type = 'root';
      if (idx === 0 && segments.length > 1) type = 'prefix';
      else if (idx === segments.length - 1) type = 'suffix';
      return { text: seg, type };
    });
  }

  // 2. 命中已验证词库
  if (EXPLICIT_BREAKDOWNS[lower]) {
    const parts = EXPLICIT_BREAKDOWNS[lower];
    const result = [];
    let idx = 0;
    for (const [pText, pType] of parts) {
      const orig = cleanWord.slice(idx, idx + pText.length);
      idx += pText.length;
      result.push({ text: orig, type: pType });
    }
    if (idx < cleanWord.length) {
      result.push({ text: cleanWord.slice(idx), type: 'suffix' });
    }
    return result;
  }

  // 3. 算法启发式词素切分
  const prefixes = PREFIXES_LIST.map(p => p.prefix).sort((a, b) => b.length - a.length);
  const suffixes = SUFFIXES_LIST.map(s => s.suffix).sort((a, b) => b.length - a.length);
  const roots = ROOTS_LIST.map(r => r.root).sort((a, b) => b.length - a.length);

  let rem = lower;
  let foundPrefix = '';
  for (const p of prefixes) {
    if (rem.startsWith(p) && rem.length > p.length + 2) {
      foundPrefix = p;
      rem = rem.slice(p.length);
      break;
    }
  }

  const foundSuffixes = [];
  while (true) {
    let matched = false;
    for (const s of suffixes) {
      if (rem.endsWith(s) && rem.length > s.length + 2) {
        foundSuffixes.unshift(s);
        rem = rem.slice(0, -s.length);
        matched = true;
        break;
      }
    }
    if (!matched || rem.length <= 2) break;
  }

  const result = [];
  let currIdx = 0;
  if (foundPrefix) {
    result.push({ text: cleanWord.slice(currIdx, currIdx + foundPrefix.length), type: 'prefix' });
    currIdx += foundPrefix.length;
  }

  // 判断剩余部分是已知词根还是基础词
  let rootType = 'root';
  if (!foundPrefix && foundSuffixes.length === 0) {
    // 既无前缀也无后缀的词，归类为普通基础词
    rootType = 'plain';
  }
  result.push({ text: cleanWord.slice(currIdx, currIdx + rem.length), type: rootType });
  currIdx += rem.length;

  for (const s of foundSuffixes) {
    result.push({ text: cleanWord.slice(currIdx, currIdx + s.length), type: 'suffix' });
    currIdx += s.length;
  }

  return result;
}

// 获取单词音标
function getWordPhonetic(word) {
  if (!word) return '';
  const clean = word.trim().toLowerCase().replace(/[^a-z]/g, '');
  if (ENGLISH_PHONETICS[clean]) {
    return ENGLISH_PHONETICS[clean];
  }
  // 简易拼读启发式兜底，若未收录则留空或生成标准括号
  return '';
}

// 获取字母笔顺 SVG 路径（优先支持大小写配对如 Aa，以及单独大写 A 或小写 a）
function getLetterStrokeSvgUrl(letter) {
  if (!letter || letter.length === 0) return null;
  const clean = letter.trim();
  if (!clean) return null;

  // 大小写配对形式（如 Aa, A a, aA 等）
  if (clean.length >= 2) {
    const firstUpper = clean.toUpperCase()[0];
    if (firstUpper >= 'A' && firstUpper <= 'Z') {
      return `/english_bi_shun/pairs/${firstUpper}.svg`;
    }
  }

  const firstChar = clean[0];
  if (firstChar >= 'A' && firstChar <= 'Z') {
    return `/english_bi_shun/da_xie/${firstChar}.svg`;
  } else if (firstChar >= 'a' && firstChar <= 'z') {
    return `/english_bi_shun/xiao_xie/${firstChar}.svg`;
  }
  return null;
}

// 格式化带有词根样式的 HTML 字符串
function formatWordRootHTML(word, showColors = true) {
  if (!word) return '';
  if (!showColors) {
    return `<span class="eng-word eng-plain">${escapeHTML(word)}</span>`;
  }
  const parts = decomposeWord(word);
  const spans = parts.map(p => {
    let cls = 'eng-root-plain';
    if (p.type === 'prefix') cls = 'eng-root-prefix';
    else if (p.type === 'root') cls = 'eng-root-core';
    else if (p.type === 'suffix') cls = 'eng-root-suffix';
    else if (p.type === 'compound') cls = 'eng-root-compound';
    return `<span class="${cls}">${escapeHTML(p.text)}</span>`;
  }).join('');
  return `<span class="eng-word">${spans}</span>`;
}

// 对句子中的所有单词进行词根标注格式化
function formatSentenceWithRootsHTML(sentence, showColors = true) {
  if (!sentence) return '';
  // 按单词边界进行分割
  return sentence.replace(/([a-zA-Z]+)/g, match => {
    return formatWordRootHTML(match, showColors);
  });
}

// 格式化带有词根色彩的 SVG tspan 字符串
function formatWordRootSvgTspans(word, showColors = true) {
  if (!word) return '';
  if (!showColors) {
    return `<tspan fill="#1e293b">${escapeHTML(word)}</tspan>`;
  }
  const parts = decomposeWord(word);
  return parts.map(p => {
    let fill = '#1e293b';
    if (p.type === 'prefix') fill = '#7c3aed';
    else if (p.type === 'root') fill = '#1d4ed8';
    else if (p.type === 'suffix') fill = '#059669';
    else if (p.type === 'compound') fill = '#d97706';
    return `<tspan fill="${fill}" font-weight="600">${escapeHTML(p.text)}</tspan>`;
  }).join('');
}

// 对句子中的所有单词进行词根标注的 SVG tspan 格式化
function formatSentenceSvgTspans(sentence, showColors = true) {
  if (!sentence) return '';
  const tokens = sentence.split(/([a-zA-Z]+)/);
  return tokens.map(token => {
    if (!token) return '';
    if (/^[a-zA-Z]+$/.test(token)) {
      return formatWordRootSvgTspans(token, showColors);
    } else {
      return `<tspan fill="#1e293b">${escapeHTML(token)}</tspan>`;
    }
  }).join('');
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 生成 1:1:1 四线三格 SVG 背景
// y1 = 12 (顶线)
// y2 = 28 (中线)
// y3 = 44 (基线·第三线)
// y4 = 60 (底线·第四线)
// 三格每格高度严格等距 16px (1:1:1 官方标准)
function generateFourLineSvg({
  width = 100,
  height = 72,
  gridColorType = 'red-blue',
  showSlant = true,
  slantStep = 24
} = {}) {
  const isRedBlue = gridColorType === 'red-blue';
  const normalLineColor = isRedBlue ? '#4a90e2' : '#b0aba2';
  const baseLineColor = isRedBlue ? '#e03e3e' : '#757069';
  const normalWidth = 0.9;
  const baseWidth = isRedBlue ? 1.2 : 1.1;

  // 倾斜参考线 (78度倾角，约 12px x偏移)
  let slantLines = '';
  if (showSlant) {
    const slantColor = isRedBlue ? 'rgba(74, 144, 226, 0.22)' : 'rgba(120, 115, 108, 0.22)';
    for (let x = -30; x < width + 40; x += slantStep) {
      slantLines += `<line x1="${x + 10}" y1="12" x2="${x}" y2="60" stroke="${slantColor}" stroke-width="0.8" stroke-dasharray="2,3" />`;
    }
  }

  return `
    <svg class="eng-grid-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      ${slantLines}
      <!-- 第1线：顶线 -->
      <line x1="0" y1="12" x2="${width}" y2="12" stroke="${normalLineColor}" stroke-width="${normalWidth}" />
      <!-- 第2线：中线 -->
      <line x1="0" y1="28" x2="${width}" y2="28" stroke="${normalLineColor}" stroke-width="${normalWidth}" />
      <!-- 第3线：基准线 (Baseline) -->
      <line x1="0" y1="44" x2="${width}" y2="44" stroke="${baseLineColor}" stroke-width="${baseWidth}" />
      <!-- 第4线：底线 -->
      <line x1="0" y1="60" x2="${width}" y2="60" stroke="${normalLineColor}" stroke-width="${normalWidth}" />
    </svg>
  `;
}

// 按照 PPT 棍棒体规范，精确计算字母在四线三格中的占格与字形参数
function generateLetterGlyphSvg({ letter, isModel, traceOpacity, fontFamily }) {
  const opacityAttr = !isModel ? `opacity="${traceOpacity / 100}"` : '';
  const fontWeight = isModel ? '600' : '500';
  const clean = letter.trim();

  // 如果是大小写配对形式（如 Aa, Bb, Gg...）
  if (clean.length === 2) {
    const c1 = clean[0];
    const c2 = clean[1];
    const sz1 = 40; // 大写顶天立地占上中两格 (12~44)
    let sz2 = 28;  // 小写默认占满中格 (28~44)
    if ('bdhkl'.includes(c2)) sz2 = 39;      // 上伸字母竖线触碰第1线
    else if ('gqy'.includes(c2)) sz2 = 33;   // 下伸字母触碰底线
    else if (c2 === 'p') sz2 = 33;
    else if (c2 === 't') sz2 = 33;
    else if (c2 === 'f') sz2 = 38;
    else if (c2 === 'i') sz2 = 29;
    else if (c2 === 'j') sz2 = 31;

    return `
      <svg class="eng-glyph-svg" viewBox="0 0 70 72" preserveAspectRatio="xMidYMid meet">
        <text x="23" y="44" text-anchor="middle" dominant-baseline="alphabetic"
              class="letter-svg-text font-${fontFamily}"
              font-size="${sz1}" font-weight="${fontWeight}"
              fill="#1e293b" ${opacityAttr}>${escapeHTML(c1)}</text>
        <text x="48" y="44" text-anchor="middle" dominant-baseline="alphabetic"
              class="letter-svg-text font-${fontFamily}"
              font-size="${sz2}" font-weight="${fontWeight}"
              fill="#1e293b" ${opacityAttr}>${escapeHTML(c2)}</text>
      </svg>
    `;
  }

  // 单字母模式（如仅大写 A 或仅小写 a）
  let sz = 31;
  const ch = clean;
  if (ch >= 'A' && ch <= 'Z') {
    sz = 45; // 大写占满上中两格 (12~44)
  } else if ('bdhkl'.includes(ch)) {
    sz = 44; // 上伸小写占上中两格 (12~44)
  } else if ('gqy'.includes(ch)) {
    sz = 36; // 下伸小写占中下两格 (28~60)
  } else if (ch === 'p') {
    sz = 36;
  } else if (ch === 't') {
    sz = 36;
  } else if (ch === 'f') {
    sz = 43;
  } else if (ch === 'i') {
    sz = 33;
  } else if (ch === 'j') {
    sz = 35;
  } else {
    // 中格小写 (a, c, e, m, n, o, r, s, u, v, w, x, z)
    sz = 31;
  }

  return `
    <svg class="eng-glyph-svg" viewBox="0 0 70 72" preserveAspectRatio="xMidYMid meet">
      <text x="35" y="44" text-anchor="middle" dominant-baseline="alphabetic"
            class="letter-svg-text font-${fontFamily}"
            font-size="${sz}" font-weight="${fontWeight}"
            fill="#1e293b" ${opacityAttr}>${escapeHTML(clean)}</text>
    </svg>
  `;
}

// ---------------- 渲染主流程 ----------------

// 渲染当前页面的 A4 字帖
function renderPages() {
  const pagesContainer = document.getElementById('pages');
  const pageCountBadge = document.getElementById('page-count-badge');
  if (!pagesContainer) return;

  let pagesHTML = '';
  let totalPages = 1;

  if (state.mode === 'letter') {
    const result = renderLetterMode();
    pagesHTML = result.html;
    totalPages = result.pageCount;
  } else if (state.mode === 'word') {
    const result = renderWordMode();
    pagesHTML = result.html;
    totalPages = result.pageCount;
  } else if (state.mode === 'sentence') {
    const result = renderSentenceMode();
    pagesHTML = result.html;
    totalPages = result.pageCount;
  }

  pagesContainer.innerHTML = pagesHTML;
  if (pageCountBadge) {
    pageCountBadge.textContent = `共 ${totalPages} 页`;
  }
}

// 渲染页眉公共结构（包含品牌印章、标题与学生信息栏）
function renderSheetHeader(subTag = '') {
  let infoBarHTML = '';
  if (state.showInfoBar) {
    infoBarHTML = `
      <div class="english-sheet-info-bar">
        <span class="info-item">班级<span class="underline"></span></span>
        <span class="info-item">姓名<span class="underline"></span></span>
        <span class="info-item">日期<span class="underline"></span></span>
        <span class="info-item">评分<span class="underline"></span></span>
      </div>
    `;
  }

  let legendHTML = '';
  if ((state.mode === 'word' && state.showRootColors) || (state.mode === 'sentence' && state.showSentenceRootColors)) {
    legendHTML = `
      <div class="root-color-legend">
        <span class="legend-item"><span class="color-dot prefix-dot"></span>前缀 Prefix</span>
        <span class="legend-item"><span class="color-dot root-dot"></span>词根 Root</span>
        <span class="legend-item"><span class="color-dot suffix-dot"></span>后缀 Suffix</span>
        <span class="legend-item"><span class="color-dot compound-dot"></span>复合词 Compound</span>
      </div>
    `;
  }

  return `
    <header class="english-sheet-header">
      <div class="sheet-header-top">
        <div class="english-sheet-seal">墨</div>
        <div class="english-header-text">
          <div class="title-with-tag">
            <h2 class="english-sheet-title">${escapeHTML(state.sheetTitle)}</h2>
            ${subTag ? `<span class="mode-badge-tag">${subTag}</span>` : ''}
          </div>
          ${infoBarHTML}
        </div>
      </div>
      ${legendHTML}
    </header>
  `;
}

// 渲染页脚公共结构
function renderSheetFooter(currentPage, totalPages) {
  return `
    <footer class="english-sheet-footer">
      <span>墨格 · 英语书法四线三格字帖</span>
      <span class="page-num">第 ${currentPage} / ${totalPages} 页</span>
    </footer>
  `;
}

// ================= 1. 字母笔顺模式 =================
function renderLetterMode() {
  let letters = [];
  if (state.letterCat === 'custom') {
    letters = state.customLetters.trim().split(/\s+/).filter(Boolean);
  } else {
    letters = LETTER_SETS[state.letterCat] || LETTER_SETS.all;
  }

  if (letters.length === 0) {
    return {
      html: `<div class="empty-hint">请输入要练习的英文字母</div>`,
      pageCount: 1
    };
  }

  // A4 纵向排版：每页容纳 11 行
  const rowsPerPage = 11;
  const pagesData = [];
  for (let i = 0; i < letters.length; i += rowsPerPage) {
    pagesData.push(letters.slice(i, i + rowsPerPage));
  }
  const pageCount = pagesData.length;

  let pagesHTML = '';
  pagesData.forEach((pageItems, pIdx) => {
    let rowsHTML = '';

    pageItems.forEach(letter => {
      const strokeSvgUrl = state.showLetterStrokeCard ? getLetterStrokeSvgUrl(letter) : null;

      // 笔顺示范卡块
      let strokeCardHTML = '';
      if (state.showLetterStrokeCard) {
        const isPair = letter.trim().length >= 2;
        const cardClass = `letter-stroke-card${isPair ? ' pair-card' : ''}`;
        if (strokeSvgUrl) {
          strokeCardHTML = `
            <div class="${cardClass}" title="字母 ${escapeHTML(letter)} 棍棒体笔顺示范">
              <img src="${strokeSvgUrl}" alt="${escapeHTML(letter)} 棍棒体笔顺示范" />
            </div>
          `;
        } else {
          strokeCardHTML = `
            <div class="${cardClass} text-preview">
              <span>${escapeHTML(letter)}</span>
            </div>
          `;
        }
      }

      // 四线三格格子组（示范 + 描红 + 临摹空白格）
      // 字母行默认包含 10 个书写格
      const totalCells = state.showLetterStrokeCard ? 9 : 10;
      let cellsHTML = '';

      for (let c = 0; c < totalCells; c++) {
        const isModel = c === 0;
        const isTrace = c > 0 && c <= state.letterTraceCount;
        const isBlank = c > state.letterTraceCount;

        let glyphSvg = '';
        let cellClass = 'eng-cell';

        if (isModel || isTrace) {
          cellClass += isModel ? ' model-cell' : ' trace-cell';
          glyphSvg = generateLetterGlyphSvg({
            letter,
            isModel,
            traceOpacity: state.traceOpacity,
            fontFamily: state.fontFamily
          });
        } else {
          cellClass += ' blank-cell';
        }

        const gridSvg = generateFourLineSvg({
          width: 70,
          height: 72,
          gridColorType: state.gridColorType,
          showSlant: state.showSlantLines
        });

        cellsHTML += `
          <div class="${cellClass}">
            ${gridSvg}
            ${glyphSvg}
          </div>
        `;
      }

      rowsHTML += `
        <div class="english-row letter-row">
          ${strokeCardHTML}
          <div class="letter-row-grids">
            ${cellsHTML}
          </div>
        </div>
      `;
    });

    // 补齐末页剩余空白行以铺满 A4
    const remainingRows = rowsPerPage - pageItems.length;
    for (let r = 0; r < remainingRows; r++) {
      let emptyCellsHTML = '';
      const totalCells = state.showLetterStrokeCard ? 9 : 10;
      for (let c = 0; c < totalCells; c++) {
        const gridSvg = generateFourLineSvg({
          width: 70,
          height: 72,
          gridColorType: state.gridColorType,
          showSlant: state.showSlantLines
        });
        emptyCellsHTML += `<div class="eng-cell blank-cell">${gridSvg}</div>`;
      }
      rowsHTML += `
        <div class="english-row letter-row empty-row">
          ${state.showLetterStrokeCard ? '<div class="letter-stroke-card empty-card"></div>' : ''}
          <div class="letter-row-grids">${emptyCellsHTML}</div>
        </div>
      `;
    }

    pagesHTML += `
      <div class="sheet english-sheet portrait" data-page="${pIdx + 1}">
        ${renderSheetHeader('字母笔顺')}
        <div class="english-sheet-content">
          ${rowsHTML}
        </div>
        ${renderSheetFooter(pIdx + 1, pageCount)}
      </div>
    `;
  });

  return { html: pagesHTML, pageCount };
}

// ================= 2. 单词字帖模式 =================
function renderWordMode() {
  let words = [];
  if (state.wordCat === 'custom') {
    words = state.customWords.trim().split(/\n+/).map(w => w.trim()).filter(Boolean);
  } else {
    words = PRESET_WORD_GROUPS[state.wordCat]?.words || PRESET_WORD_GROUPS.primary.words;
  }

  if (words.length === 0) {
    return {
      html: `<div class="empty-hint">请输入要练习的单词列表（每行一个）</div>`,
      pageCount: 1
    };
  }

  // 单词模式每页容纳 9 行
  const rowsPerPage = 9;
  const pagesData = [];
  for (let i = 0; i < words.length; i += rowsPerPage) {
    pagesData.push(words.slice(i, i + rowsPerPage));
  }
  const pageCount = pagesData.length;

  let pagesHTML = '';
  pagesData.forEach((pageItems, pIdx) => {
    let rowsHTML = '';

    pageItems.forEach(word => {
      const phonetic = state.showPhonetics ? getWordPhonetic(word) : '';
      const phoneticDisplay = phonetic ? `<span class="word-phonetic-badge">${escapeHTML(phonetic)}</span>` : '<span class="word-phonetic-badge empty-phonetic"></span>';

      // 单词格生成：1个示范词 + N个描红词 + 空白临摹格
      // 每行总共 4 个大单词练习栏位
      const totalWordCols = 4;
      let wordColsHTML = '';

      for (let c = 0; c < totalWordCols; c++) {
        const isModel = c === 0;
        const isTrace = c > 0 && c <= state.wordTraceCount;
        const isBlank = c > state.wordTraceCount;

        let wordSvg = '';
        let colClass = 'word-col';

        if (isModel || isTrace) {
          colClass += isModel ? ' model-col' : ' trace-col';
          const opacityAttr = isTrace ? `opacity="${state.traceOpacity / 100}"` : '';
          const showColors = isModel && state.showRootColors;
          const tspans = formatWordRootSvgTspans(word, showColors);
          const fontSize = word.length > 11 ? Math.max(20, Math.round(330 / word.length)) : 30;
          wordSvg = `
            <svg class="eng-glyph-svg" viewBox="0 0 240 72" preserveAspectRatio="xMinYMid meet">
              <text x="14" y="44" dominant-baseline="alphabetic"
                    class="word-svg-text font-${state.fontFamily}"
                    font-size="${fontSize}" ${opacityAttr}>
                ${tspans}
              </text>
            </svg>
          `;
        } else {
          colClass += ' blank-col';
        }

        const gridSvg = generateFourLineSvg({
          width: 240,
          height: 72,
          gridColorType: state.gridColorType,
          showSlant: state.showSlantLines
        });

        wordColsHTML += `
          <div class="${colClass}">
            ${gridSvg}
            ${wordSvg}
          </div>
        `;
      }

      rowsHTML += `
        <div class="english-row word-row">
          <div class="word-header-meta">
            ${phoneticDisplay}
          </div>
          <div class="word-row-cols">
            ${wordColsHTML}
          </div>
        </div>
      `;
    });

    // 补齐末页剩余空白行
    const remainingRows = rowsPerPage - pageItems.length;
    for (let r = 0; r < remainingRows; r++) {
      let emptyColsHTML = '';
      for (let c = 0; c < 4; c++) {
        const gridSvg = generateFourLineSvg({
          width: 180,
          height: 72,
          gridColorType: state.gridColorType,
          showSlant: state.showSlantLines
        });
        emptyColsHTML += `<div class="word-col blank-col">${gridSvg}</div>`;
      }
      rowsHTML += `
        <div class="english-row word-row empty-row">
          <div class="word-header-meta"><span class="word-phonetic-badge empty-phonetic"></span></div>
          <div class="word-row-cols">${emptyColsHTML}</div>
        </div>
      `;
    }

    pagesHTML += `
      <div class="sheet english-sheet portrait" data-page="${pIdx + 1}">
        ${renderSheetHeader('单词音标与词根')}
        <div class="english-sheet-content">
          ${rowsHTML}
        </div>
        ${renderSheetFooter(pIdx + 1, pageCount)}
      </div>
    `;
  });

  return { html: pagesHTML, pageCount };
}

// ================= 3. 文章句子模式 =================
function renderSentenceMode() {
  let sentences = [];
  if (state.sentenceCat === 'custom') {
    sentences = state.customSentences.trim().split(/\n+/).map(s => s.trim()).filter(Boolean);
  } else {
    sentences = PRESET_SENTENCES[state.sentenceCat]?.sentences || PRESET_SENTENCES.quotes.sentences;
  }

  if (sentences.length === 0) {
    return {
      html: `<div class="empty-hint">请输入要练习的英文句子或文章段落</div>`,
      pageCount: 1
    };
  }

  // 句子模式：每组包含 1 行范例文句 + 1 行四线三格空白临摹行
  // A4 纵向一页排版 5 组（共 10 行四线三格）
  const pairsPerPage = 5;
  const pagesData = [];
  for (let i = 0; i < sentences.length; i += pairsPerPage) {
    pagesData.push(sentences.slice(i, i + pairsPerPage));
  }
  const pageCount = pagesData.length;

  let pagesHTML = '';
  pagesData.forEach((pageItems, pIdx) => {
    let pairsHTML = '';

    pageItems.forEach(sentence => {
      const modelGridSvg = generateFourLineSvg({
        width: 1000,
        height: 72,
        gridColorType: state.gridColorType,
        showSlant: state.showSlantLines,
        slantStep: 22
      });

      const blankPracticeSvg = generateFourLineSvg({
        width: 1000,
        height: 72,
        gridColorType: state.gridColorType,
        showSlant: state.showSlantLines,
        slantStep: 22
      });

      const fontSize = sentence.length > 60 ? Math.max(20, Math.round(1700 / sentence.length)) : 28;
      const sentenceTspans = formatSentenceSvgTspans(sentence, state.showSentenceRootColors);

      pairsHTML += `
        <div class="sentence-pair-block">
          <!-- 1. 范例文句行（按词根彩色标注，严格坐落于四线三格第3线基准线） -->
          <div class="sentence-model-row">
            ${modelGridSvg}
            <svg class="eng-glyph-svg" viewBox="0 0 1000 72" preserveAspectRatio="xMinYMid meet">
              <text x="14" y="44" dominant-baseline="alphabetic"
                    class="sentence-svg-text font-${state.fontFamily}"
                    font-size="${fontSize}" fill="#1e293b">
                ${sentenceTspans}
              </text>
            </svg>
          </div>
          <!-- 2. 四线三格空白临摹行（供学生书写临摹） -->
          <div class="sentence-practice-row">
            ${blankPracticeSvg}
          </div>
        </div>
      `;
    });

    // 补齐末页剩余空白句子对
    const remainingPairs = pairsPerPage - pageItems.length;
    for (let r = 0; r < remainingPairs; r++) {
      const emptySvg1 = generateFourLineSvg({ width: 1000, height: 72, gridColorType: state.gridColorType, showSlant: state.showSlantLines, slantStep: 22 });
      const emptySvg2 = generateFourLineSvg({ width: 1000, height: 72, gridColorType: state.gridColorType, showSlant: state.showSlantLines, slantStep: 22 });
      pairsHTML += `
        <div class="sentence-pair-block empty-pair">
          <div class="sentence-model-row empty-row">${emptySvg1}</div>
          <div class="sentence-practice-row">${emptySvg2}</div>
        </div>
      `;
    }

    pagesHTML += `
      <div class="sheet english-sheet portrait" data-page="${pIdx + 1}">
        ${renderSheetHeader('句子段落临摹')}
        <div class="english-sheet-content sentence-sheet-content">
          ${pairsHTML}
        </div>
        ${renderSheetFooter(pIdx + 1, pageCount)}
      </div>
    `;
  });

  return { html: pagesHTML, pageCount };
}

// ---------------- 用户交互绑定 ----------------

function setupEvents() {
  // 1. 主模式切换
  const modeTabs = document.getElementById('mode-tabs');
  if (modeTabs) {
    modeTabs.addEventListener('click', e => {
      const btn = e.target.closest('[data-mode]');
      if (!btn) return;
      modeTabs.querySelectorAll('[data-mode]').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      state.mode = btn.getAttribute('data-mode');

      // 切换面板展示
      ['letter', 'word', 'sentence'].forEach(m => {
        const panel = document.getElementById(`panel-${m}`);
        if (panel) {
          panel.hidden = m !== state.mode;
        }
      });

      renderPages();
    });
  }

  // 2. 字母模式事件
  const letterCatTabs = document.getElementById('letter-cat-tabs');
  const letterCustomBox = document.getElementById('letter-custom-box');
  const customLettersInput = document.getElementById('custom-letters-input');
  if (letterCatTabs) {
    letterCatTabs.addEventListener('click', e => {
      const btn = e.target.closest('[data-letter-cat]');
      if (!btn) return;
      letterCatTabs.querySelectorAll('[data-letter-cat]').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      state.letterCat = btn.getAttribute('data-letter-cat');
      if (letterCustomBox) {
        letterCustomBox.hidden = state.letterCat !== 'custom';
      }
      renderPages();
    });
  }
  if (customLettersInput) {
    customLettersInput.addEventListener('input', () => {
      state.customLetters = customLettersInput.value;
      renderPages();
    });
  }
  const showLetterStroke = document.getElementById('show-letter-stroke-card');
  if (showLetterStroke) {
    showLetterStroke.addEventListener('change', () => {
      state.showLetterStrokeCard = showLetterStroke.checked;
      renderPages();
    });
  }
  const letterTraceCount = document.getElementById('letter-trace-count');
  const letterTraceOutput = document.getElementById('letter-trace-output');
  if (letterTraceCount) {
    letterTraceCount.addEventListener('input', () => {
      state.letterTraceCount = parseInt(letterTraceCount.value, 10);
      if (letterTraceOutput) letterTraceOutput.textContent = `${state.letterTraceCount} 格`;
      renderPages();
    });
  }

  // 3. 单词模式事件
  const wordCatTabs = document.getElementById('word-cat-tabs');
  const customWordsInput = document.getElementById('custom-words-input');
  const wordCountBadge = document.getElementById('word-count-badge');
  if (wordCatTabs) {
    wordCatTabs.addEventListener('click', e => {
      const btn = e.target.closest('[data-word-cat]');
      if (!btn) return;
      wordCatTabs.querySelectorAll('[data-word-cat]').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      state.wordCat = btn.getAttribute('data-word-cat');

      if (state.wordCat !== 'custom' && customWordsInput) {
        const words = PRESET_WORD_GROUPS[state.wordCat]?.words || [];
        customWordsInput.value = words.join('\n');
        if (wordCountBadge) wordCountBadge.textContent = `${words.length} 词`;
      }
      renderPages();
    });
  }
  if (customWordsInput) {
    customWordsInput.addEventListener('input', () => {
      state.customWords = customWordsInput.value;
      const count = state.customWords.trim().split(/\n+/).filter(Boolean).length;
      if (wordCountBadge) wordCountBadge.textContent = `${count} 词`;
      renderPages();
    });
  }
  document.getElementById('btn-sample-words')?.addEventListener('click', () => {
    const sample = ["predictable", "unhappy", "transportation", "sunshine", "international", "hopelessness", "reconstruction", "beautiful", "friendly"];
    if (customWordsInput) {
      customWordsInput.value = sample.join('\n');
      state.customWords = customWordsInput.value;
      if (wordCountBadge) wordCountBadge.textContent = `${sample.length} 词`;
    }
    renderPages();
  });
  document.getElementById('btn-clear-words')?.addEventListener('click', () => {
    if (customWordsInput) {
      customWordsInput.value = '';
      state.customWords = '';
      if (wordCountBadge) wordCountBadge.textContent = '0 词';
    }
    renderPages();
  });
  const showPhonetics = document.getElementById('show-phonetics');
  if (showPhonetics) {
    showPhonetics.addEventListener('change', () => {
      state.showPhonetics = showPhonetics.checked;
      renderPages();
    });
  }
  const showRootColors = document.getElementById('show-root-colors');
  if (showRootColors) {
    showRootColors.addEventListener('change', () => {
      state.showRootColors = showRootColors.checked;
      renderPages();
    });
  }
  const wordTraceCount = document.getElementById('word-trace-count');
  const wordTraceOutput = document.getElementById('word-trace-output');
  if (wordTraceCount) {
    wordTraceCount.addEventListener('input', () => {
      state.wordTraceCount = parseInt(wordTraceCount.value, 10);
      if (wordTraceOutput) wordTraceOutput.textContent = `${state.wordTraceCount} 遍`;
      renderPages();
    });
  }

  // 4. 句子模式事件
  const sentenceCatTabs = document.getElementById('sentence-cat-tabs');
  const customSentencesInput = document.getElementById('custom-sentences-input');
  const sentenceCountBadge = document.getElementById('sentence-count-badge');
  if (sentenceCatTabs) {
    sentenceCatTabs.addEventListener('click', e => {
      const btn = e.target.closest('[data-sentence-cat]');
      if (!btn) return;
      sentenceCatTabs.querySelectorAll('[data-sentence-cat]').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      state.sentenceCat = btn.getAttribute('data-sentence-cat');

      if (state.sentenceCat !== 'custom' && customSentencesInput) {
        const sentences = PRESET_SENTENCES[state.sentenceCat]?.sentences || [];
        customSentencesInput.value = sentences.join('\n');
        if (sentenceCountBadge) sentenceCountBadge.textContent = `${sentences.length} 句`;
      }
      renderPages();
    });
  }
  if (customSentencesInput) {
    customSentencesInput.addEventListener('input', () => {
      state.customSentences = customSentencesInput.value;
      const count = state.customSentences.trim().split(/\n+/).filter(Boolean).length;
      if (sentenceCountBadge) sentenceCountBadge.textContent = `${count} 句`;
      renderPages();
    });
  }
  document.getElementById('btn-sample-sentences')?.addEventListener('click', () => {
    const sample = [
      "Practice makes perfect.",
      "Where there is a will, there is a way.",
      "Knowledge is power.",
      "Every cloud has a silver lining.",
      "Actions speak louder than words."
    ];
    if (customSentencesInput) {
      customSentencesInput.value = sample.join('\n');
      state.customSentences = customSentencesInput.value;
      if (sentenceCountBadge) sentenceCountBadge.textContent = `${sample.length} 句`;
    }
    renderPages();
  });
  document.getElementById('btn-clear-sentences')?.addEventListener('click', () => {
    if (customSentencesInput) {
      customSentencesInput.value = '';
      state.customSentences = '';
      if (sentenceCountBadge) sentenceCountBadge.textContent = '0 句';
    }
    renderPages();
  });
  const showSentenceRootColors = document.getElementById('show-sentence-root-colors');
  if (showSentenceRootColors) {
    showSentenceRootColors.addEventListener('change', () => {
      state.showSentenceRootColors = showSentenceRootColors.checked;
      renderPages();
    });
  }

  // 5. 四线三格风格与全局参数
  document.querySelectorAll('input[name="gridColorType"]').forEach(radio => {
    radio.addEventListener('change', () => {
      state.gridColorType = radio.value;
      renderPages();
    });
  });
  const showSlantLines = document.getElementById('show-slant-lines');
  if (showSlantLines) {
    showSlantLines.addEventListener('change', () => {
      state.showSlantLines = showSlantLines.checked;
      renderPages();
    });
  }
  document.querySelectorAll('input[name="fontFamily"]').forEach(radio => {
    radio.addEventListener('change', () => {
      state.fontFamily = radio.value;
      renderPages();
    });
  });
  const traceOpacity = document.getElementById('trace-opacity');
  const traceOpacityOutput = document.getElementById('trace-opacity-output');
  if (traceOpacity) {
    traceOpacity.addEventListener('input', () => {
      state.traceOpacity = parseInt(traceOpacity.value, 10);
      if (traceOpacityOutput) traceOpacityOutput.textContent = `${state.traceOpacity}% 描红`;
      renderPages();
    });
  }

  // 6. 纸张与标题
  const sheetTitleInput = document.getElementById('sheet-custom-title');
  if (sheetTitleInput) {
    sheetTitleInput.addEventListener('input', () => {
      state.sheetTitle = sheetTitleInput.value.trim() || '规范英语书法练习字帖';
      renderPages();
    });
  }
  const showInfoBar = document.getElementById('show-info-bar');
  if (showInfoBar) {
    showInfoBar.addEventListener('change', () => {
      state.showInfoBar = showInfoBar.checked;
      renderPages();
    });
  }

  // 7. 打印按钮
  document.querySelectorAll('[data-print]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });

  // 8. 重置按钮
  document.getElementById('reset-button')?.addEventListener('click', () => {
    state.mode = 'letter';
    state.letterCat = 'all';
    state.gridColorType = 'red-blue';
    state.showSlantLines = true;
    state.fontFamily = 'hengshui';
    state.traceOpacity = 25;
    state.sheetTitle = '规范英语书法练习字帖';
    state.showInfoBar = true;
    location.reload();
  });

  // 初始化单词输入框默认内容
  if (customWordsInput) {
    const defaultWords = PRESET_WORD_GROUPS.primary.words;
    customWordsInput.value = defaultWords.join('\n');
    if (wordCountBadge) wordCountBadge.textContent = `${defaultWords.length} 词`;
  }
  if (customSentencesInput) {
    const defaultSentences = PRESET_SENTENCES.quotes.sentences;
    customSentencesInput.value = defaultSentences.join('\n');
    if (sentenceCountBadge) sentenceCountBadge.textContent = `${defaultSentences.length} 句`;
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 支持 URL 参数直达模式 (如 ?mode=word, ?mode=sentence)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('mode')) {
    const m = urlParams.get('mode');
    if (['letter', 'word', 'sentence'].includes(m)) {
      state.mode = m;
      const modeTabs = document.getElementById('mode-tabs');
      if (modeTabs) {
        modeTabs.querySelectorAll('[data-mode]').forEach(b => {
          const isActive = b.getAttribute('data-mode') === m;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
      }
      ['letter', 'word', 'sentence'].forEach(p => {
        const panel = document.getElementById(`panel-${p}`);
        if (panel) panel.hidden = p !== m;
      });
    }
  }

  if (urlParams.has('grid')) {
    const g = urlParams.get('grid');
    if (['red-blue', 'gray'].includes(g)) {
      state.gridColorType = g;
      const radio = document.querySelector(`input[name="gridColorType"][value="${g}"]`);
      if (radio) radio.checked = true;
    }
  }

  if (urlParams.has('cat')) {
    const c = urlParams.get('cat');
    if (state.mode === 'letter' && (LETTER_SETS[c] || c === 'custom')) {
      state.letterCat = c;
      const btn = document.querySelector(`[data-letter-cat="${c}"]`);
      if (btn) {
        document.querySelectorAll('[data-letter-cat]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      }
    } else if (state.mode === 'word' && PRESET_WORD_GROUPS[c]) {
      state.wordCat = c;
      const btn = document.querySelector(`[data-word-cat="${c}"]`);
      if (btn) {
        document.querySelectorAll('[data-word-cat]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      }
      const words = PRESET_WORD_GROUPS[c].words;
      const customWordsInput = document.getElementById('custom-words-input');
      if (customWordsInput) {
        customWordsInput.value = words.join('\n');
        const countBadge = document.getElementById('word-count-badge');
        if (countBadge) countBadge.textContent = `${words.length} 词`;
      }
    } else if (state.mode === 'sentence' && PRESET_SENTENCES[c]) {
      state.sentenceCat = c;
      const btn = document.querySelector(`[data-sentence-cat="${c}"]`);
      if (btn) {
        document.querySelectorAll('[data-sentence-cat]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      }
      const sents = PRESET_SENTENCES[c].sentences;
      const customSentencesInput = document.getElementById('custom-sentences-input');
      if (customSentencesInput) {
        customSentencesInput.value = sents.join('\n');
        const countBadge = document.getElementById('sentence-count-badge');
        if (countBadge) countBadge.textContent = `${sents.length} 句`;
      }
    }
  }

  setupEvents();
  renderPages();
});
