/**
 * 墨格 - 拼音字帖生成器核心逻辑 (pinyin.js)
 * 遵循教育部统编版拼音规范、四线三格国家标准与手写体标准 (ɑ, ɡ)
 */

// 1. 官方拼音分类预设数据
export const PINYIN_CATEGORIES = {
  shm: {
    id: 'shm',
    name: '声母表',
    count: 23,
    desc: '23个声母（b p m f d t n l ɡ k h j q x zh ch sh r z c s y w）',
    items: ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'ɡ', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w']
  },
  dym: {
    id: 'dym',
    name: '单韵母',
    count: 6,
    desc: '6个单韵母（ɑ o e i u ü）',
    items: ['ɑ', 'o', 'e', 'i', 'u', 'ü']
  },
  fym: {
    id: 'fym',
    name: '复韵母',
    count: 9,
    desc: '9个复韵母（ɑi ei ui ɑo ou iu ie üe er）',
    items: ['ɑi', 'ei', 'ui', 'ɑo', 'ou', 'iu', 'ie', 'üe', 'er']
  },
  qbm: {
    id: 'qbm',
    name: '前鼻韵母',
    count: 5,
    desc: '5个前鼻韵母（ɑn en in un ün）',
    items: ['ɑn', 'en', 'in', 'un', 'ün']
  },
  hbm: {
    id: 'hbm',
    name: '后鼻韵母',
    count: 4,
    desc: '4个后鼻韵母（ɑnɡ enɡ inɡ onɡ）',
    items: ['ɑnɡ', 'enɡ', 'inɡ', 'onɡ']
  },
  ztr: {
    id: 'ztr',
    name: '整体认读音节',
    count: 16,
    desc: '16个整体认读音节（zhi chi shi ri zi ci si yi wu yu ye yue yuɑn yin yun yinɡ）',
    items: ['zhi', 'chi', 'shi', 'ri', 'zi', 'ci', 'si', 'yi', 'wu', 'yu', 'ye', 'yue', 'yuɑn', 'yin', 'yun', 'yinɡ']
  },
  all: {
    id: 'all',
    name: '全部拼音总表',
    count: 63,
    desc: '声母、韵母、整体认读音节全套总表（共63个）',
    items: [] // 动态合并
  },
  custom: {
    id: 'custom',
    name: '自定义拼音',
    count: 0,
    desc: '自由输入拼音字母、词语或带调音节练习',
    items: []
  }
};

// 填充全部总表
PINYIN_CATEGORIES.all.items = [
  ...PINYIN_CATEGORIES.shm.items,
  ...PINYIN_CATEGORIES.dym.items,
  ...PINYIN_CATEGORIES.fym.items,
  ...PINYIN_CATEGORIES.qbm.items,
  ...PINYIN_CATEGORIES.hbm.items,
  ...PINYIN_CATEGORIES.ztr.items
];

// 声调映射与拆解 (将带调字符拆解为基字符 + 声调号 1..4)
const TONE_CHAR_MAP = {
  'ā': { base: 'ɑ', tone: 1 }, 'á': { base: 'ɑ', tone: 2 }, 'ǎ': { base: 'ɑ', tone: 3 }, 'à': { base: 'ɑ', tone: 4 },
  'ō': { base: 'o', tone: 1 }, 'ó': { base: 'o', tone: 2 }, 'ǒ': { base: 'o', tone: 3 }, 'ò': { base: 'o', tone: 4 },
  'ē': { base: 'e', tone: 1 }, 'é': { base: 'e', tone: 2 }, 'ě': { base: 'e', tone: 3 }, 'è': { base: 'e', tone: 4 },
  'ī': { base: 'i', tone: 1 }, 'í': { base: 'i', tone: 2 }, 'ǐ': { base: 'i', tone: 3 }, 'ì': { base: 'i', tone: 4 },
  'ū': { base: 'u', tone: 1 }, 'ú': { base: 'u', tone: 2 }, 'ǔ': { base: 'u', tone: 3 }, 'ù': { base: 'u', tone: 4 },
  'ǖ': { base: 'ü', tone: 1 }, 'ǘ': { base: 'ü', tone: 2 }, 'ǚ': { base: 'ü', tone: 3 }, 'ǜ': { base: 'ü', tone: 4 }
};

// 规范化拼音字母（例如将标准 a 映射为手写体单层 ɑ，将 g 映射为单层 ɡ，v 映射为 ü）
export function normalizePinyin(text) {
  if (!text) return '';
  return text
    .replace(/a/g, 'ɑ')
    .replace(/g/g, 'ɡ')
    .replace(/v/g, 'ü')
    .trim();
}

/**
 * 26个单字母矢量笔画定义（严格遵循统编版四线三格标准）
 * 坐标系：基于 80x80 方格，四线分别为：
 * y1 = 16 (第一线·顶线)
 * y2 = 32 (第二线·上中界线)
 * y3 = 48 (第三线·中下界线 / 基准线)
 * y4 = 64 (第四线·底线)
 * 三格比例：16px : 16px : 16px (严格 1:1:1 官方标准)
 * 字符居中在 x = 0 的局部坐标系中
 */
export const LETTER_GLYPHS = {
  'ɑ': {
    width: 20,
    strokes: [
      { d: "M 4.5 36 C 2 32.5 -7 32.5 -9 36.5 C -11.5 41 -11.5 47 -9 51.5 C -6.5 55.5 2 55.5 4.5 52", badge: { x: -3, y: 28, text: '①' } },
      { d: "M 4.5 33 L 4.5 52 C 4.5 54.5 6.5 55.5 9 55.5", badge: { x: 10, y: 33, text: '②' } }
    ]
  },
  'b': {
    width: 20,
    strokes: [
      { d: "M -7.5 19 L -7.5 55", badge: { x: -14, y: 19, text: '①' } },
      { d: "M -7.5 35 C -5.5 32.5 4.5 32.5 7.5 36.5 C 11 41 11 47 7.5 51.5 C 4.5 55.5 -5.5 55.5 -7.5 53", badge: { x: 5, y: 28, text: '②' } }
    ]
  },
  'c': {
    width: 19,
    strokes: [
      { d: "M 6.5 36 C 3.5 32.5 -5.5 32.5 -8.5 36.5 C -11.5 41 -11.5 47 -8.5 51.5 C -5.5 55.5 3.5 55.5 6.5 52", badge: { x: 1, y: 28, text: '①' } }
    ]
  },
  'd': {
    width: 20,
    strokes: [
      { d: "M 7.5 36 C 5.5 32.5 -4.5 32.5 -7.5 36.5 C -11 41 -11 47 -7.5 51.5 C -4.5 55.5 5.5 55.5 7.5 52", badge: { x: -1, y: 28, text: '①' } },
      { d: "M 7.5 19 L 7.5 55", badge: { x: 14, y: 19, text: '②' } }
    ]
  },
  'e': {
    width: 19,
    strokes: [
      { d: "M -8 44 L 7.5 44 C 7.5 35 -4 32.5 -7.5 36.5 C -11 41 -11 47 -7.5 51.5 C -4.5 55.5 5 55.5 7.5 52", badge: { x: -14, y: 44, text: '①' } }
    ]
  },
  'f': {
    width: 16,
    strokes: [
      { d: "M 5 20 C 2 18 -3 18 -3 24 L -3 55", badge: { x: 9, y: 19, text: '①' } },
      { d: "M -8 33 L 4 33", badge: { x: -13, y: 33, text: '②' } }
    ]
  },
  'ɡ': {
    width: 20,
    strokes: [
      { d: "M 6.5 36 C 4.5 32.5 -4.5 32.5 -7.5 36.5 C -11 41 -11 47 -7.5 51.5 C -4.5 55.5 4.5 55.5 6.5 52", badge: { x: -1, y: 28, text: '①' } },
      { d: "M 6.5 33 L 6.5 62 C 6.5 67 -2 67.5 -6 64", badge: { x: 13, y: 33, text: '②' } }
    ]
  },
  'h': {
    width: 20,
    strokes: [
      { d: "M -7.5 19 L -7.5 55", badge: { x: -14, y: 19, text: '①' } },
      { d: "M -7.5 38 C -5 33 4 32.5 6.5 36.5 L 6.5 55", badge: { x: 3, y: 28, text: '②' } }
    ]
  },
  'i': {
    width: 12,
    strokes: [
      { d: "M 0 34 L 0 55", badge: { x: -6, y: 35, text: '①' } },
      { d: "M -0.1 23.5 A 2 2 0 1 1 0.1 23.5 Z", isDot: true, badge: { x: 6, y: 24, text: '②' } }
    ]
  },
  'j': {
    width: 14,
    strokes: [
      { d: "M 2.5 34 L 2.5 62 C 2.5 67 -3.5 67.5 -6.5 64", badge: { x: -4, y: 35, text: '①' } },
      { d: "M 2.4 23.5 A 2 2 0 1 1 2.6 23.5 Z", isDot: true, badge: { x: 9, y: 24, text: '②' } }
    ]
  },
  'k': {
    width: 20,
    strokes: [
      { d: "M -6.5 19 L -6.5 55", badge: { x: -13, y: 19, text: '①' } },
      { d: "M 6.5 35 L -4.5 45 L 7.5 55", badge: { x: 13, y: 35, text: '②' } }
    ]
  },
  'l': {
    width: 10,
    strokes: [
      { d: "M 0 19 L 0 55", badge: { x: -6, y: 19, text: '①' } }
    ]
  },
  'm': {
    width: 28,
    strokes: [
      { d: "M -11 34 L -11 55", badge: { x: -17, y: 34, text: '①' } },
      { d: "M -11 38 C -9 33 -2 32.5 0 36.5 L 0 55", badge: { x: -3, y: 28, text: '②' } },
      { d: "M 0 38 C 2.5 33 9 32.5 11 36.5 L 11 55", badge: { x: 9, y: 28, text: '③' } }
    ]
  },
  'n': {
    width: 20,
    strokes: [
      { d: "M -7.5 34 L -7.5 55", badge: { x: -14, y: 34, text: '①' } },
      { d: "M -7.5 38 C -5 33 4 32.5 6.5 36.5 L 6.5 55", badge: { x: 3, y: 28, text: '②' } }
    ]
  },
  'o': {
    width: 20,
    strokes: [
      { d: "M 0 33 C -6.5 33 -10.5 37.5 -10.5 44 C -10.5 50.5 -6.5 55.5 0 55.5 C 6.5 55.5 10.5 50.5 10.5 44 C 10.5 37.5 5.5 33 1.2 33.2", badge: { x: -4, y: 28, text: '①' } }
    ]
  },
  'p': {
    width: 20,
    strokes: [
      { d: "M -7.5 33 L -7.5 65", badge: { x: -14, y: 34, text: '①' } },
      { d: "M -7.5 35 C -5.5 32.5 4.5 32.5 7.5 36.5 C 11 41 11 47 7.5 51.5 C 4.5 55.5 -5.5 55.5 -7.5 53", badge: { x: 5, y: 28, text: '②' } }
    ]
  },
  'q': {
    width: 20,
    strokes: [
      { d: "M 7.5 36 C 5.5 32.5 -4.5 32.5 -7.5 36.5 C -11 41 -11 47 -7.5 51.5 C -4.5 55.5 5.5 55.5 7.5 52", badge: { x: -1, y: 28, text: '①' } },
      { d: "M 7.5 33 L 7.5 65", badge: { x: 14, y: 34, text: '②' } }
    ]
  },
  'r': {
    width: 17,
    strokes: [
      { d: "M -5.5 34 L -5.5 55", badge: { x: -11, y: 34, text: '①' } },
      { d: "M -5.5 39 C -2 33.5 4 33 7 35", badge: { x: 4, y: 28, text: '②' } }
    ]
  },
  's': {
    width: 18,
    strokes: [
      { d: "M 6 37 C 4 33 -3 33 -5 36.5 C -6.5 39.5 -4 42.5 0 44 C 5.5 46 7.5 48.5 6 52 C 4 55.5 -4.5 55.5 -6.5 52", badge: { x: 7, y: 30, text: '①' } }
    ]
  },
  't': {
    width: 16,
    strokes: [
      { d: "M -1 20 L -1 51.5 C -1 54.5 2 55.5 5.5 55.5", badge: { x: -7, y: 20, text: '①' } },
      { d: "M -6.5 33 L 5.5 33", badge: { x: -12, y: 33, text: '②' } }
    ]
  },
  'u': {
    width: 19,
    strokes: [
      { d: "M -6.5 34 L -6.5 51.5 C -6.5 55.5 3 55.5 5.5 51.5 L 5.5 34", badge: { x: -13, y: 34, text: '①' } },
      { d: "M 5.5 34 L 5.5 55", badge: { x: 11, y: 34, text: '②' } }
    ]
  },
  'ü': {
    width: 19,
    strokes: [
      { d: "M -6.5 34 L -6.5 51.5 C -6.5 55.5 3 55.5 5.5 51.5 L 5.5 34", badge: { x: -13, y: 34, text: '①' } },
      { d: "M 5.5 34 L 5.5 55", badge: { x: 11, y: 34, text: '②' } },
      { d: "M -4.6 23.5 A 1.8 1.8 0 1 1 -4.4 23.5 Z", isDot: true, badge: { x: -5, y: 18, text: '③' } },
      { d: "M 4.4 23.5 A 1.8 1.8 0 1 1 4.6 23.5 Z", isDot: true, badge: { x: 5, y: 18, text: '④' } }
    ]
  },
  'w': {
    width: 25,
    strokes: [
      { d: "M -10 34 L -5 55 L 0 36", badge: { x: -15, y: 34, text: '①' } },
      { d: "M 0 36 L 5 55 L 10 34", badge: { x: 3, y: 29, text: '②' } }
    ]
  },
  'x': {
    width: 19,
    strokes: [
      { d: "M -7 34 L 7 55", badge: { x: -13, y: 34, text: '①' } },
      { d: "M 7 34 L -7 55", badge: { x: 13, y: 34, text: '②' } }
    ]
  },
  'y': {
    width: 19,
    strokes: [
      { d: "M -7 34 L 0 47", badge: { x: -13, y: 34, text: '①' } },
      { d: "M 7 34 L -7 65", badge: { x: 13, y: 34, text: '②' } }
    ]
  },
  'z': {
    width: 18,
    strokes: [
      { d: "M -7.5 34.5 L 7.5 34.5 L -7.5 54.5 L 7.5 54.5", badge: { x: -13, y: 34.5, text: '①' } }
    ]
  }
};

/**
 * 获取对应拼音的官方笔顺矢量素材文件名称（全套 63 个拼音均已补齐矢量笔顺素材）
 * 存储于 /pinyin_bi_shun/${name}.svg
 * 自动标准化：ɑ -> a, ɡ -> g, ü -> v，并去除声调标记匹配基础字母笔顺
 */
export function getPinyinBiShunFileName(text) {
  let t = (text || '').toLowerCase().trim();
  t = t.replace(/ɑ/g, 'a').replace(/ɡ/g, 'g').replace(/ü/g, 'v');
  // 去除声调标记（如带调音节仍可精准匹配对应字母的笔顺图）
  t = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (/^[a-z]+$/.test(t)) {
    return t;
  }
  return '';
}

    // 声调笔画 (位于上格中)
    const TONE_PATHS = {
      1: "M -4 23 L 4 23",
      2: "M -4 25.5 L 3.5 20.5",
      3: "M -4 21.5 L 0 25.5 L 4 21.5",
      4: "M -3.5 20.5 L 4 25.5"
    };

    // 预设配置状态
    export const state = {
      category: 'shm',
      customText: 'ɑ o e i u ü\nb p m f d t n l\nɡ k h j q x\nzh ch sh r z c s\ny w',
      conciseMode: true,      // 简洁模式：默认打开，去掉页头，仅保留页码与练习内容
      showStrokeOrder: false, // 默认关闭，如用户需求所规定
      traceCount: 3,          // 描红格数，默认 3 格
      gridColor: 'red',       // red | blue | gray
      lineStyle: 'dashed-middle', // dashed-middle | solid
      orientation: 'portrait' // portrait | landscape
    };

    const COLOR_MAP = {
      red: {
        outer: '#e06a68',
        inner: '#f09695',
        bg: '#fffbfb',
        trace: '#c6ccd2'
      },
      blue: {
        outer: '#3b82f6',
        inner: '#93c5fd',
        bg: '#f8faff',
        trace: '#c6ccd2'
      },
      gray: {
        outer: '#6b7280',
        inner: '#9ca3af',
        bg: '#ffffff',
        trace: '#c6ccd2'
      }
    };

    /**
     * 将拼音字符串解析为字母序列（包括提取元音上附带的声调）
     */
    function parsePinyinSyllable(str) {
      const norm = normalizePinyin(str);
const letters = [];
for (const ch of norm) {
  if (TONE_CHAR_MAP[ch]) {
    letters.push({
      char: TONE_CHAR_MAP[ch].base,
      tone: TONE_CHAR_MAP[ch].tone
    });
  } else if (LETTER_GLYPHS[ch]) {
    letters.push({
      char: ch,
      tone: 0
    });
  }
}
return letters;
}

/**
 * 渲染单个拼音四线三格 Cell (SVG)
 * @param {Object} options
 * @param {string} options.item - 拼音字符串 (如 "b", "ɑi", "zhi")
 * @param {boolean} options.isFirstCell - 是否是每行的首格
 * @param {boolean} options.isTrace - 是否是浅灰色描红
 * @param {boolean} options.hasBiShunImage - 是否显示笔顺静态图片
 * @param {string} options.gridColor - 颜色键 (red, blue, gray)
 * @param {string} options.lineStyle - 线条样式 ('dashed-middle' | 'solid')
 */
export function renderPinyinCellSVG({
  item,
  isFirstCell = false,
  isTrace = false,
  hasBiShunImage = false,
  gridColor = 'red',
  lineStyle = 'dashed-middle'
}) {
  const colors = COLOR_MAP[gridColor] || COLOR_MAP.red;
  const isDashed = lineStyle === 'dashed-middle' || lineStyle === 'dashed';
  const dashAttr = isDashed ? 'stroke-dasharray="3,2.2"' : '';

  // 四线三格基础线：y1=16, y2=32, y3=48, y4=64
  let linesSVG = `
    <!-- 四线三格 -->
    <line x1="0" y1="16" x2="80" y2="16" stroke="${colors.outer}" stroke-width="0.8" />
    <line x1="0" y1="32" x2="80" y2="32" stroke="${colors.inner}" stroke-width="0.75" ${dashAttr} />
    <line x1="0" y1="48" x2="80" y2="48" stroke="${colors.inner}" stroke-width="0.75" ${dashAttr} />
    <line x1="0" y1="64" x2="80" y2="64" stroke="${colors.outer}" stroke-width="0.8" />
    <line x1="80" y1="16" x2="80" y2="64" stroke="${colors.outer}" stroke-width="0.5" stroke-dasharray="2,2" opacity="0.6" />
  `;

  // 若首格展示了官方静态笔顺 SVG，去掉四线三格，直接保留纯白背景
  if (hasBiShunImage) {
    return `
      <svg class="pinyin-cell-svg" viewBox="0 0 80 80" width="100%" height="100%">
        <rect width="80" height="80" fill="#ffffff" />
      </svg>
    `;
  }

  // 空白格（非首格且非描红格）
  if (!isFirstCell && !isTrace) {
    return `
      <svg class="pinyin-cell-svg" viewBox="0 0 80 80" width="100%" height="100%">
        ${linesSVG}
      </svg>
    `;
  }

  const letters = parsePinyinSyllable(item);
  if (letters.length === 0) {
    return `
      <svg class="pinyin-cell-svg" viewBox="0 0 80 80" width="100%" height="100%">
        ${linesSVG}
      </svg>
    `;
  }

  // 计算多字母横向排布
  const totalLetters = letters.length;
  let totalWidth = 0;
  const letterWidths = letters.map(l => (LETTER_GLYPHS[l.char] ? LETTER_GLYPHS[l.char].width : 20));
  totalWidth = letterWidths.reduce((a, b) => a + b, 0);

  // 针对长音节（如 3 或 4 个字母）做自适应缩放以完美契合四线三格
  let scale = 1;
  if (totalWidth > 56) {
    scale = 56 / totalWidth;
  }

  let glyphsSVG = '';
  let currentX = 40 - (totalWidth * scale) / 2;

  const strokeColor = isTrace ? colors.trace : '#1c1a17';
  const strokeWidth = isTrace ? '2.4' : (isFirstCell ? '2.8' : '2.5');

  letters.forEach((l) => {
    const glyph = LETTER_GLYPHS[l.char];
    if (!glyph) return;

    const w = glyph.width * scale;
    const cx = currentX + w / 2;
    currentX += w;

    glyph.strokes.forEach((s) => {
      const isDot = s.isDot;
      if (isDot) {
        glyphsSVG += `
          <path d="${s.d}" transform="translate(${cx}, 0) scale(${scale}, 1)" 
                fill="${strokeColor}" stroke="${strokeColor}" stroke-width="0.8" />
        `;
      } else {
        glyphsSVG += `
          <path d="${s.d}" transform="translate(${cx}, 0) scale(${scale}, 1)" 
                fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" 
                stroke-linecap="round" stroke-linejoin="round" />
        `;
      }
    });

    // 如果带有声调 (1..4)
    if (l.tone && TONE_PATHS[l.tone]) {
      const tonePath = TONE_PATHS[l.tone];
      glyphsSVG += `
        <path d="${tonePath}" transform="translate(${cx}, 0) scale(${scale}, 1)" 
              fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" 
              stroke-linecap="round" stroke-linejoin="round" />
      `;
    }
  });

  return `
    <svg class="pinyin-cell-svg" viewBox="0 0 80 80" width="100%" height="100%">
      ${linesSVG}
      ${glyphsSVG}
    </svg>
  `;
}

/**
 * 生成完整的 A4 字帖分页 HTML
 */
export function generatePinyinPages(config = state) {
  // 确定需要渲染的拼音列表
  let items = [];
  if (config.category === 'custom') {
    // 解析用户自定义输入的拼音
    const rawLines = config.customText.split(/[\n,;，；、\s]+/);
    items = rawLines.map(t => normalizePinyin(t)).filter(t => t.length > 0);
  } else {
    const cat = PINYIN_CATEGORIES[config.category] || PINYIN_CATEGORIES.shm;
    items = cat.items;
  }

  if (items.length === 0) {
    return `<div class="empty-hint">请选择分类或在自定义框中输入要练习的拼音内容</div>`;
  }

  const isPortrait = config.orientation === 'portrait';
  // 排版参数（根据 A4 尺寸经过严密几何测算）
  // 纵向 A4 (210mm x 297mm): 每行 10 格，每页 12 行
  // 横向 A4 (297mm x 210mm): 每行 14 格，每页 8 行
  const colsPerRow = isPortrait ? 10 : 14;
  const rowsPerPage = isPortrait ? 12 : 8;

  // 分页切片
  const pagesData = [];
  for (let i = 0; i < items.length; i += rowsPerPage) {
    pagesData.push(items.slice(i, i + rowsPerPage));
  }

  const totalPages = pagesData.length;
  let categoryTitle = '拼音书写字帖';
  if (config.category === 'custom') {
    categoryTitle = '拼音定制练习帖';
  } else if (PINYIN_CATEGORIES[config.category]) {
    categoryTitle = `汉语拼音${PINYIN_CATEGORIES[config.category].name}`;
  }

  let html = '';

  pagesData.forEach((pageItems, pageIdx) => {
    let rowsHTML = '';

    pageItems.forEach(item => {
      let cellsHTML = '';
      for (let c = 0; c < colsPerRow; c++) {
        const isFirstCell = c === 0;
        // 描红格由 traceCount 决定（c 在 1 到 traceCount 之间为描红）
        const isTrace = c > 0 && c <= config.traceCount;
        const biShunFileName = (isFirstCell && config.showStrokeOrder) ? getPinyinBiShunFileName(item) : '';

        const cellSVG = renderPinyinCellSVG({
          item,
          isFirstCell,
          hasBiShunImage: !!biShunFileName,
          isTrace,
          gridColor: config.gridColor,
          lineStyle: config.lineStyle
        });

        const cellClass = isFirstCell 
          ? (biShunFileName ? 'pinyin-cell model-cell bishun-cell' : 'pinyin-cell model-cell') 
          : (isTrace ? 'pinyin-cell trace-cell' : 'pinyin-cell blank-cell');

        const imgHTML = biShunFileName 
          ? `<img class="pinyin-bi-shun-img" src="/pinyin_bi_shun/${biShunFileName}.svg" alt="${item}" onerror="this.src='https://f.zt8.cn/img/pin_yin_bi_shun/${biShunFileName}.svg'" />` 
          : '';

        cellsHTML += `<div class="${cellClass}" data-col="${c}">${cellSVG}${imgHTML}</div>`;
      }

      rowsHTML += `
        <div class="pinyin-row">
          <div class="pinyin-row-label" title="${item}">${item}</div>
          <div class="pinyin-row-grids">
            ${cellsHTML}
          </div>
        </div>
      `;
    });

    // 补齐该页剩余空行（保持卷面工整铺满 A4）
    const remainingRows = rowsPerPage - pageItems.length;
    for (let r = 0; r < remainingRows; r++) {
      let emptyCellsHTML = '';
      for (let c = 0; c < colsPerRow; c++) {
        const emptyCellSVG = renderPinyinCellSVG({
          item: '',
          isFirstCell: false,
          showStrokeOrder: false,
          isTrace: false,
          gridColor: config.gridColor,
          lineStyle: config.lineStyle
        });
        emptyCellsHTML += `<div class="pinyin-cell blank-cell" data-col="${c}">${emptyCellSVG}</div>`;
      }
      rowsHTML += `
        <div class="pinyin-row empty-pinyin-row">
          <div class="pinyin-row-label"></div>
          <div class="pinyin-row-grids">
            ${emptyCellsHTML}
          </div>
        </div>
      `;
    }

    const headerHTML = !config.conciseMode ? `
        <header class="pinyin-sheet-header">
          <div class="pinyin-sheet-seal">墨</div>
          <div class="pinyin-header-text">
            <h2 class="pinyin-sheet-title">${categoryTitle}</h2>
            <div class="pinyin-sheet-info-bar">
              <span class="info-item">姓名：<span class="underline"></span></span>
              <span class="info-item">班级：<span class="underline"></span></span>
              <span class="info-item">日期：<span class="underline"></span></span>
              <span class="info-item">评价：<span class="underline"></span></span>
            </div>
          </div>
        </header>
    ` : '';

    const footerHTML = config.conciseMode ? `
        <footer class="pinyin-sheet-footer concise">
          <span>第 ${pageIdx + 1} 页 / 共 ${totalPages} 页</span>
        </footer>
    ` : `
        <footer class="pinyin-sheet-footer">
          <span>统编版语文标准四线三格 · 规范手写体</span>
          <span>第 ${pageIdx + 1} 页 / 共 ${totalPages} 页</span>
          <span>墨格 moge.site</span>
        </footer>
    `;

    html += `
      <section class="sheet pinyin-sheet ${config.orientation} ${config.conciseMode ? 'concise-mode' : ''}" data-page="${pageIdx + 1}">
        ${headerHTML}

        <div class="pinyin-sheet-content" style="--pinyin-cols: ${colsPerRow};">
          ${rowsHTML}
        </div>

        ${footerHTML}
      </section>
    `;
  });

  return html;
}

/**
 * 界面事件与绑定初始化
 */
export function initPinyinApp() {
  const container = document.getElementById('pages');
  const pageCountBadge = document.getElementById('page-count-badge');
  const conciseModeToggle = document.getElementById('concise-mode');
  const strokeOrderToggle = document.getElementById('show-stroke-order');
  const traceCountInput = document.getElementById('trace-count');
  const traceOutput = document.getElementById('trace-output');
  const customTextArea = document.getElementById('custom-pinyin-text');
  const charCount = document.getElementById('char-count');
  const customSection = document.getElementById('custom-input-section');
  const toast = document.getElementById('toast');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2200);
  }

  function render() {
    if (!container) return;
    container.innerHTML = generatePinyinPages(state);

    // 更新页数徽章
    const pages = container.querySelectorAll('.pinyin-sheet');
    if (pageCountBadge) {
      pageCountBadge.textContent = `共 ${pages.length} 页`;
    }
  }

  // 1. 分类标签切换
  const categoryTabs = document.getElementById('category-tabs');
  if (categoryTabs) {
    categoryTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-cat]');
      if (!btn) return;
      const cat = btn.getAttribute('data-cat');
      state.category = cat;

      categoryTabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');

      // 切换自定义输入区域显隐
      if (customSection) {
        if (cat === 'custom') {
          customSection.removeAttribute('hidden');
        } else {
          customSection.setAttribute('hidden', '');
        }
      }

      render();
    });
  }

  // 2. 简洁模式切换
  if (conciseModeToggle) {
    conciseModeToggle.checked = state.conciseMode;
    conciseModeToggle.addEventListener('change', (e) => {
      state.conciseMode = e.target.checked;
      showToast(state.conciseMode ? '已开启简洁模式' : '已关闭简洁模式');
      render();
    });
  }

  // 3. 笔顺开关切换
  if (strokeOrderToggle) {
    strokeOrderToggle.checked = state.showStrokeOrder;
    strokeOrderToggle.addEventListener('change', (e) => {
      state.showStrokeOrder = e.target.checked;
      showToast(state.showStrokeOrder ? '已开启首格笔顺提示' : '已关闭笔顺提示');
      render();
    });
  }

  // 3. 描红格数滑块
  if (traceCountInput) {
    traceCountInput.value = state.traceCount;
    if (traceOutput) traceOutput.textContent = `${state.traceCount} 格`;
    traceCountInput.addEventListener('input', (e) => {
      state.traceCount = parseInt(e.target.value, 10);
      if (traceOutput) traceOutput.textContent = `${state.traceCount} 格`;
      render();
    });
  }

  // 4. 四线三格颜色选择
  const colorOptions = document.getElementById('grid-color-options');
  if (colorOptions) {
    colorOptions.addEventListener('change', (e) => {
      state.gridColor = e.target.value;
      render();
    });
  }

  // 5. 中间线虚实样式选择
  const lineStyleOptions = document.getElementById('line-style-options');
  if (lineStyleOptions) {
    lineStyleOptions.addEventListener('change', (e) => {
      state.lineStyle = e.target.value;
      render();
    });
  }

  // 6. 纸张方向选择 (纵向 / 横向)
  const orientationOptions = document.getElementById('orientation-options');
  const printStyleEl = document.getElementById('print-page-style');
  if (orientationOptions) {
    orientationOptions.addEventListener('change', (e) => {
      state.orientation = e.target.value;
      if (printStyleEl) {
        printStyleEl.textContent = `@page { size: A4 ${state.orientation}; margin: 0; }`;
      }
      render();
    });
  }

  // 7. 自定义拼音输入
  if (customTextArea) {
    customTextArea.value = state.customText;
    if (charCount) charCount.textContent = `${state.customText.length} 字`;
    customTextArea.addEventListener('input', (e) => {
      state.customText = e.target.value;
      if (charCount) charCount.textContent = `${state.customText.length} 字`;
      if (state.category === 'custom') {
        render();
      }
    });
  }

  // 8. 快速清空与示例填充
  const btnClearCustom = document.getElementById('btn-clear-custom');
  if (btnClearCustom) {
    btnClearCustom.addEventListener('click', () => {
      state.customText = '';
      if (customTextArea) customTextArea.value = '';
      if (charCount) charCount.textContent = `0 字`;
      render();
    });
  }

  const btnSampleCustom = document.getElementById('btn-sample-custom');
  if (btnSampleCustom) {
    btnSampleCustom.addEventListener('click', () => {
      state.customText = 'bái yún\nchūn tiān\nhàn yǔ pīn yīn\nzhī shí jiù shì lì liàng';
      if (customTextArea) customTextArea.value = state.customText;
      if (charCount) charCount.textContent = `${state.customText.length} 字`;
      render();
    });
  }

  // 9. 打印按钮
  document.querySelectorAll('[data-print]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });

  // 10. 重置按钮
  const btnReset = document.getElementById('reset-button');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      state.category = 'shm';
      state.conciseMode = true;
      state.showStrokeOrder = false;
      state.traceCount = 3;
      state.gridColor = 'red';
      state.lineStyle = 'dashed-middle';
      state.orientation = 'portrait';
      if (conciseModeToggle) conciseModeToggle.checked = true;
      if (strokeOrderToggle) strokeOrderToggle.checked = false;
      if (traceCountInput) traceCountInput.value = 3;
      if (traceOutput) traceOutput.textContent = '3 格';
      if (categoryTabs) {
        categoryTabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.getAttribute('data-cat') === 'shm' ? 'true' : 'false'));
      }
      if (customSection) customSection.setAttribute('hidden', '');
      showToast('已恢复默认设置');
      render();
    });
  }

  // 首次渲染
  render();
}

// 页面加载完成后自动启动
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initPinyinApp();
  });
}
