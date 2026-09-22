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
  conciseMode: true, // 简洁模式：默认打开，去掉页头，仅保留页码与练习内容（参考 pinyin.html）
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
    return `<tspan fill="${fill}" font-weight="400">${escapeHTML(p.text)}</tspan>`;
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

// ================ 官方标准 1:1:1 细线条矢量棍棒体（手写印刷体）笔画定义 ================
// 四线坐标：y1 = 12 (顶线), y2 = 28 (中线), y3 = 44 (基准线), y4 = 60 (底线)
// 上格：12~28 (16px), 中格：28~44 (16px), 下格：44~60 (16px) -> 严格 1:1:1 等距官方标准
// 线条粗细统一为 1.8px 纤细手写圆头线条 (stroke-width: 1.8, stroke-linecap: round)
// cx 为字符水平中心点 (单字默认 35, 大小写配对大写 23、小写 48)

// 标准小学英语棍棒体（手写印刷体）单线矢量笔画定义
// 基于四线三格官方规范：y1 = 12 (顶线), y2 = 28 (中线), y3 = 44 (基准线), y4 = 60 (底线)
// cx 为字母中心横坐标 (单字母模式默认 35, 双字母模式大写 23、小写 48)
const ENGLISH_GLYPH_PATHS = {
  // === 26个小写字母 ===
  'a': (cx) => [
    { d: `M ${cx + 5} 32 C ${cx + 3} 28 ${cx - 6} 28 ${cx - 6.5} 36 C ${cx - 7} 44 ${cx + 3} 44 ${cx + 5} 41` },
    { d: `M ${cx + 5} 28 L ${cx + 5} 41 C ${cx + 5} 43.5 ${cx + 6.8} 44 ${cx + 8} 44` }
  ],
  'b': (cx) => [
    { d: `M ${cx - 5.5} 12 L ${cx - 5.5} 44` },
    { d: `M ${cx - 5.5} 32 C ${cx - 3} 28 ${cx + 6.5} 28 ${cx + 6.5} 36 C ${cx + 6.5} 44 ${cx - 3} 44 ${cx - 5.5} 41` }
  ],
  'c': (cx) => [
    { d: `M ${cx + 5.5} 32 C ${cx + 3.5} 28 ${cx - 6} 28 ${cx - 6.5} 36 C ${cx - 7} 44 ${cx + 3.5} 44 ${cx + 5.5} 40` }
  ],
  'd': (cx) => [
    { d: `M ${cx + 5.5} 32 C ${cx + 3} 28 ${cx - 6} 28 ${cx - 6.5} 36 C ${cx - 7} 44 ${cx + 3} 44 ${cx + 5.5} 41` },
    { d: `M ${cx + 5.5} 12 L ${cx + 5.5} 44` }
  ],
  'e': (cx) => [
    { d: `M ${cx - 6} 36 L ${cx + 5.8} 36 C ${cx + 5.8} 29 ${cx - 4} 28 ${cx - 6.5} 36 C ${cx - 7} 44 ${cx + 3.5} 44 ${cx + 5.8} 40.5` }
  ],
  'f': (cx) => [
    { d: `M ${cx + 5} 14.5 C ${cx + 3.5} 12 ${cx - 2.5} 12 ${cx - 2.5} 17 L ${cx - 2.5} 44` },
    { d: `M ${cx - 6.5} 28 L ${cx + 3.5} 28` }
  ],
  'g': (cx) => [
    { d: `M ${cx + 5} 32 C ${cx + 3} 28 ${cx - 6} 28 ${cx - 6.5} 36 C ${cx - 7} 44 ${cx + 3} 44 ${cx + 5} 41` },
    { d: `M ${cx + 5} 28 L ${cx + 5} 53 C ${cx + 5} 59 ${cx - 1.5} 60 ${cx - 5.5} 57` }
  ],
  'h': (cx) => [
    { d: `M ${cx - 5.5} 12 L ${cx - 5.5} 44` },
    { d: `M ${cx - 5.5} 34 C ${cx - 3} 28 ${cx + 5.5} 28 ${cx + 5.5} 35 L ${cx + 5.5} 44` }
  ],
  'i': (cx) => [
    { d: `M ${cx} 28 L ${cx} 44` },
    { d: `M ${cx - 0.2} 19.5 A 1.4 1.4 0 1 1 ${cx + 0.2} 19.5 Z`, isDot: true }
  ],
  'j': (cx) => [
    { d: `M ${cx + 1.5} 28 L ${cx + 1.5} 53 C ${cx + 1.5} 59 ${cx - 2.5} 60 ${cx - 6} 57` },
    { d: `M ${cx + 1.3} 19.5 A 1.4 1.4 0 1 1 ${cx + 1.7} 19.5 Z`, isDot: true }
  ],
  'k': (cx) => [
    { d: `M ${cx - 5} 12 L ${cx - 5} 44` },
    { d: `M ${cx + 5} 28 L ${cx - 4.5} 37 L ${cx + 5.5} 44` }
  ],
  'l': (cx) => [
    { d: `M ${cx} 12 L ${cx} 44` }
  ],
  'm': (cx) => [
    { d: `M ${cx - 8.5} 28 L ${cx - 8.5} 44` },
    { d: `M ${cx - 8.5} 33 C ${cx - 7} 28 ${cx} 28 ${cx} 34 L ${cx} 44` },
    { d: `M ${cx} 33 C ${cx + 1.5} 28 ${cx + 8.5} 28 ${cx + 8.5} 34 L ${cx + 8.5} 44` }
  ],
  'n': (cx) => [
    { d: `M ${cx - 6} 28 L ${cx - 6} 44` },
    { d: `M ${cx - 6} 33 C ${cx - 3.5} 28 ${cx + 6} 28 ${cx + 6} 34 L ${cx + 6} 44` }
  ],
  'o': (cx) => [
    { d: `M ${cx} 28 C ${cx - 6.8} 28 ${cx - 6.8} 44 ${cx} 44 C ${cx + 6.8} 44 ${cx + 6.8} 28 ${cx} 28 Z` }
  ],
  'p': (cx) => [
    { d: `M ${cx - 5.5} 28 L ${cx - 5.5} 60` },
    { d: `M ${cx - 5.5} 32 C ${cx - 3} 28 ${cx + 6.5} 28 ${cx + 6.5} 36 C ${cx + 6.5} 44 ${cx - 3} 44 ${cx - 5.5} 41` }
  ],
  'q': (cx) => [
    { d: `M ${cx + 5.5} 32 C ${cx + 3} 28 ${cx - 6} 28 ${cx - 6.5} 36 C ${cx - 7} 44 ${cx + 3} 44 ${cx + 5.5} 41` },
    { d: `M ${cx + 5.5} 28 L ${cx + 5.5} 60` }
  ],
  'r': (cx) => [
    { d: `M ${cx - 4.5} 28 L ${cx - 4.5} 44` },
    { d: `M ${cx - 4.5} 33 C ${cx - 2} 28 ${cx + 4.5} 28 ${cx + 5} 30` }
  ],
  's': (cx) => [
    { d: `M ${cx + 5} 31.5 C ${cx + 3.5} 28 ${cx - 5.5} 28.5 ${cx - 5.5} 32.5 C ${cx - 5.5} 36.5 ${cx + 5.5} 35.5 ${cx + 5.5} 39.5 C ${cx + 5.5} 44 ${cx - 4} 44 ${cx - 5} 41` }
  ],
  't': (cx) => [
    { d: `M ${cx - 1} 19 L ${cx - 1} 41 C ${cx - 1} 43.5 ${cx + 1.5} 44 ${cx + 4} 44` },
    { d: `M ${cx - 5.5} 28 L ${cx + 4.5} 28` }
  ],
  'u': (cx) => [
    { d: `M ${cx - 5.5} 28 L ${cx - 5.5} 40 C ${cx - 5.5} 44 ${cx + 2.5} 44 ${cx + 5} 41 L ${cx + 5} 28` },
    { d: `M ${cx + 5} 28 L ${cx + 5} 41 C ${cx + 5} 43.5 ${cx + 6.8} 44 ${cx + 8} 44` }
  ],
  'v': (cx) => [
    { d: `M ${cx - 6} 28 L ${cx} 44 L ${cx + 6} 28` }
  ],
  'w': (cx) => [
    { d: `M ${cx - 8.5} 28 L ${cx - 4.5} 44 L ${cx} 32 L ${cx + 4.5} 44 L ${cx + 8.5} 28` }
  ],
  'x': (cx) => [
    { d: `M ${cx - 5.5} 28 L ${cx + 5.5} 44` },
    { d: `M ${cx + 5.5} 28 L ${cx - 5.5} 44` }
  ],
  'y': (cx) => [
    { d: `M ${cx - 5.5} 28 L ${cx} 39` },
    { d: `M ${cx + 5.5} 28 L ${cx - 6} 60` }
  ],
  'z': (cx) => [
    { d: `M ${cx - 5.5} 28 L ${cx + 5.5} 28 L ${cx - 5.5} 44 L ${cx + 5.5} 44` }
  ],

  // === 26个大写字母 (全部顶天立地占上中两格 12~44) ===
  'A': (cx) => [
    { d: `M ${cx - 7.5} 44 L ${cx} 12 L ${cx + 7.5} 44` },
    { d: `M ${cx - 4.5} 33 L ${cx + 4.5} 33` }
  ],
  'B': (cx) => [
    { d: `M ${cx - 6} 12 L ${cx - 6} 44` },
    { d: `M ${cx - 6} 12 L ${cx + 2.5} 12 C ${cx + 7} 12 ${cx + 7} 28 ${cx - 6} 28` },
    { d: `M ${cx - 6} 28 L ${cx + 3.5} 28 C ${cx + 8} 28 ${cx + 8} 44 ${cx - 6} 44` }
  ],
  'C': (cx) => [
    { d: `M ${cx + 7} 18.5 C ${cx + 4} 12 ${cx - 6.5} 12 ${cx - 7} 28 C ${cx - 7.5} 44 ${cx + 4} 44 ${cx + 7} 37.5` }
  ],
  'D': (cx) => [
    { d: `M ${cx - 6} 12 L ${cx - 6} 44` },
    { d: `M ${cx - 6} 12 L ${cx + 1} 12 C ${cx + 8.5} 12 ${cx + 8.5} 44 ${cx + 1} 44 L ${cx - 6} 44` }
  ],
  'E': (cx) => [
    { d: `M ${cx - 6} 12 L ${cx - 6} 44` },
    { d: `M ${cx - 6} 12 L ${cx + 6} 12` },
    { d: `M ${cx - 6} 28 L ${cx + 4} 28` },
    { d: `M ${cx - 6} 44 L ${cx + 6} 44` }
  ],
  'F': (cx) => [
    { d: `M ${cx - 6} 12 L ${cx - 6} 44` },
    { d: `M ${cx - 6} 12 L ${cx + 6} 12` },
    { d: `M ${cx - 6} 28 L ${cx + 4} 28` }
  ],
  'G': (cx) => [
    { d: `M ${cx + 7} 18.5 C ${cx + 4} 12 ${cx - 6.5} 12 ${cx - 7} 28 C ${cx - 7.5} 44 ${cx + 4} 44 ${cx + 7} 36 L ${cx + 7} 30 L ${cx + 1} 30` }
  ],
  'H': (cx) => [
    { d: `M ${cx - 6.5} 12 L ${cx - 6.5} 44` },
    { d: `M ${cx + 6.5} 12 L ${cx + 6.5} 44` },
    { d: `M ${cx - 6.5} 28 L ${cx + 6.5} 28` }
  ],
  'I': (cx) => [
    { d: `M ${cx} 12 L ${cx} 44` },
    { d: `M ${cx - 5} 12 L ${cx + 5} 12` },
    { d: `M ${cx - 5} 44 L ${cx + 5} 44` }
  ],
  'J': (cx) => [
    { d: `M ${cx - 4} 12 L ${cx + 4} 12` },
    { d: `M ${cx + 2.5} 12 L ${cx + 2.5} 39 C ${cx + 2.5} 43.5 ${cx - 1} 44 ${cx - 4.5} 41` }
  ],
  'K': (cx) => [
    { d: `M ${cx - 6} 12 L ${cx - 6} 44` },
    { d: `M ${cx + 6} 12 L ${cx - 5.5} 28 L ${cx + 6.5} 44` }
  ],
  'L': (cx) => [
    { d: `M ${cx - 5.5} 12 L ${cx - 5.5} 44` },
    { d: `M ${cx - 5.5} 44 L ${cx + 5.5} 44` }
  ],
  'M': (cx) => [
    { d: `M ${cx - 8} 44 L ${cx - 8} 12 L ${cx} 38 L ${cx + 8} 12 L ${cx + 8} 44` }
  ],
  'N': (cx) => [
    { d: `M ${cx - 7} 44 L ${cx - 7} 12 L ${cx + 7} 44 L ${cx + 7} 12` }
  ],
  'O': (cx) => [
    { d: `M ${cx} 12 C ${cx - 8} 12 ${cx - 8} 44 ${cx} 44 C ${cx + 8} 44 ${cx + 8} 12 ${cx} 12 Z` }
  ],
  'P': (cx) => [
    { d: `M ${cx - 6} 12 L ${cx - 6} 44` },
    { d: `M ${cx - 6} 12 L ${cx + 2} 12 C ${cx + 7.5} 12 ${cx + 7.5} 28 ${cx - 6} 28` }
  ],
  'Q': (cx) => [
    { d: `M ${cx} 12 C ${cx - 8} 12 ${cx - 8} 44 ${cx} 44 C ${cx + 8} 44 ${cx + 8} 12 ${cx} 12 Z` },
    { d: `M ${cx + 1.5} 37 L ${cx + 8} 46` }
  ],
  'R': (cx) => [
    { d: `M ${cx - 6} 12 L ${cx - 6} 44` },
    { d: `M ${cx - 6} 12 L ${cx + 2} 12 C ${cx + 7.5} 12 ${cx + 7.5} 28 ${cx - 6} 28` },
    { d: `M ${cx} 28 L ${cx + 6.5} 44` }
  ],
  'S': (cx) => [
    { d: `M ${cx + 6} 18.5 C ${cx + 4} 12 ${cx - 6.5} 12.5 ${cx - 6.5} 20 C ${cx - 6.5} 27 ${cx + 6.8} 26 ${cx + 6.8} 35 C ${cx + 6.8} 44 ${cx - 4.5} 44 ${cx - 6} 38` }
  ],
  'T': (cx) => [
    { d: `M ${cx - 7.5} 12 L ${cx + 7.5} 12` },
    { d: `M ${cx} 12 L ${cx} 44` }
  ],
  'U': (cx) => [
    { d: `M ${cx - 7} 12 L ${cx - 7} 35 C ${cx - 7} 44 ${cx + 7} 44 ${cx + 7} 35 L ${cx + 7} 12` }
  ],
  'V': (cx) => [
    { d: `M ${cx - 7.5} 12 L ${cx} 44 L ${cx + 7.5} 12` }
  ],
  'W': (cx) => [
    { d: `M ${cx - 10} 12 L ${cx - 5} 44 L ${cx} 24 L ${cx + 5} 44 L ${cx + 10} 12` }
  ],
  'X': (cx) => [
    { d: `M ${cx - 7} 12 L ${cx + 7} 44` },
    { d: `M ${cx + 7} 12 L ${cx - 7} 44` }
  ],
  'Y': (cx) => [
    { d: `M ${cx - 7.5} 12 L ${cx} 28 L ${cx + 7.5} 12` },
    { d: `M ${cx} 28 L ${cx} 44` }
  ],
  'Z': (cx) => [
    { d: `M ${cx - 7} 12 L ${cx + 7} 12 L ${cx - 7} 44 L ${cx + 7} 44` }
  ]
};


const CHAR_NATURAL_WIDTHS = {
  'i': 6, 'l': 6, 'j': 8, 'f': 9, 't': 9, 'r': 9,
  'm': 16, 'w': 16,
  'I': 9, 'J': 10, 'M': 18, 'W': 18
};

function getCharWidth(c) {
  if (CHAR_NATURAL_WIDTHS[c]) return CHAR_NATURAL_WIDTHS[c];
  if (c >= 'A' && c <= 'Z') return 14;
  return 11;
}

// 渲染单个字母或大小写配对的矢量字形（严格遵循 1:1:1 四线三格规范）
function generateLetterGlyphSvg({ letter, isModel, traceOpacity, fontFamily }) {
  const clean = letter.trim();
  const isItalic = fontFamily === 'italic';

  // 默认规范棍棒体：使用精确细线条矢量绘制，彻底解决字体位置不准与太粗压抑问题
  if (!isItalic) {
    const strokeColor = '#1e293b';
    const strokeWidth = '1.8';
    const opacityAttr = !isModel ? `opacity="${traceOpacity / 100}"` : '';
    let pathsHTML = '';

    if (clean.length === 2) {
      const c1 = clean[0];
      const c2 = clean[1];
      const p1 = ENGLISH_GLYPH_PATHS[c1] ? ENGLISH_GLYPH_PATHS[c1](23) : null;
      const p2 = ENGLISH_GLYPH_PATHS[c2] ? ENGLISH_GLYPH_PATHS[c2](48) : null;
      if (p1 && p2) {
        [...p1, ...p2].forEach(s => {
          if (s.isDot) {
            pathsHTML += `<path d="${s.d}" fill="${strokeColor}" ${opacityAttr} stroke="${strokeColor}" stroke-width="0.6" />`;
          } else {
            pathsHTML += `<path d="${s.d}" fill="none" ${opacityAttr} stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />`;
          }
        });
        return `
          <svg class="eng-glyph-svg" viewBox="0 0 70 72" preserveAspectRatio="none">
            ${pathsHTML}
          </svg>
        `;
      }
    } else if (clean.length === 1) {
      const p = ENGLISH_GLYPH_PATHS[clean] ? ENGLISH_GLYPH_PATHS[clean](35) : null;
      if (p) {
        p.forEach(s => {
          if (s.isDot) {
            pathsHTML += `<path d="${s.d}" fill="${strokeColor}" ${opacityAttr} stroke="${strokeColor}" stroke-width="0.6" />`;
          } else {
            pathsHTML += `<path d="${s.d}" fill="none" ${opacityAttr} stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />`;
          }
        });
        return `
          <svg class="eng-glyph-svg" viewBox="0 0 70 72" preserveAspectRatio="none">
            ${pathsHTML}
          </svg>
        `;
      }
    }
  }

  // 意大利斜体或非标准字符降级为字体文本渲染
  const opacityAttr = !isModel ? `opacity="${traceOpacity / 100}"` : '';
  const fontWeight = '350';
  if (clean.length === 2) {
    const c1 = clean[0];
    const c2 = clean[1];
    return `
      <svg class="eng-glyph-svg" viewBox="0 0 70 72" preserveAspectRatio="none">
        <text x="23" y="44" text-anchor="middle" dominant-baseline="alphabetic"
              class="letter-svg-text font-${fontFamily}"
              font-size="40" font-weight="${fontWeight}"
              fill="#1e293b" ${opacityAttr}>${escapeHTML(c1)}</text>
        <text x="48" y="44" text-anchor="middle" dominant-baseline="alphabetic"
              class="letter-svg-text font-${fontFamily}"
              font-size="28" font-weight="${fontWeight}"
              fill="#1e293b" ${opacityAttr}>${escapeHTML(c2)}</text>
      </svg>
    `;
  }

  const sz = (clean >= 'A' && clean <= 'Z') ? 42 : 30;
  return `
    <svg class="eng-glyph-svg" viewBox="0 0 70 72" preserveAspectRatio="none">
      <text x="35" y="44" text-anchor="middle" dominant-baseline="alphabetic"
            class="letter-svg-text font-${fontFamily}"
            font-size="${sz}" font-weight="${fontWeight}"
            fill="#1e293b" ${opacityAttr}>${escapeHTML(clean)}</text>
    </svg>
  `;
}

// 渲染单词的矢量棍棒体字形（支持前缀、词根、后缀彩色标注）
function generateWordGlyphSvg({ word, isModel, traceOpacity, fontFamily, showColors }) {
  const isItalic = fontFamily === 'italic';

  // 默认棍棒体模式：矢量绘制每个字母，保证笔画纤细均匀且四线对齐极佳
  if (!isItalic && /^[a-zA-Z\s\-\.\']+$/.test(word)) {
    const parts = decomposeWord(word);
    let totalNaturalW = 0;
    for (const ch of word) {
      totalNaturalW += getCharWidth(ch);
    }

    const maxW = 210;
    let scale = 1.0;
    if (totalNaturalW > maxW) {
      scale = maxW / totalNaturalW;
    }

    const startX = 14;
    let currentX = startX;
    let pathsHTML = '';
    const strokeWidth = (1.8 * Math.min(1.0, scale)).toFixed(2);
    const opacityAttr = !isModel ? `opacity="${traceOpacity / 100}"` : '';

    parts.forEach(part => {
      let partColor = '#1e293b';
      if (showColors && isModel) {
        if (part.type === 'prefix') partColor = '#7c3aed';
        else if (part.type === 'root') partColor = '#1d4ed8';
        else if (part.type === 'suffix') partColor = '#059669';
        else if (part.type === 'compound') partColor = '#d97706';
      }

      for (const ch of part.text) {
        const cw = getCharWidth(ch) * scale;
        const cx = currentX + cw / 2;
        currentX += cw;

        if (ENGLISH_GLYPH_PATHS[ch]) {
          const strokes = ENGLISH_GLYPH_PATHS[ch](cx);
          strokes.forEach(s => {
            if (s.isDot) {
              pathsHTML += `<path d="${s.d}" fill="${partColor}" ${opacityAttr} stroke="${partColor}" stroke-width="0.6" />`;
            } else {
              pathsHTML += `<path d="${s.d}" fill="none" ${opacityAttr} stroke="${partColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />`;
            }
          });
        }
      }
    });

    return `
      <svg class="eng-glyph-svg" viewBox="0 0 240 72" preserveAspectRatio="none">
        ${pathsHTML}
      </svg>
    `;
  }

  // 降级为文本渲染 (例如斜体)
  const opacityAttr = !isModel ? `opacity="${traceOpacity / 100}"` : '';
  const tspans = formatWordRootSvgTspans(word, showColors);
  const fontSize = word.length > 11 ? Math.max(20, Math.round(330 / word.length)) : 29;
  return `
    <svg class="eng-glyph-svg" viewBox="0 0 240 72" preserveAspectRatio="none">
      <text x="14" y="44" dominant-baseline="alphabetic"
            class="word-svg-text font-${fontFamily}"
            font-size="${fontSize}" ${opacityAttr}>
        ${tspans}
      </text>
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
  if (state.conciseMode) {
    return '';
  }

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
  if (state.conciseMode) {
    return `
      <footer class="english-sheet-footer concise">
        <span>第 ${currentPage} 页 / 共 ${totalPages} 页</span>
      </footer>
    `;
  }
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

  // A4 纵向排版：每页容纳 13 行（26 字母整 2 页，52 字母整 4 页，行距紧凑规范）
  const rowsPerPage = 13;
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

  // 单词模式每页容纳 11 行（调整行距，更匀称饱满）
  const rowsPerPage = 11;
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
          const showColors = isModel && state.showRootColors;
          wordSvg = generateWordGlyphSvg({
            word,
            isModel,
            traceOpacity: state.traceOpacity,
            fontFamily: state.fontFamily,
            showColors
          });
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
  // A4 纵向一页排版 6 组（共 12 行四线三格）
  const pairsPerPage = 6;
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
            <svg class="eng-glyph-svg" viewBox="0 0 1000 72" preserveAspectRatio="none">
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

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
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

  // 6. 简洁模式切换
  const conciseModeEl = document.getElementById('concise-mode');
  if (conciseModeEl) {
    conciseModeEl.checked = state.conciseMode;
    conciseModeEl.addEventListener('change', e => {
      state.conciseMode = e.target.checked;
      showToast(state.conciseMode ? '已开启简洁模式' : '已关闭简洁模式');
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
    state.conciseMode = true;
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
